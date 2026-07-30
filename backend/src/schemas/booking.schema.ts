import Joi from "joi";

export const createBookingSchema = Joi.object({
  roomId: Joi.string().required().messages({
    "any.required": "'roomId' є обов'язковим",
  }),
  title: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Назва бронювання обов'язкова",
    "string.max": "Назва бронювання занадто довга (макс. 100 символів)",
    "any.required": "Назва бронювання обов'язкова",
  }),
  startAt: Joi.date().iso().required().messages({
    "date.base": "Невалідна дата початку",
    "any.required": "Час початку обов'язковий",
  }),
  endAt: Joi.date().iso().required().messages({
    "date.base": "Невалідна дата кінця",
    "any.required": "Час кінця обов'язковий",
  }),
});

export const bookingsMeQuerySchema = Joi.object({
  section: Joi.string().valid("upcoming", "past").default("upcoming"),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
});
