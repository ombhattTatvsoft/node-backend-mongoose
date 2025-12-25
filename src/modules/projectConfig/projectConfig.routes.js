import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { isMember } from "../../common/middlewares/isMember.middleware.js";
import * as projectConfigController from "./projectConfig.controller.js";

const router = Router();

router.get('/getProjectConfig/:id',authenticate,isMember,projectConfigController.getProjectConfig);
router.put('/projectConfig/updateTaskStages',authenticate,isMember,projectConfigController.updateTaskStages);

export default router;
