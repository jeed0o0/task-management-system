import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const token = user?.keycloakId || "mock-token";

  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_API_URL ?? "", {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("task:created", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("task:updated", (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.id] });
    });

    socket.on("task:deleted", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("comment:added", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token, queryClient]);

  return socketRef;
}
