import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import logger from "./logger";

let io: SocketServer | null = null;

export function initializeWebSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    socket.on("join:task", (taskId: string) => {
      socket.join(`task:${taskId}`);
      logger.debug(`Socket ${socket.id} joined task:${taskId}`);
    });

    socket.on("leave:task", (taskId: string) => {
      socket.leave(`task:${taskId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`WebSocket client disconnected: ${socket.id}`);
    });
  });

  logger.info("WebSocket server initialized");
  return io;
}

export function getIO(): SocketServer {
  if (!io) throw new Error("WebSocket server not initialized");
  return io;
}

export function emitTaskUpdate(taskId: string, event: string, data: unknown): void {
  if (io) {
    io.to(`task:${taskId}`).emit(event, data);
  }
}

export function emitNotification(userId: string, notification: unknown): void {
  if (io) {
    io.emit(`notification:${userId}`, notification);
  }
}
