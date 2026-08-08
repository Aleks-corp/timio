import Joi from "joi";

export const roomsQuerySchema = Joi.object({
  minCapacity: Joi.number().integer().min(1).optional().messages({
    "number.base": "'minCapacity' must be a number",
  }),
});

export const roomBookingsQuerySchema = Joi.object({
  weekStart: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .messages({
      "string.pattern.base": "'weekStart' must be in YYYY-MM-DD format",
    }),
});

export const availabilityQuerySchema = Joi.object({
  roomId: Joi.string().required(),
  startAt: Joi.date().iso().required().messages({
    "date.base": "Invalid start date",
    "any.required": "'startAt' is required",
  }),
  endAt: Joi.date().iso().required().messages({
    "date.base": "Invalid end date",
    "any.required": "'endAt' is required",
  }),
});
