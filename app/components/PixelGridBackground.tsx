"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { PixelGrid } from "@/components/ui/pixel-grid";

export default function PixelGridBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const pixelColor = useMemo(() => (isDark ? "#f5c76a" : "#1d4732"), [isDark]);

  return (
    <PixelGrid
      className="pointer-events-none -z-10 opacity-25"
      pixelColor={pixelColor}
      bgColor="transparent"
      pixelSize={3}
      pixelSpacing={24}
      glow={!isDark}
    />
  );
}
