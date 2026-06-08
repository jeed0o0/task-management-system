import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateUserSchema } from "../validators/user.validator";

const router = Router();

router.use(requireAuth);

router.get("/", requireRole("ADMIN"), usersController.findAll.bind(usersController));
router.get("/:id", usersController.findById.bind(usersController));
router.patch("/:id", validate(updateUserSchema), usersController.update.bind(usersController));

export default router;
