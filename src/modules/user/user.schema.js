import Joi from "joi";

export const userCreateSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  googleId: Joi.string(),
  role: Joi.string().valid("user", "admin").default("user"),
});

export const userUpdateSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(8),
  role: Joi.string().valid("user", "admin"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  remember: Joi.boolean().default(false),
});

export const singupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmpassword: Joi.string().min(8).required(),
});
