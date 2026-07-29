import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "../env.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Pin the Postgres session to UTC: the pg driver sends DateTime params as
// tz-less strings, so a non-UTC session timezone silently shifts them.
const adapter = new PrismaPg({ connectionString, options: "-c TimeZone=UTC" });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
