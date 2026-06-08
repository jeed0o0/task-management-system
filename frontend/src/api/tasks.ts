import client from "./client";
import type { Task, Comment, TaskFilters, PaginatedResponse } from "../types";

export async function fetchTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const { data } = await client.get(`/api/tasks?${params}`);
  return { data: data.data, meta: data.meta };
}

export async function fetchTask(id: string): Promise<Task> {
  const { data } = await client.get(`/api/tasks/${id}`);
  return data.data;
}

export async function createTask(task: {
  title: string;
  description?: string;
  priority?: string;
  assigneeId?: string;
}): Promise<Task> {
  const { data } = await client.post("/api/tasks", task);
  return data.data;
}

export async function updateTask(id: string, task: Partial<Task>): Promise<Task> {
  const { data } = await client.patch(`/api/tasks/${id}`, task);
  return data.data;
}

export async function deleteTask(id: string): Promise<void> {
  await client.delete(`/api/tasks/${id}`);
}

export async function addComment(taskId: string, content: string): Promise<Comment> {
  const { data } = await client.post(`/api/tasks/${taskId}/comments`, { content });
  return data.data;
}
