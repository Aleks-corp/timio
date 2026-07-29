import { Router } from "express";
import { userController } from "../controllers/index.js";
import validateBody from "../decorators/validateBody.js";
import { usersRegSchema, usersLoginSchema } from "../schemas/user.schema.js";

const { signup, signin, signout, current, oauthUpsert } = userController;

const usersRouter = Router();

usersRouter.post("/signup", validateBody(usersRegSchema), signup);
usersRouter.post("/signin", validateBody(usersLoginSchema), signin);
usersRouter.post("/oauth-upsert", oauthUpsert);
usersRouter.post("/signout", signout);
usersRouter.get("/current", current);

export default usersRouter;
