import { Router } from "express";
import { tasksController } from "../controllers/tasks.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createTaskSchema, updateTaskSchema, taskFiltersSchema, createCommentSchema } from "../validators/task.validator";

const router = Router();

router.use(requireAuth);

router.get("/", validate(taskFiltersSchema, "query"), tasksController.findAll.bind(tasksController));
router.get("/:id", tasksController.findById.bind(tasksController));
router.post("/", validate(createTaskSchema), tasksController.create.bind(tasksController));
router.patch("/:id", validate(updateTaskSchema), tasksController.update.bind(tasksController));
router.delete("/:id", tasksController.delete.bind(tasksController));
router.post("/:id/comments", validate(createCommentSchema), tasksController.addComment.bind(tasksController));

export default router;
