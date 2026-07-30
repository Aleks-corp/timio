export {};

declare global {
  namespace Express {
    interface Request {
      // Set by the `authenticate` middleware after verifying the auth cookie.
      userId?: string;
      // Set by the `validateQuery` decorator. req.query is a getter-only
      // accessor in Express 5 that re-parses on every access, so the
      // Joi-validated/coerced query value is stashed here instead.
      validatedQuery?: Record<string, unknown>;
    }
  }
}
