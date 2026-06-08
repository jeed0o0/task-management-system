import { prisma } from "../config/database";
import { ApiError } from "../utils/ApiError";
import { CreateUserInput, UpdateUserInput } from "../types/user";

export class UsersService {
  async findAll() {
    return prisma.user.findMany({
      include: {
        _count: {
          select: {
            createdTasks: true,
            assignedTasks: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        createdTasks: true,
        assignedTasks: true,
      },
    });
    if (!user) throw ApiError.notFound("User not found");
    return user;
  }

  async create(input: CreateUserInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) throw ApiError.conflict("Email already exists");

    return prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        username: input.username,
        avatar: input.avatar,
        role: input.role ?? "USER",
      },
    });
  }

  async update(id: string, input: UpdateUserInput) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("User not found");

    return prisma.user.update({
      where: { id },
      data: {
        name: input.name,
        username: input.username,
        avatar: input.avatar,
        role: input.role,
      },
    });
  }

  async delete(id: string) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("User not found");

    await prisma.user.delete({ where: { id } });
  }
}

export const usersService = new UsersService();
