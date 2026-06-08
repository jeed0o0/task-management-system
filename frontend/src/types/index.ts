export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
}

export interface User {
  id: string;
  keycloakId: string;
  email: string;
  username: string;
  role: Role;
  avatar?: string;
  createdAt: string;
  _count?: {
    assignedTasks: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  assigneeId?: string;
  creator: Pick<User, "id" | "username" | "email" | "avatar">;
  assignee?: Pick<User, "id" | "username" | "email" | "avatar">;
  _count?: { comments: number };
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Pick<User, "id" | "username" | "email" | "avatar">;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
