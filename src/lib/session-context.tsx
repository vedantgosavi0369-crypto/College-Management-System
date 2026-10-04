"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "@/lib/types";
import { MOCK_USERS, DEMO_CREDENTIALS } from "@/lib/mock-data";

interface SessionContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("cms_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("cms_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const creds = DEMO_CREDENTIALS[email];
    if (!creds || creds.password !== password) return false;
    const foundUser = MOCK_USERS.find((u) => u.id === creds.userId) || null;
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("cms_user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cms_user");
  };

  return (
    <SessionContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
