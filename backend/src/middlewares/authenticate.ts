import type { Request, Response, NextFunction } from "express";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../utils/index.js";
import { verifyToken } from "../services/index.js";
import { AUTH_COOKIE_NAME } from "../constants/index.js";

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    throw HttpError(401, "Not authenticated");
  }
  req.userId = verifyToken(token);
  next();
};

export default ctrlWrapper(authenticate);
