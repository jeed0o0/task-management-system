import { z } from "zod";

// ✅ Use string literal instead of Prisma enum
export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100),
  username: z.string().min(3).max(50).optional(),
  avatar: z.string().url().optional(),
  role: z.enum(["ADMIN", "MANAGER", "USER"]).optional().default("USER"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z.string().min(3).max(50).optional(),
  avatar: z.string().url().optional(),
  role: z.enum(["ADMIN", "MANAGER", "USER"]).optional(),
});
