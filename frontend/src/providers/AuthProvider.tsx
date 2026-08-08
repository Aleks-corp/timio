"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  signin as apiSignin,
  logout as apiLogout,
  type PublicUser,
  type SigninInput,
} from "@/lib/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: PublicUser | null;
  status: AuthStatus;
  login: (input: SigninInput) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async () => {
    try {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    getCurrentUser()
      .then(({ user: currentUser }) => {
        if (!ignore) {
          setUser(currentUser);
          setStatus("authenticated");
        }
      })
      .catch(() => {
        if (!ignore) {
          setUser(null);
          setStatus("unauthenticated");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(
    async (input: SigninInput) => {
      await apiSignin(input);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    // If this throws, state is intentionally left untouched — the caller
    // decides how to surface the error, and we don't pretend to be signed out.
    await apiLogout();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
