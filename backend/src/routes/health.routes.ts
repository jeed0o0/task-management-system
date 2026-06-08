import { Router, Request, Response } from "express";
import { prisma } from "../config/database";
import { redis } from "../config/redis";

const router = Router();

router.get("/health", async (_req: Request, res: Response) => {
  const checks: Record<string, string> = {};

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "healthy";
  } catch {
    checks.database = "unhealthy";
  }

  try {
    await redis.ping();
    checks.redis = "healthy";
  } catch {
    checks.redis = "unhealthy";
  }

  const allHealthy = Object.values(checks).every((s) => s === "healthy");
  res.status(allHealthy ? 200 : 503).json({
    success: true,
    data: {
      status: allHealthy ? "healthy" : "degraded",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks,
    },
  });
});

export default router;
