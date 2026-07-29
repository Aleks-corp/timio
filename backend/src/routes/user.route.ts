import { Router } from "express";
import { userController } from "../controllers/index.js";
import { validateBody } from "../decorators/index.js";
import { authenticate } from "../middlewares/index.js";
import {
  usersRegSchema,
  usersLoginSchema,
  oauthUpsertSchema,
} from "../schemas/index.js";

const { signup, signin, oauthUpsert, signout, current } = userController;

const usersRouter = Router();

usersRouter.post("/signup", validateBody(usersRegSchema), signup);
usersRouter.post("/signin", validateBody(usersLoginSchema), signin);
usersRouter.post("/oauth-upsert", validateBody(oauthUpsertSchema), oauthUpsert);
usersRouter.post("/signout", signout);
usersRouter.get("/current", authenticate, current);

export default usersRouter;
