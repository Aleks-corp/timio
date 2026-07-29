import type { Schema } from "joi";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import HttpError from "../utils/httperror.utils.js";

const validateBody = (schema: Schema): RequestHandler => {
  const func = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return func;
};

export default validateBody;
