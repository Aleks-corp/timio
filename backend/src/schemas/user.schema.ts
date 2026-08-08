import Joi from "joi";

import { EMAIL_REGEXP } from "../constants/index.js";

export const usersRegSchema = Joi.object({
  name: Joi.string().required().min(3).max(18).messages({
    "string.empty": `'name' cannot be an empty field`,
    "any.required": `missing required 'name' field`,
  }),
  email: Joi.string().trim().lowercase().pattern(EMAIL_REGEXP).required().messages({
    "string.pattern.base": `'email' should be a type of 'email'`,
    "string.empty": `'email' cannot be an empty field`,
    "any.required": `missing required 'email' field`,
    "any.invalid": `Temporary emails are not allowed`,
  }),
  password: Joi.string().min(8).max(72).required().messages({
    "string.pattern.base": "Password must be 8-72 characters",
    "string.empty": "Password cannot be empty",
    "any.required": "'password' field is required",
  }),
});

export const oauthUpsertSchema = Joi.object({
  provider: Joi.string().required(),
  providerId: Joi.string().required(),
  email: Joi.string().trim().lowercase().pattern(EMAIL_REGEXP).required().messages({
    "string.pattern.base": `'email' should be a type of 'email'`,
    "string.empty": `'email' cannot be an empty field`,
    "any.required": `missing required 'email' field`,
  }),
  name: Joi.string().required().min(1).max(100),
  avatar: Joi.string().uri().optional(),
});

export const usersLoginSchema = Joi.object({
  email: Joi.string().trim().lowercase().pattern(EMAIL_REGEXP).required().messages({
    "string.pattern.base": `'email' should be a type of 'email'`,
    "string.empty": `'email' cannot be an empty field`,
    "any.required": `missing required 'email' field`,
  }),
  password: Joi.string().min(8).max(72).required().messages({
    "string.pattern.base": "Password must be 8-72 characters",
    "string.empty": "Password cannot be empty",
    "any.required": "'password' field is required",
  }),
});
