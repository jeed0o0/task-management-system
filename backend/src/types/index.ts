export interface PaginationParams {
  page: number;
  limit: number;
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

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: unknown;
}

export interface WebSocketEvent {
  type: "TASK_CREATED" | "TASK_UPDATED" | "TASK_DELETED" | "COMMENT_ADDED" | "NOTIFICATION";
  payload: unknown;
  timestamp: string;
}
