import { Router } from "express";
import * as taskController from "./task.controller.js";
import { authenticate } from "./../../common/middlewares/auth.middleware.js";
import { createStorage } from "./../../common/utils/storageCreator.utils.js";
import multer from "multer";

const router = Router();
const storage = createStorage("taskAttachments");
const commentImagesStorage = createStorage("commentImages");
const upload = multer({ storage });
const commentImagesupload = multer({ storage : commentImagesStorage });

router.post("/createTask", authenticate,upload.array("attachments"), taskController.createTask);
router.put("/editTask", authenticate,upload.array("attachments"), taskController.editTask);
router.put("/updateTaskStatus", authenticate, taskController.updateTaskStatus);
router.get("/getTasks/:projectId", authenticate, taskController.getTasks);
router.delete("/deleteTask/:id", authenticate, taskController.deleteTask);
router.get("/getTask/:taskId", authenticate, taskController.getTask);
router.put("/addComment", authenticate, taskController.addComment);
router.put(
  "/saveAttachments",
  authenticate,
  upload.array("attachments"),
  taskController.saveTaskAttachments
);

router.post('/comment/image',authenticate, commentImagesupload.single('upload'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { message: 'No file uploaded' } });
  }
  const imageUrl = `http://localhost:4000/api/uploads/commentImages/${req.user._id}-${req.file.originalname}`;
  res.json({ url: imageUrl });
});

router.get(
  "/getTaskActivities/:taskId",
  authenticate,
  taskController.getTaskActivities
);

export default router;
