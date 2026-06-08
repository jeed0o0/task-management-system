import client from "./client";
import type { User } from "../types";

export async function getCurrentUser(): Promise<User> {
  const { data } = await client.get("/api/auth/me");
  return data.data;
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await client.get("/api/users");
  return data.data;
}
