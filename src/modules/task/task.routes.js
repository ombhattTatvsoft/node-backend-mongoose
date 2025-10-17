import { Router } from "express";
import * as taskController from "./task.controller.js";
import { authenticate } from "./../../common/middlewares/auth.middleware.js";
import { createStorage } from "./../../common/utils/storageCreator.utils.js";
import multer from "multer";

const router = Router();
const storage = createStorage("taskAttachments");
const upload = multer({ storage });

router.post("/createTask", authenticate,upload.array("attachments"), taskController.createTask);
router.put("/editTask", authenticate,upload.array("attachments"), taskController.editTask);
router.put("/updateTaskStatus", authenticate, taskController.updateTaskStatus);
router.get("/getTasks/:projectId", authenticate, taskController.getTasks);
router.delete("/deleteTask/:id", authenticate, taskController.deleteTask);

router.put(
  "/:taskId/attachments",
  authenticate,
  upload.array("attachments"),
  taskController.saveTaskAttachments
);

export default router;
