import { Router } from "express";
import { googleLogin, login, logout } from "../../services/auth.service.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { isAdmin } from './../../common/middlewares/admin.middleware.js';
import * as userController from "./user.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { loginSchema, userCreateSchema, userUpdateSchema } from "./user.schema.js";
import config from "../../config/index.js";

const router = Router();
const CLIENT_ID=config.google.client_id;
const REDIRECT_URI=config.google.redirect_uri;


router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;
    const result = await login(email, password, remember, res);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authenticate, (req, res) => {
  logout(res);
  res.json({ message: "Logged out successfully" });
});

router.get("/google", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    await googleLogin(code, res);
  } catch (error) {
    console.log(error);
  }
});

router.post('/', authenticate,isAdmin,validate(userCreateSchema),userController.createUser);
router.get('/',userController.getUsers);
router.get('/:id', authenticate,isAdmin,userController.getUserById);
router.put('/:id', authenticate,isAdmin,validate(userUpdateSchema),userController.updateUser);
router.delete('/:id', authenticate,isAdmin,userController.deleteUser);

export default router;
