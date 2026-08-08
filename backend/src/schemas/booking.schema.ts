import Joi from "joi";

export const createBookingSchema = Joi.object({
  roomId: Joi.string().required().messages({
    "any.required": "'roomId' is required",
  }),
  title: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Booking title is required",
    "string.max": "Booking title is too long (max 100 characters)",
    "any.required": "Booking title is required",
  }),
  startAt: Joi.date().iso().required().messages({
    "date.base": "Invalid start date",
    "any.required": "Start time is required",
  }),
  endAt: Joi.date().iso().required().messages({
    "date.base": "Invalid end date",
    "any.required": "End time is required",
  }),
});

export const bookingsMeQuerySchema = Joi.object({
  section: Joi.string().valid("upcoming", "past").default("upcoming"),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
});
