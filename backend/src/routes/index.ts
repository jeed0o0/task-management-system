import { Router } from "express";
import taskRoutes from "./tasks.routes";
import userRoutes from "./users.routes";
import healthRoutes from "./health.routes";

const router = Router();

router.use("/api", healthRoutes);
router.use("/api/tasks", taskRoutes);
router.use("/api/users", userRoutes);

export default router;
