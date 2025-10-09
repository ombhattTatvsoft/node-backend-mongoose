import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { projectCreateSchema } from "./project.schema.js";
import * as projectController from "./project.controller.js";

const router = Router();

router.post('/createProject', authenticate,validate(projectCreateSchema),projectController.createProject);
router.get('/getProjects',authenticate,projectController.getProjects);
router.put('/editProject', authenticate,projectController.updateProject);
router.delete('/deleteProject/:id', authenticate,projectController.deleteProject);

// router.get('/:id', authenticate,projectController.getProject);

export default router;
