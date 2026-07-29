import type { Request, Response } from "express";
import { ctrlWrapper } from "../decorators/index.js";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE_MS } from "../constants/index.js";
import { authCookieOptions } from "../utils/index.js";
import {
  registerUser,
  loginUser,
  oauthUpsertUser,
  getCurrentUser,
} from "../services/index.js";

const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  const { token, user } = await registerUser({ name, email, password });

  res.cookie(AUTH_COOKIE_NAME, token, {
    ...authCookieOptions(),
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
  });
  res.status(201).json({ user });
};

const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const { token, user } = await loginUser({ email, password });

  res.cookie(AUTH_COOKIE_NAME, token, {
    ...authCookieOptions(),
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
  });
  res.json({ user });
};

const oauthUpsert = async (req: Request, res: Response): Promise<void> => {
  const { email, name, avatar, provider, providerId } = req.body;
  const { token, user } = await oauthUpsertUser({
    email,
    name,
    avatar,
    provider,
    providerId,
  });

  res.cookie(AUTH_COOKIE_NAME, token, {
    ...authCookieOptions(),
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
  });
  res.json({ user });
};

const signout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions());
  res.status(204).end();
};

const current = async (req: Request, res: Response): Promise<void> => {
  const user = await getCurrentUser(req.userId as string);
  res.json({ user });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  oauthUpsert: ctrlWrapper(oauthUpsert),
  signout: ctrlWrapper(signout),
  current: ctrlWrapper(current),
};
