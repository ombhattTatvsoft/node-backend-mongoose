import Joi from "joi";
import { startOfToday } from "date-fns";

export const projectCreateSchema = Joi.object({
  name: Joi.string().trim().max(30).required(),
  description: Joi.string().allow("").max(500),
  startDate: Joi.date().min(startOfToday()).required(),
  endDate: Joi.date().min(Joi.ref("startDate")).required(),
  status: Joi.string().valid("pending", "in-progress", "completed").required(),
  // priority: Joi.string().valid("low", "medium", "high").optional(),
  members: Joi.array()
    .items(
      Joi.object({
        email: Joi.string().email().required(),
        // user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        role: Joi.string()
          .valid("manager", "developer", "tester")
          .default("developer"),
      })
    )
    .optional(),
});