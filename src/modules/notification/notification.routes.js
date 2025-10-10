import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import * as notificationController from "./notification.controller.js";

const router = Router();

router.get('/',authenticate,notificationController.getNotifications);
router.put('/mark-read', authenticate,notificationController.markAllAsRead);

export default router;

