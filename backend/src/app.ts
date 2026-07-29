import fs from "fs";
import path from "path";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./env.js";

import type { Err } from "./types/error.type.js";

import usersRouter from "./routes/user.route.js";

const logPath = path.resolve("logs");

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

const app = express();

app.use(
  cors({
    origin: env.FRONT_SERVER ? [env.FRONT_SERVER] : true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req: Request, res: Response, next: NextFunction) => {
  const ip =
    typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"].split(",")[0].trim()
      : req.socket.remoteAddress || "";

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.info(
      `📩 New Request: ${ip} ${req.method} ${req.originalUrl} -> ${res.statusCode} ${res.statusMessage} (${duration}ms)`,
    );
  });

  next();
});

app.use("/auth", usersRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error: Err, _req: Request, res: Response, _next: NextFunction) => {
  const status = error.status ?? 500;
  const message = error.message || "Internal server error";

  res.status(status).json({ message });

  console.error("📩 Error Response:", status, message);
});

export default app;
