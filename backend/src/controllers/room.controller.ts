import type { Request, Response } from "express";
import { ctrlWrapper } from "../decorators/index.js";
import { listRooms, getRoomWeekBookings, checkAvailability } from "../services/index.js";

const list = async (req: Request, res: Response): Promise<void> => {
  const { minCapacity } = req.validatedQuery as unknown as { minCapacity?: number };
  const rooms = await listRooms(minCapacity);
  res.json({ rooms });
};

const weekBookings = async (req: Request, res: Response): Promise<void> => {
  const { weekStart } = req.validatedQuery as unknown as { weekStart?: string };
  // Anchor to noon UTC so the office-timezone calendar date always matches
  // the requested YYYY-MM-DD, regardless of the Kyiv UTC offset.
  const reference = weekStart ? new Date(`${weekStart}T12:00:00Z`) : undefined;

  const result = await getRoomWeekBookings(req.params.id as string, reference);
  res.json(result);
};

const availability = async (req: Request, res: Response): Promise<void> => {
  const { roomId, startAt, endAt } = req.validatedQuery as unknown as {
    roomId: string;
    startAt: Date;
    endAt: Date;
  };

  const result = await checkAvailability({ roomId, startAt, endAt });
  res.json(result);
};

export default {
  list: ctrlWrapper(list),
  weekBookings: ctrlWrapper(weekBookings),
  availability: ctrlWrapper(availability),
};
