import "dotenv/config";
import type { Request, Response } from "express";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  res
    .status(201)
    .json({ ok: true, message: "Вітаємо! Ви успішно зареєструвалися!" });
};
const signin = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  res
    .status(201)
    .json({ ok: true, message: "Вітаємо! Ви успішно зареєструвалися!" });
};
const oauthUpsert = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  res.cookie("token", "token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    domain: process.env.COOKIE_DOMAIN || ".dsgn.academy",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.json({ ok: true, message: "Вітаємо! Ви успішно зареєструвалися!" });
};
const signout = async (req: Request, res: Response): Promise<void> => {
  res.json({ ok: true });
};
const current = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  res.json({ ok: true });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  oauthUpsert: ctrlWrapper(oauthUpsert),
  signout: ctrlWrapper(signout),
  current: ctrlWrapper(current),
};
