import Joi from "joi";

export const userCreateSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  googleId: Joi.string(),
});

export const userUpdateSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(8),
});
