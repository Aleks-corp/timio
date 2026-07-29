import type { Schema } from "joi";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { HttpError } from "../utils/index.js";

const validateBody = (schema: Schema): RequestHandler => {
  const func = (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
      return;
    }
    req.body = value;
    next();
  };
  return func;
};

export default validateBody;
