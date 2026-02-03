"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { PremiumToggle } from "./ui/bouncy-toggle";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <PremiumToggle
      checked={isDark}
      onChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  );
}
