import { Router } from "express";
import { login, logout } from "../../services/auth.service.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { isAdmin } from './../../common/middlewares/admin.middleware.js';
import * as userController from "./user.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { loginSchema, userCreateSchema, userUpdateSchema } from "./user.schema.js";

const router = Router();

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password, res);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authenticate, (req, res) => {
  logout(res);
  res.json({ message: "Logged out successfully" });
});

router.post('/', authenticate,isAdmin,validate(userCreateSchema),userController.createUser);
router.get('/', authenticate,isAdmin,userController.getUsers);
router.get('/:id', authenticate,isAdmin,userController.getUserById);
router.put('/:id', authenticate,isAdmin,validate(userUpdateSchema),userController.updateUser);
router.delete('/:id', authenticate,isAdmin,userController.deleteUser);

export default router;
