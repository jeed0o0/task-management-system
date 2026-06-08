import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import keycloak from "../utils/keycloak";
import type { ApiErrorResponse } from "../types";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (keycloak.authenticated && keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401 && keycloak.authenticated) {
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed && error.config) {
          error.config.headers.Authorization = `Bearer ${keycloak.token}`;
          return client(error.config);
        }
      } catch {
        keycloak.logout();
      }
    }
    return Promise.reject(error);
  }
);

export default client;
