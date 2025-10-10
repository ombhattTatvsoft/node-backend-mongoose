import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { isAdmin } from './../../common/middlewares/admin.middleware.js';
import * as userController from "./user.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { userCreateSchema, userUpdateSchema } from "./user.schema.js";

const router = Router();

router.get('/:id', authenticate,isAdmin,userController.getUserById);

router.post('/', authenticate,isAdmin,validate(userCreateSchema),userController.createUser);
router.get('/',userController.getUsers);
router.put('/:id', authenticate,isAdmin,validate(userUpdateSchema),userController.updateUser);
router.delete('/:id', authenticate,isAdmin,userController.deleteUser);

export default router;
