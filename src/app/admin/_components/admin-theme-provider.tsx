"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type AdminTheme = "light" | "dark";

interface AdminThemeContextValue {
  theme: AdminTheme;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);
const storageKey = "admin-theme";
const themeChangeEvent = "admin-theme-change";

function getStoredTheme(): AdminTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(storageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(themeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(themeChangeEvent, onStoreChange);
  };
}

function getServerTheme(): AdminTheme {
  return "light";
}

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getStoredTheme,
    getServerTheme
  );
  const value = useMemo<AdminThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => {
        const nextTheme = getStoredTheme() === "dark" ? "light" : "dark";

        window.localStorage.setItem(storageKey, nextTheme);
        window.dispatchEvent(new Event(themeChangeEvent));
      },
    }),
    [theme]
  );

  return (
    <AdminThemeContext.Provider value={value}>
      <div suppressHydrationWarning className={cn(theme === "dark" && "dark")}>
        <div
          data-testid="admin-theme-root"
          className="min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-gray-50"
        >
          {children}
        </div>
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);

  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider.");
  }

  return context;
}
