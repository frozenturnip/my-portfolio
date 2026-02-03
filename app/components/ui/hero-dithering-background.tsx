"use client";

import { useState, Suspense, lazy } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

interface DitheringBackgroundProps {
  className?: string;
  color?: string;
  speed?: number;
  hoverSpeed?: number;
  opacity?: number;
  darkOpacity?: number;
}

export function DitheringBackground({
  className = "",
  color = "#EC4E02", // Orange by default (matching 21st.dev)
  speed = 0.2,
  hoverSpeed = 0.6,
  opacity = 40,
  darkOpacity = 30,
}: DitheringBackgroundProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`absolute inset-0 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Suspense fallback={<div className="absolute inset-0 bg-neutral-900/20" />}>
        <div 
          className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply dark:mix-blend-screen"
          style={{ opacity: `${darkOpacity}%` }}
        >
          <Dithering
            colorBack="#00000000"
            colorFront={color}
            shape="warp"
            type="4x4"
            speed={isHovered ? hoverSpeed : speed}
            className="size-full"
            minPixelRatio={1}
          />
        </div>
      </Suspense>
    </div>
  );
}

export default DitheringBackground;
