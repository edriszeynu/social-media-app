// components/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode = stored === "dark" || (!stored && prefersDark);
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-muted/50 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-yellow-400 hover:rotate-12 transition-transform" />
      ) : (
        <Sun className="h-5 w-5 text-amber-500 hover:rotate-12 transition-transform" />
      )}
    </Button>
  );
}