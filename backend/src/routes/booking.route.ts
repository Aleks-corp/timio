import { Router } from "express";
import { bookingController } from "../controllers/index.js";
import { validateBody, validateQuery } from "../decorators/index.js";
import { authenticate } from "../middlewares/index.js";
import { createBookingSchema, bookingsMeQuerySchema } from "../schemas/index.js";

const { create, cancel, me } = bookingController;

const bookingsRouter = Router();

bookingsRouter.get("/me", authenticate, validateQuery(bookingsMeQuerySchema), me);
bookingsRouter.post("/", authenticate, validateBody(createBookingSchema), create);
bookingsRouter.delete("/:id", authenticate, cancel);

export default bookingsRouter;
