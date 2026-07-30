import Joi from "joi";

export const roomsQuerySchema = Joi.object({
  minCapacity: Joi.number().integer().min(1).optional().messages({
    "number.base": "'minCapacity' має бути числом",
  }),
});

export const roomBookingsQuerySchema = Joi.object({
  weekStart: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .messages({
      "string.pattern.base": "'weekStart' має бути у форматі YYYY-MM-DD",
    }),
});

export const availabilityQuerySchema = Joi.object({
  roomId: Joi.string().required(),
  startAt: Joi.date().iso().required().messages({
    "date.base": "Невалідна дата початку",
    "any.required": "'startAt' є обов'язковим",
  }),
  endAt: Joi.date().iso().required().messages({
    "date.base": "Невалідна дата кінця",
    "any.required": "'endAt' є обов'язковим",
  }),
});
