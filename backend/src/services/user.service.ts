import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import { prisma } from "../lib/index.js";
import { Prisma } from "../generated/prisma/client.js";
import type { UserModel } from "../generated/prisma/models.js";
import { env } from "../env.js";
import { HttpError } from "../utils/index.js";
import { AUTH_TOKEN_TTL } from "../constants/index.js";
import type { PublicUser } from "../types/index.js";

const SALT_ROUNDS = 10;

export function toPublicUser(user: UserModel): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

function signToken(userId: string): string {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: AUTH_TOKEN_TTL,
  });
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ token: string; user: PublicUser }> {
  const { name, email, password } = input;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw HttpError(409, "Користувач з таким email вже зареєстрований");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  let user: UserModel;
  try {
    user = await prisma.user.create({ data: { name, email, passwordHash } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw HttpError(409, "Користувач з таким email вже зареєстрований");
    }
    throw error;
  }

  return { token: signToken(user.id), user: toPublicUser(user) };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ token: string; user: PublicUser }> {
  const { email, password } = input;

  const user = await prisma.user.findUnique({ where: { email } });
  if (
    !user ||
    !user.passwordHash ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    throw HttpError(401, "Невірний email або пароль");
  }

  return { token: signToken(user.id), user: toPublicUser(user) };
}

export async function oauthUpsertUser(input: {
  email: string;
  name: string;
  avatar?: string;
  provider: string;
  providerId: string;
}): Promise<{ token: string; user: PublicUser }> {
  const { email, name, avatar, provider, providerId } = input;

  let user = await prisma.user.findUnique({
    where: { provider_providerId: { provider, providerId } },
  });

  if (!user) {
    user = await prisma.user.findUnique({ where: { email } });
  }

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        provider,
        providerId,
        avatar: avatar ?? user.avatar,
      },
    });
  } else {
    try {
      user = await prisma.user.create({
        data: { name, email, avatar, provider, providerId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        // Lost a race with a concurrent upsert for the same identity/email.
        user = await prisma.user.findUniqueOrThrow({ where: { email } });
      } else {
        throw error;
      }
    }
  }

  return { token: signToken(user.id), user: toPublicUser(user) };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw HttpError(401, "Не авторизовано");
  }
  return toPublicUser(user);
}

export function verifyToken(token: string): string {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (typeof payload.id !== "string") {
      throw new Error("Malformed token payload");
    }
    return payload.id;
  } catch {
    throw HttpError(401, "Не авторизовано");
  }
}
