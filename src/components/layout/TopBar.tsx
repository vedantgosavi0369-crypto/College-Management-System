"use client";
import React, { useSyncExternalStore } from "react";
import { useSession } from "@/lib/session-context";
import { ROLE_LABELS } from "@/lib/utils";
import { Menu, Bell, Sun, Moon } from "lucide-react";

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

const themeListeners = new Set<() => void>();
function notifyThemeListeners() {
  for (const listener of themeListeners) {
    listener();
  }
}

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);
  return () => {
    themeListeners.delete(callback);
  };
}

function getThemeSnapshot(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot(): boolean {
  return false;
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const { user } = useSession();
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  const toggleTheme = () => {
    const nextDark = !isDark;
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("cms_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("cms_theme", "light");
    }
    notifyThemeListeners();
  };

  return (
    <header className="h-16 bg-white dark:bg-[#0f0f0f] border-b border-slate-200 dark:border-[#272727] flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10 transition-colors duration-150">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-[#f2f2f2] dark:text-[#aaaaaa] dark:hover:bg-[#272727] transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-[#f1f1f1] truncate">{title}</h1>
        {user && (
          <p className="text-xs text-slate-500 dark:text-[#aaaaaa] truncate hidden sm:block">
            {ROLE_LABELS[user.role]}
          </p>
        )}
      </div>

      {/* Tools */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Current date/time */}
        <div className="hidden md:block text-right">
          <p className="text-xs font-semibold text-slate-700 dark:text-[#cccccc]">
            {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-[#aaaaaa]">
            {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        {/* Theme switcher toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 hover:bg-[#f2f2f2] hover:text-slate-900 dark:text-[#aaaaaa] dark:hover:bg-[#272727] dark:hover:text-[#f1f1f1] transition-colors cursor-pointer"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg text-slate-600 hover:bg-[#f2f2f2] hover:text-slate-900 dark:text-[#aaaaaa] dark:hover:bg-[#272727] dark:hover:text-[#f1f1f1] transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff0000] rounded-full border-2 border-white dark:border-[#0f0f0f]"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}
