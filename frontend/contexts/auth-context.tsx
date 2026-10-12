"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, TOKEN_KEY } from "../lib/api";
export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
}
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const expire = () => {
      setUser(null);
    };
    const sync = (event: StorageEvent) => {
      if (event.key === TOKEN_KEY && !event.newValue) setUser(null);
    };
    window.addEventListener("duolcode:session-expired", expire);
    window.addEventListener("storage", sync);
    if (!localStorage.getItem(TOKEN_KEY)) setLoading(false);
    else
      void api<User>("/users/me")
        .then((value) => {
          if (active) setUser(value);
        })
        .catch(() => {
          if (active) setUser(null);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    return () => {
      active = false;
      window.removeEventListener("duolcode:session-expired", expire);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("Use AuthProvider.");
  return value;
}
