import { getCached, setCache, invalidateCache } from "../config/redis";

const TASK_CACHE_PREFIX = "task:*";
const USER_CACHE_PREFIX = "user:*";

export async function getCachedTasks(key: string): Promise<unknown | null> {
  return getCached(key);
}

export async function cacheTasks(key: string, data: unknown): Promise<void> {
  await setCache(key, data, 300);
}

export async function invalidateTaskCache(taskId?: string): Promise<void> {
  if (taskId) {
    await invalidateCache(`task:${taskId}`);
  }
  await invalidateCache("tasks:*");
}

export async function invalidateUserCache(userId?: string): Promise<void> {
  if (userId) {
    await invalidateCache(`user:${userId}`);
  }
  await invalidateCache("users:*");
}
