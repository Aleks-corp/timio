import type { CookieOptions } from "express";
import { env } from "../env.js";

export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    domain: env.COOKIE_DOMAIN || undefined,
    path: "/",
  };
}
