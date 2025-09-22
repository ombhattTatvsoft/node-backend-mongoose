import config from "../config/index.js"
import bcrypt from "bcryptjs";
import { signAccessToken } from "../common/utils/jwt.util.js";
import User from "../modules/user/user.model.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'Strict'
}

export const login = async (email,password,res) => {
    const user = await User.findOne({email});
    if(!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password,user.password);
    if(!valid) throw new Error('Invalid credentials');
    const payload = {id: user._id, role: user.role};
    const accessToken = signAccessToken(payload);
    res.cookie('accessToken',accessToken,{...COOKIE_OPTIONS,maxAge: config.jwt.access_expiry})
    return {user : {id: user._id, role: user.role, email: user.email}}
}

export const logout = (res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
}
