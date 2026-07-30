import type { Schema } from "joi";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { HttpError } from "../utils/index.js";

const validateQuery = (schema: Schema): RequestHandler => {
  const func = (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      next(HttpError(400, error.message));
      return;
    }
    // req.query re-parses from the raw string on every access in Express 5
    // (a getter, not a cached value), so the coerced result can't be written
    // back onto it — stash it on req.validatedQuery instead.
    req.validatedQuery = value;
    next();
  };
  return func;
};

export default validateQuery;
