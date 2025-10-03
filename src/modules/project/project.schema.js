import Joi from "joi";
import { startOfToday } from "date-fns";

export const projectCreateSchema = Joi.object({
  name: Joi.string().trim().max(30).required(),
  description: Joi.string().allow("").max(200),
  startDate: Joi.date().min(startOfToday()).required(),
  endDate: Joi.date().min(Joi.ref("startDate")).required(),
  status: Joi.string().valid("pending", "in-progress", "completed").required(),
  // priority: Joi.string().valid("low", "medium", "high").optional(),
  members: Joi.array().items(
    Joi.object({
      user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      role: Joi.string().valid("owner", "manager", "developer")
                .default("developer")
    })
  ).optional()
});

export const projectUpdateSchema = Joi.object({
  name: Joi.string().trim().max(30),
  description: Joi.string().allow("").max(200),
  startDate: Joi.date().min("now"),
  endDate: Joi.date().min(Joi.ref("startDate")),
  status: Joi.string().valid("pending", "in-progress", "completed"),
  members: Joi.array().items(
    Joi.object({
      user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      role: Joi.string().valid("owner", "manager", "developer")
                .default("developer")
    })
  ).optional()
}).min(1);
