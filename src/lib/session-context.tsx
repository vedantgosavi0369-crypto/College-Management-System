"use client";
import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";
import { User } from "@/lib/types";
import { MOCK_USERS, DEMO_CREDENTIALS } from "@/lib/mock-data";

interface SessionContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

let cachedUser: User | null = null;
let isInitialized = false;

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("cms_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();
function notifySessionListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeSession(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === "cms_user" || !e.key) {
      cachedUser = getStoredUser();
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSessionSnapshot(): User | null {
  if (!isInitialized && typeof window !== "undefined") {
    cachedUser = getStoredUser();
    isInitialized = true;
  }
  return cachedUser;
}

function getServerSessionSnapshot(): User | null {
  return null;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribeSession, getSessionSnapshot, getServerSessionSnapshot);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const creds = DEMO_CREDENTIALS[email];
    if (!creds || creds.password !== password) return false;
    const foundUser = MOCK_USERS.find((u) => u.id === creds.userId) || null;
    if (foundUser) {
      cachedUser = foundUser;
      if (typeof window !== "undefined") {
        localStorage.setItem("cms_user", JSON.stringify(foundUser));
      }
      notifySessionListeners();
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    cachedUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("cms_user");
    }
    notifySessionListeners();
  }, []);

  return (
    <SessionContext.Provider value={{ user, login, logout, isLoading: false }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
