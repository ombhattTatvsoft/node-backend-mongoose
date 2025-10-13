import config from "../../config/index.js";
import bcrypt from "bcryptjs";
import { signAccessToken } from "../../common/utils/jwt.util.js";
import User from "../user/user.model.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import * as userService from "../user/user.service.js";
import userRepo from "../user/user.repo.js";
import { success } from "../../common/utils/response.js";
import ProjectInvite from './../project/models/projectInvite.model.js';
import ProjectMember from './../project/models/projectMember.model.js';
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.env === "production",
  sameSite: "Strict",
  path: "/",
};
const CLIENT_ID = config.google.client_id;
const REDIRECT_URI = config.google.redirect_uri;
const CLIENT_SECRET = config.google.client_secret;
const FRONTEND_URL = config.cors.origin;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const login = async (email, password, remember, res) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");
  signAndSendToken(user, remember, res);
  success({ res: res, message: "Logged in successfully", data: { user } });
};

export const signup = async (name, email, password, res) => {
  let user = await userService.getUserByEmail(email);
  if (!user) {
    user = await userRepo.create({ name, email, password });
    addIfInvited(user);
  } else if (!user.password) {
    password = await bcrypt.hash(password, 10);
    user = await userRepo.updateById(user._id, { password });
  } else throw new Error("Email already in use");
  signAndSendToken(user, false, res);
  success({ res: res, message: "Logged in successfully", data: { user } });
};

export const googleLogin = async (code, res) => {
  // Exchange code for tokens
  const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });
  const { id_token } = tokenRes.data;
  // Decode user info
  const payload = jwt.decode(id_token);
  const { name, email, sub: googleId, picture } = payload;

  // DB logic
  let user = await userService.getUserByEmail(email);
  if (!user) {
    user = await userRepo.create({ name, email, googleId, avatar : picture });
    addIfInvited(user);
  } else if (!user.googleId) {
    const payload = {googleId};
    if(!user.avatar)
      payload = {...payload, avatar : picture}
    user = await userRepo.updateById(user._id, payload);
  }
  signAndSendToken(user, false, res);
  res.redirect(FRONTEND_URL);
};

export const changePassword = async (currentPassword, newPassword, userId, res) => {
  const user = await userService.getUserById(userId);
  if (!user) throw Error('User not found');
  if(!user.password) throw Error('You have signed up using google, Sign up first using Password.')
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw Error('Current password is incorrect');
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepo.updateById(userId, { password : hashedPassword });
  success({res,message:'Password changed successfully'});
}

export const updateProfile = async (req,res) => {
  const user = await userService.getUserById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { name } = req.body;
  if (name) user.name = name;
  if (req.file) {
    if (user.avatar) {
      const oldPath = path.join(process.cwd(), "uploads", "avatars", path.basename(user.avatar));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.avatar = `/uploads/avatars/${req.file.filename}`;
  }
  await user.save();
  success({res,message:'Profile updated successfully',data:{user}});
}

const signAndSendToken = (user, remember, res) => {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
  const accessToken = signAccessToken(payload);
  res.cookie("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
  });
};

const addIfInvited = async (newUser) => {
  const pendingInvites = await ProjectInvite.find({ email: newUser.email,status:"pending" });
  if(!pendingInvites.length)
    return;
  const membersToInsert = pendingInvites.map((p) => ({
    projectId: p.projectId,
      userId: newUser._id,
      role: p.role,
  }));
  await ProjectMember.insertMany(membersToInsert);
  await ProjectInvite.updateMany(
    { email: newUser.email, status: "pending" },
    { $set: { status: "accepted" } }
  );
};

// router.put(
//   "/update-profile",
//   authenticate,
//   upload.single("avatar"),
//   async (req, res, next) => {
//     try {
//       const user = await User.findById(req.user._id);
//       if (!user) return res.status(404).json({ message: "User not found" });

//       const { name } = req.body;

//       if (name) user.name = name;

//       if (req.file) {
//         if (user.avatar) {
//           const oldPath = path.join(__dirname, "../uploads/avatars", path.basename(user.avatar));
//           if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//         }

//         user.avatar = `/uploads/avatars/${req.file.filename}`;
//       }

//       await user.save();

//       res.status(200).json({ message: "Profile updated successfully", data: { user } });
//     } catch (err) {
//       next(err);
//     }
//   }
// );
