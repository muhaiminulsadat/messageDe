import React, {useEffect, useLayoutEffect, useState} from "react";
import {DEFAULT_THEME_PRESET_ID} from "../data/herouiThemePresets";
import {
  applyThemePresetToDocument,
  isValidThemePreset,
  ThemeContext,
} from "./theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredTheme(): "light" | "dark" | null {
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") return theme;

  return null;
}

function applyDomTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
}

function readStoredThemePreset(): string {
  const themePreset = localStorage.getItem("theme-preset");
  if (themePreset && isValidThemePreset(themePreset)) return themePreset;

  return DEFAULT_THEME_PRESET_ID;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<"light" | "dark">(
    () => readStoredTheme() ?? getSystemTheme(),
  );
  const [themePreset, setThemePresetState] = useState<string>(readStoredThemePreset);

  // this applies light/dark mode
  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  // this applies the theme preset, like sky, spotify, etc.
  useLayoutEffect(() => {
    applyThemePresetToDocument(themePreset);
  }, [themePreset]);

  // this stores the theme and theme preset in local storage
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("theme-preset", themePreset);
  }, [theme, themePreset]);

  const setTheme = (next: "light" | "dark" | ((prev: "light" | "dark") => "light" | "dark")) => setThemeState(next);

  const toggleTheme = () => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  };

  const setThemePreset = (next: string | ((prev: string) => string)) => {
    setThemePresetState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      return isValidThemePreset(resolved) ? resolved : DEFAULT_THEME_PRESET_ID;
    });
  };

  const value = {theme, setTheme, toggleTheme, themePreset, setThemePreset};

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

