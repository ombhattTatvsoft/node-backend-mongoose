import { Router } from "express";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { loginSchema, singupSchema } from "./auth.schema.js";
import { COOKIE_OPTIONS, googleLogin, login, signup } from "./auth.service.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import config from "../../config/index.js";
import { success } from "../../common/utils/response.js";

const router = Router();

const CLIENT_ID=config.google.client_id;
const REDIRECT_URI=config.google.redirect_uri;

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;
    return await login(email, password, remember, res);
  } catch (error) {
    next(error);
  }
});

router.post("/signup", validate(singupSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    return await signup(email, password, res);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  return success({res, message:"Logged out successfully"});
})

router.get("/me", authenticate, async (req, res, next) => {
  try {
    return success({res,data:{user : req.user}});
  } catch (error) {
    next(error);
  }
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

export default router;