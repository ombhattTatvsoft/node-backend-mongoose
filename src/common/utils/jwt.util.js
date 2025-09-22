import jwt from "jsonwebtoken";
import config from "../../config/index.js";

export const signAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.access_secret, {
    expiresIn: 7*24*60*60,
  });
};

export const verifyAccesToken = (token) => {
    return jwt.verify(token, config.jwt.access_secret);
}
