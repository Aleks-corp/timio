import { Router } from "express";
import { roomController } from "../controllers/index.js";
import { validateQuery } from "../decorators/index.js";
import { roomsQuerySchema, roomBookingsQuerySchema, availabilityQuerySchema } from "../schemas/index.js";

const { list, weekBookings, availability } = roomController;

const roomsRouter = Router();

roomsRouter.get("/availability", validateQuery(availabilityQuerySchema), availability);
roomsRouter.get("/:id/bookings", validateQuery(roomBookingsQuerySchema), weekBookings);
roomsRouter.get("/", validateQuery(roomsQuerySchema), list);

export default roomsRouter;
