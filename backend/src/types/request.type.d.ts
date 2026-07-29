export {};

declare global {
  namespace Express {
    interface Request {
      // Set by the `authenticate` middleware after verifying the auth cookie.
      userId?: string;
    }
  }
}
