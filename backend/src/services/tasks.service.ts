import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { ApiError } from "../utils/ApiError";
import { CreateTaskInput, UpdateTaskInput, TaskFilters } from "../types/task";
import {
  getCachedTasks,
  cacheTasks,
  invalidateTaskCache,
} from "./cache.service";
import { emitTaskUpdate } from "../utils/websocket";
import { tasksCreatedTotal, tasksCompletedTotal } from "../config/prometheus";

export class TasksService {
  async findAll(filters: TaskFilters, userId: string, userRole: string) {
    const cacheKey = `tasks:${JSON.stringify(filters)}`;
    const cached = await getCachedTasks(cacheKey);
    if (cached) return cached;

    const where: Prisma.TaskWhereInput = {};

    if (userRole !== "ADMIN") {
      where.OR = [{ creatorId: userId }, { assigneeId: userId }];
    }

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters.creatorId) where.creatorId = filters.creatorId;

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          creator: {
            select: { id: true, username: true, email: true, avatar: true },
          },
          assignee: {
            select: { id: true, username: true, email: true, avatar: true },
          },
          comments: { select: { id: true } },
        },
      }),
      prisma.task.count({ where }),
    ]);

    const dataWithCount = data.map((task) => ({
      ...task,
      _count: { comments: task.comments?.length ?? 0 },
      comments: undefined,
    }));

    const result = {
      data: dataWithCount,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    await cacheTasks(cacheKey, result);
    return result;
  }

  async findById(id: string) {
    const cacheKey = `task:${id}`;
    const cached = await getCachedTasks(cacheKey);
    if (cached) return cached;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, username: true, email: true, avatar: true },
        },
        assignee: {
          select: { id: true, username: true, email: true, avatar: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, username: true, email: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!task) throw ApiError.notFound("Task not found");

    await cacheTasks(cacheKey, task);
    return task;
  }

  async create(input: CreateTaskInput, userId: string) {
    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        creatorId: "admin-1", // ✅ ثابت
        assigneeId: input.assigneeId,
      },
      include: {
        creator: {
          select: { id: true, username: true, email: true, avatar: true },
        },
      },
    });

    tasksCreatedTotal.inc();
    await invalidateTaskCache();
    emitTaskUpdate(task.id, "task:created", task);

    return task;
  }

  async update(id: string, input: UpdateTaskInput, userId: string) {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Task not found");

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate:
          input.dueDate !== undefined
            ? input.dueDate
              ? new Date(input.dueDate)
              : null
            : undefined,
        assigneeId:
          input.assigneeId !== undefined ? input.assigneeId : undefined,
      },
      include: {
        creator: {
          select: { id: true, username: true, email: true, avatar: true },
        },
        assignee: {
          select: { id: true, username: true, email: true, avatar: true },
        },
      },
    });

    if (input.status === "DONE" && existing.status !== "DONE") {
      tasksCompletedTotal.inc();
    }

    await invalidateTaskCache(id);
    emitTaskUpdate(id, "task:updated", task);

    return task;
  }

  async delete(id: string) {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Task not found");

    await prisma.task.delete({ where: { id } });
    await invalidateTaskCache(id);
    emitTaskUpdate(id, "task:deleted", { id });
  }

  async addComment(taskId: string, content: string, authorId: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw ApiError.notFound("Task not found");

    const comment = await prisma.comment.create({
      data: { content, taskId, authorId },
      include: {
        author: {
          select: { id: true, username: true, email: true, avatar: true },
        },
      },
    });

    await invalidateTaskCache(taskId);
    emitTaskUpdate(taskId, "comment:added", comment);

    return comment;
  }
}

export const tasksService = new TasksService();
