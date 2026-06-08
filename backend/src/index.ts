import http from "http";
import app from "./app";
import { connectDatabase } from "./config/database";
import logger from "./utils/logger";
import { initializeWebSocket } from "./utils/websocket";

const PORT = parseInt(process.env.PORT ?? "4000", 10);

async function start(): Promise<void> {
  await connectDatabase();

  const httpServer = http.createServer(app);

  initializeWebSocket(httpServer);

  // ✅ أضفنا '0.0.0.0' هنا
  httpServer.listen(PORT, "0.0.0.0", () => {
    logger.info(
      `Server running on port ${PORT} in ${process.env.NODE_ENV ?? "development"} mode`,
    );
    logger.info(`Health check: http://localhost:${PORT}/api/health`);
    logger.info(`Metrics: http://localhost:${PORT}/metrics`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    httpServer.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});
