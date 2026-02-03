"use client";

import { ReactNode, useEffect, useRef, CSSProperties, useMemo } from "react";
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
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "top" | "bottom" | "left" | "right" | "center";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  columnWidth = 350,
  gap = 20,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  return (
    <div
      ref={containerRef}
      className="masonry-container"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${columnWidth}px, 1fr))`,
        gap: `${gap}px`,
        width: "100%",
      }}
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
