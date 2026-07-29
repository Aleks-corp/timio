import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  options: "-c TimeZone=UTC",
});
const prisma = new PrismaClient({ adapter });

const OFFICE_TIMEZONE = "Europe/Kyiv";

const KYIV_UTC_OFFSET_HOURS = 3;

function kyivTimeToUtc(date: Date, hours: number, minutes: number): Date {
  const result = new Date(date);
  result.setUTCHours(hours - KYIV_UTC_OFFSET_HOURS, minutes, 0, 0);
  return result;
}

function mondayOfWeek(offsetWeeks: number): Date {
  const now = new Date();
  const day = now.getUTCDay() || 7;
  const monday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  monday.setUTCDate(monday.getUTCDate() - day + 1 + offsetWeeks * 7);
  return monday;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

async function main() {
  console.log(`Seeding against ${OFFICE_TIMEZONE} office hours...`);

  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123", 10);

  const [olena, ivan] = await Promise.all([
    prisma.user.create({
      data: { name: "Олена Коваль", email: "elena@timio.dev", passwordHash },
    }),
    prisma.user.create({
      data: { name: "Ivan Petrenko", email: "ivan@timio.dev", passwordHash },
    }),
  ]);

  const [aquarium, mars, gagarin, jupiter, saturn, venus] = await Promise.all([
    prisma.room.create({ data: { name: "Акваріум", floor: 2, capacity: 4 } }),
    prisma.room.create({ data: { name: "Марс", floor: 3, capacity: 8 } }),
    prisma.room.create({ data: { name: "Гагарін", floor: 3, capacity: 12 } }),
    prisma.room.create({ data: { name: "Юпітер", floor: 2, capacity: 6 } }),
    prisma.room.create({ data: { name: "Сатурн", floor: 4, capacity: 10 } }),
    prisma.room.create({ data: { name: "Венера", floor: 2, capacity: 2 } }),
  ]);

  const thisWeek = mondayOfWeek(0);
  const nextWeek = mondayOfWeek(1);

  await prisma.booking.createMany({
    data: [
      {
        title: "Спринт-планування",
        roomId: mars.id,
        userId: olena.id,
        startAt: kyivTimeToUtc(addDays(thisWeek, 1), 10, 0),
        endAt: kyivTimeToUtc(addDays(thisWeek, 1), 11, 0),
      },
      {
        title: "Дзвінок з клієнтом",
        roomId: gagarin.id,
        userId: ivan.id,
        startAt: kyivTimeToUtc(addDays(thisWeek, 3), 14, 0),
        endAt: kyivTimeToUtc(addDays(thisWeek, 3), 15, 30),
      },
      {
        title: "1:1 з менеджером",
        roomId: aquarium.id,
        userId: olena.id,
        startAt: kyivTimeToUtc(addDays(nextWeek, 0), 9, 30),
        endAt: kyivTimeToUtc(addDays(nextWeek, 0), 10, 0),
      },
      {
        title: "Демо для команди",
        roomId: jupiter.id,
        userId: ivan.id,
        startAt: kyivTimeToUtc(addDays(nextWeek, 2), 16, 0),
        endAt: kyivTimeToUtc(addDays(nextWeek, 2), 17, 0),
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
