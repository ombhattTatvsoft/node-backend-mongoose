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
    const { name, email, password } = req.body;
    return await signup(name, email, password, res);
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

router.put('/change-password', authenticate, async (req, res, next) => {

});
router.put("/change-password", authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
});
router.put('/update-profile', authenticate,async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
});

export default router;