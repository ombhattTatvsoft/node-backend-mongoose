import config from "../../config/index.js";
import bcrypt from "bcryptjs";
import { signAccessToken } from "../../common/utils/jwt.util.js";
import User from "../user/user.model.js";
import jwt from "jsonwebtoken";
import axios, { HttpStatusCode } from "axios";
import * as userService from "../user/user.service.js";
import userRepo from "../user/user.repo.js";
import { success } from "../../common/utils/response.js";

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

export const login = async (email, password, remember, res) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");
  signAndSendToken(user,remember, res);
  success({res:res,message:"Logged in successfully",data:{user}})
};

export const signup = async (email, password, res) => {
  let user = await userService.getUserByEmail(email);
  if (!user) {
    user = await userRepo.create({ email, password });
  } else if (!user.password) {
    password = await bcrypt.hash(password, 10);
    user = await userRepo.updateById(user._id, { password });
  }
  else
    throw new Error("Email already in use");
  signAndSendToken(user, false, res);
  success({res:res,message:"Logged in successfully",data:{user}})
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
  const { email, sub: googleId } = payload;

  // DB logic
  let user = await userService.getUserByEmail(email);
  if (!user) {
    user = await userRepo.create({ email, googleId });
  } else if (!user.googleId) {
    user = await userRepo.updateById(user._id, { googleId });
  }
  signAndSendToken(user,false, res);
  res.redirect(FRONTEND_URL);
};

const signAndSendToken = (user, remember, res) => {
  const payload = { id: user._id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  res.cookie("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
  });
}