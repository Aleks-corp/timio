export const EMAIL_REGEXP = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
export const AUTH_COOKIE_NAME = "token";
export const AUTH_TOKEN_TTL = "7d";
export const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export default {
  EMAIL_REGEXP,
  AUTH_COOKIE_NAME,
  AUTH_TOKEN_TTL,
  AUTH_COOKIE_MAX_AGE_MS,
};
