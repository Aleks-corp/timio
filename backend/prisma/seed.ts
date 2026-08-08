import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { OFFICE_TIMEZONE } from "../src/constants/index.js";
import { getWeekStartUtc, addDaysUtc, officeWallTimeToUtc, getOfficeDateParts } from "../src/utils/index.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  options: "-c TimeZone=UTC",
});
const prisma = new PrismaClient({ adapter });

function officeTimeOnDay(date: Date, hours: number, minutes: number): Date {
  const { year, month, day } = getOfficeDateParts(date);
  return officeWallTimeToUtc(year, month, day, hours, minutes);
}

function mondayOfWeek(offsetWeeks: number): Date {
  const thisWeek = getWeekStartUtc();
  return offsetWeeks === 0 ? thisWeek : addDaysUtc(thisWeek, offsetWeeks * 7);
}

function addDays(date: Date, days: number): Date {
  return addDaysUtc(date, days);
}

async function main() {
  console.log(`Seeding against ${OFFICE_TIMEZONE} office hours...`);

  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123", 10);

  const [olena, ivan] = await Promise.all([
    prisma.user.create({
      data: { name: "Olena Koval", email: "elena@timio.dev", passwordHash },
    }),
    prisma.user.create({
      data: { name: "Ivan Petrenko", email: "ivan@timio.dev", passwordHash },
    }),
  ]);

  const [aquarium, mars, gagarin, jupiter, saturn, venus] = await Promise.all([
    prisma.room.create({
      data: { name: "Aquarium", floor: 2, capacity: 4, amenities: ["TV", "Whiteboard", "Video call", "Quiet"] },
    }),
    prisma.room.create({
      data: { name: "Mars", floor: 3, capacity: 8, amenities: ["Whiteboard", "Video call"] },
    }),
    prisma.room.create({
      data: { name: "Gagarin", floor: 3, capacity: 12, amenities: ["TV", "Screen", "Video call"] },
    }),
    prisma.room.create({
      data: { name: "Jupiter", floor: 2, capacity: 6, amenities: ["Whiteboard", "Focus"] },
    }),
    prisma.room.create({
      data: { name: "Saturn", floor: 4, capacity: 10, amenities: ["Screen", "Presentation", "Hybrid"] },
    }),
    prisma.room.create({
      data: { name: "Venus", floor: 2, capacity: 2, amenities: ["Quiet", "Focus"] },
    }),
  ]);

  const thisWeek = mondayOfWeek(0);
  const nextWeek = mondayOfWeek(1);

  await prisma.booking.createMany({
    data: [
      {
        title: "Sprint planning",
        roomId: mars.id,
        userId: olena.id,
        startAt: officeTimeOnDay(addDays(thisWeek, 1), 10, 0),
        endAt: officeTimeOnDay(addDays(thisWeek, 1), 11, 0),
      },
      {
        title: "Client call",
        roomId: gagarin.id,
        userId: ivan.id,
        startAt: officeTimeOnDay(addDays(thisWeek, 3), 14, 0),
        endAt: officeTimeOnDay(addDays(thisWeek, 3), 15, 30),
      },
      {
        title: "1:1 with manager",
        roomId: aquarium.id,
        userId: olena.id,
        startAt: officeTimeOnDay(addDays(nextWeek, 0), 9, 30),
        endAt: officeTimeOnDay(addDays(nextWeek, 0), 10, 0),
      },
      {
        title: "Team demo",
        roomId: jupiter.id,
        userId: ivan.id,
        startAt: officeTimeOnDay(addDays(nextWeek, 2), 16, 0),
        endAt: officeTimeOnDay(addDays(nextWeek, 2), 17, 0),
      },
    ],
  });

  console.log("Seed complete:");
  console.log(`  users: ${olena.email}, ${ivan.email}`);
  console.log(
    `  rooms: ${[aquarium, mars, gagarin, jupiter, saturn, venus].map((r) => r.name).join(", ")}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
