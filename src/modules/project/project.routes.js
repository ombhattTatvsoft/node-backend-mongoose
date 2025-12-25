import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import * as projectController from "./project.controller.js";
import { isMember } from './../../common/middlewares/isMember.middleware.js';

const router = Router();

router.post('/createProject', authenticate,projectController.createProject);
router.get('/getProjects',authenticate,projectController.getProjects);
router.put('/editProject', authenticate,projectController.updateProject);
router.delete('/deleteProject/:id', authenticate,projectController.deleteProject);
// router.get('/getProjectMembers/:id',projectController.getProjectMembers);
router.get('/getProject/:id',authenticate,isMember,projectController.getProject);

export default router;
