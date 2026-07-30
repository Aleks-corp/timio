import type { Request, Response } from "express";
import { ctrlWrapper } from "../decorators/index.js";
import { createBooking, cancelBooking, listMyBookings } from "../services/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
  const { roomId, title, startAt, endAt } = req.body as {
    roomId: string;
    title: string;
    startAt: Date;
    endAt: Date;
  };

  const booking = await createBooking({
    userId: req.userId as string,
    roomId,
    title,
    startAt,
    endAt,
  });
  res.status(201).json({ booking });
};

const cancel = async (req: Request, res: Response): Promise<void> => {
  await cancelBooking(req.params.id as string, req.userId as string);
  res.status(204).end();
};

const me = async (req: Request, res: Response): Promise<void> => {
  const { section, limit, offset } = req.validatedQuery as unknown as {
    section: "upcoming" | "past";
    limit: number;
    offset: number;
  };

  const bookings = await listMyBookings(req.userId as string, section, limit, offset);
  res.json({ bookings });
};

export default {
  create: ctrlWrapper(create),
  cancel: ctrlWrapper(cancel),
  me: ctrlWrapper(me),
};
