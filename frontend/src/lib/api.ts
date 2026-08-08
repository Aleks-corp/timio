export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method: "GET" | "POST";
  body?: unknown;
}

export async function request<T>(path: string, { method, body }: RequestOptions): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Couldn't connect to the server. Check your connection and try again.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}) as { message?: string });

  if (!response.ok) {
    throw new ApiError(response.status, data.message ?? "Something went wrong. Please try again.");
  }

  return data as T;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export async function signup(input: SignupInput): Promise<{ user: PublicUser }> {
  return request<{ user: PublicUser }>("/auth/signup", { method: "POST", body: input });
}

export interface SigninInput {
  email: string;
  password: string;
}

export async function signin(input: SigninInput): Promise<{ user: PublicUser }> {
  return request<{ user: PublicUser }>("/auth/signin", { method: "POST", body: input });
}

export async function getCurrentUser(): Promise<{ user: PublicUser }> {
  return request<{ user: PublicUser }>("/auth/current", { method: "GET" });
}

export async function logout(): Promise<void> {
  await request<void>("/auth/signout", { method: "POST" });
}
