const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export async function signup(input: SignupInput): Promise<{ user: PublicUser }> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    });
  } catch {
    throw new ApiError(0, "Не вдалося звʼязатися з сервером. Перевірте зʼєднання і спробуйте ще раз.");
  }

  const data = await response.json().catch(() => ({}) as { message?: string });

  if (!response.ok) {
    throw new ApiError(response.status, data.message ?? "Щось пішло не так. Спробуйте ще раз.");
  }

  return data as { user: PublicUser };
}
