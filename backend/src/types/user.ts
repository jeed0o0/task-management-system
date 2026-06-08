// ✅ Use string literal instead of Prisma enum
export type Role = "ADMIN" | "MANAGER" | "USER";

export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  role?: Role;
}

export interface UpdateUserInput {
  name?: string;
  username?: string;
  avatar?: string;
  role?: Role;
}
