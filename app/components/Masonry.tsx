"use client";

import { ReactNode, useEffect, useRef, CSSProperties, useMemo } from "react";
import { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MasonryItem {
  id: string | number;
  content: ReactNode;
}

interface MasonryProps {
  items: MasonryItem[];
  columnWidth?: number;
  gap?: number;
  columns?: number;
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "top" | "bottom" | "left" | "right" | "center";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  breakpoints?: Record<number, { columnWidth?: number; gap?: number; columns?: number }>;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  columnWidth = 350,
  gap = 20,
  columns,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  breakpoints,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [gridStyle, setGridStyle] = useState<CSSProperties>(() => ({
    display: "grid",
    gridTemplateColumns: columns
      ? `repeat(${columns}, minmax(0, 1fr))`
      : `repeat(auto-fill, minmax(${columnWidth}px, 1fr))`,
    gap: `${gap}px`,
    width: "100%",
  }));

  // Compute directional starting offsets
  const getInitialTransform = useMemo(() => {
    switch (animateFrom) {
      case "top":
        return { y: -50, x: 0, scale: 0.95 };
      case "bottom":
        return { y: 50, x: 0, scale: 0.95 };
      case "left":
        return { x: -50, y: 0, scale: 0.95 };
      case "right":
        return { x: 50, y: 0, scale: 0.95 };
      case "center":
        return { y: 0, x: 0, scale: 0.8 };
      default:
        return { y: 50, x: 0, scale: 0.95 };
    }
  }, [animateFrom]);

  useEffect(() => {
    // Animate items in from off-screen with a stagger
    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      gsap.fromTo(
        item,
        {
          opacity: 0,
          ...getInitialTransform,
          filter: blurToFocus ? "blur(8px)" : "blur(0px)",
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          duration,
          ease,
          delay: stagger * index,
          scrollTrigger: {
            trigger: item,
            start: "top 95%",
          },
        }
      );
    });

    // Cleanup function to kill all triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [items, ease, duration, stagger, blurToFocus, getInitialTransform]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sortedBreakpoints = breakpoints
      ? Object.entries(breakpoints)
          .map(([width, values]) => ({ width: Number(width), values }))
          .sort((a, b) => a.width - b.width)
      : [];

    const computeGridStyle = (width: number): CSSProperties => {
      let config = { columnWidth, gap, columns };
      for (const bp of sortedBreakpoints) {
        if (width >= bp.width) {
          config = {
            columnWidth: bp.values.columnWidth ?? config.columnWidth,
            gap: bp.values.gap ?? config.gap,
            columns: bp.values.columns ?? config.columns,
          };
        }
      }

      return {
        display: "grid",
        gridTemplateColumns: config.columns
          ? `repeat(${config.columns}, minmax(0, 1fr))`
          : `repeat(auto-fill, minmax(${config.columnWidth}px, 1fr))`,
        gap: `${config.gap}px`,
        width: "100%",
      };
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setGridStyle(computeGridStyle(width));
      }
    });

    resizeObserver.observe(container);
    setGridStyle(computeGridStyle(container.getBoundingClientRect().width));

    return () => resizeObserver.disconnect();
  }, [columnWidth, gap, columns, breakpoints]);

  const hoverStyle: CSSProperties = scaleOnHover
    ? {
        transition: "transform 0.3s ease, filter 0.3s ease",
      }
    : {};

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (scaleOnHover) {
      e.currentTarget.style.transform = `scale(${hoverScale})`;
    }
    if (colorShiftOnHover) {
      e.currentTarget.style.filter = "hue-rotate(15deg)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (scaleOnHover) {
      e.currentTarget.style.transform = "scale(1)";
    }
    if (colorShiftOnHover) {
      e.currentTarget.style.filter = "hue-rotate(0deg)";
    }
  };

  const computedStyles = useMemo(() => {
    if (!breakpoints) {
      return {
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${columnWidth}px, 1fr))`,
        gap: `${gap}px`,
        width: "100%",
      } satisfies CSSProperties;
    }

    const sortedBreakpoints = Object.entries(breakpoints)
      .map(([width, values]) => ({ width: Number(width), values }))
      .sort((a, b) => a.width - b.width);

    return sortedBreakpoints.reduce((acc, { width, values }) => {
      const minWidth = `${width}px`;
      const colWidth = values.columnWidth ?? columnWidth;
      const bpGap = values.gap ?? gap;
      acc[`@media (min-width: ${minWidth})`] = {
        gridTemplateColumns: `repeat(auto-fill, minmax(${colWidth}px, 1fr))`,
        gap: `${bpGap}px`,
      } as CSSProperties;
      return acc;
    }, {
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(${columnWidth}px, 1fr))`,
      gap: `${gap}px`,
      width: "100%",
    } as CSSProperties);
  }, [breakpoints, columnWidth, gap]);

  return (
    <div
      ref={containerRef}
      className="masonry-container"
      style={gridStyle}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className="masonry-item"
          style={{
            ...hoverStyle,
            opacity: 0, // Start invisible for GSAP animation
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
