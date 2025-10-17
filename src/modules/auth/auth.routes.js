import { Router } from "express";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { loginSchema, singupSchema } from "./auth.schema.js";
import { changePassword, COOKIE_OPTIONS, googleLogin, login, signup, updateProfile } from "./auth.service.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import config from "../../config/index.js";
import { success } from "../../common/utils/response.js";
import multer from "multer";
import { createStorage } from "../../common/utils/storageCreator.utils.js";

const router = Router();

const CLIENT_ID=config.google.client_id;
const REDIRECT_URI=config.google.redirect_uri;

const storage = createStorage('avatar');

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG files are allowed"));
    }
    cb(null, true);
  },
});

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

router.put("/change-password", authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    return await changePassword(currentPassword, newPassword, userId, res);
  } catch (error) {
    next(error);
  }
});

router.put("/update-profile", authenticate, upload.single("avatar"), async (req, res, next) => {
  try {
    return await updateProfile(req,res);
  } catch (error) {
    next(error);
  }
});

export default router;