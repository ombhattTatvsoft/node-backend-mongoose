import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { projectCreateSchema, projectUpdateSchema } from "./project.schema.js";
import * as projectController from "./project.controller.js";

const router = Router();

router.post('/', authenticate,validate(projectCreateSchema),projectController.createProject);
router.get('/getProjects',authenticate,projectController.getProjects);
router.get('/:id', authenticate,projectController.getProject);
router.put('/:id', authenticate,validate(projectUpdateSchema),projectController.updateProject);
router.delete('/:id', authenticate,projectController.deleteProject);

export default router;
