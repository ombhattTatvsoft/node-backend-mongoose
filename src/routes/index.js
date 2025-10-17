import { Router } from "express";
import userRoutes from "../modules/user/user.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import projectRoutes from "../modules/project/project.routes.js";
import notificationRoutes from "../modules/notification/notification.routes.js";
import taskRoutes from "../modules/task/task.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/project", projectRoutes);
router.use("/notifications", notificationRoutes);
router.use("/task", taskRoutes);
router.use("/users", userRoutes);

export default router;
