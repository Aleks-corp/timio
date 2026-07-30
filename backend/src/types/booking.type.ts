export interface PublicBooking {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  roomId: string;
  userId: string;
}

export interface RoomWeekBooking {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  userId: string;
  user: { name: string };
}

export interface MyBooking {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  room: { id: string; name: string };
}
