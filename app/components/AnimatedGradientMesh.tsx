"use client";

import { motion, type MotionProps } from "framer-motion";

interface AnimatedGradientMeshProps {
  className?: string;
}

// Glossy lava blob component
const LavaBlob = ({
  baseColor,
  highlightColor,
  glowColor,
  width,
  height,
  style,
  animate,
  transition,
}: {
  baseColor: string;
  highlightColor: string;
  glowColor: string;
  width: string;
  height: string;
  style: React.CSSProperties;
  animate: MotionProps["animate"];
  transition: MotionProps["transition"];
}) => (
  <motion.div
    className="absolute"
    style={{
      width,
      height,
      ...style,
    }}
    animate={animate}
    transition={transition}
  >
    {/* Main blob body with glossy gradient */}
    <div
      className="absolute inset-0 rounded-[inherit]"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 50% 100%, ${baseColor} 0%, transparent 70%),
          radial-gradient(ellipse 100% 100% at 50% 50%, ${baseColor} 0%, ${baseColor}88 100%)
        `,
        boxShadow: `
          inset 0 -20px 40px -10px rgba(0,0,0,0.4),
          inset 0 20px 40px -10px ${highlightColor},
          0 0 60px 20px ${glowColor}
        `,
      }}
    />
    {/* Top highlight / specular */}
    <div
      className="absolute rounded-[inherit]"
      style={{
        top: "8%",
        left: "20%",
        right: "20%",
        height: "35%",
        background: `radial-gradient(ellipse 100% 100% at 50% 0%, ${highlightColor} 0%, transparent 70%)`,
        opacity: 0.9,
      }}
    />
    {/* Secondary highlight for extra glossiness */}
    <div
      className="absolute rounded-full"
      style={{
        top: "12%",
        left: "25%",
        width: "30%",
        height: "20%",
        background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 70%)`,
        filter: "blur(2px)",
      }}
    />
  </motion.div>
);

export default function AnimatedGradientMesh({
  className = "",
}: AnimatedGradientMeshProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient - dark background */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0f1a 0%, #050810 100%)",
        }}
      />

      {/* Lava blob 1 - Large green blob */}
      <LavaBlob
        baseColor="rgb(29, 71, 50)"
        highlightColor="rgba(120, 200, 150, 0.6)"
        glowColor="rgba(29, 71, 50, 0.5)"
        width="280px"
        height="380px"
        style={{ left: "20%", bottom: "-15%" }}
        animate={{
          y: [0, -550, -350, -150, 0],
          x: [0, 30, -20, 40, 0],
          scaleX: [1, 0.85, 1.15, 0.9, 1],
          scaleY: [1, 1.3, 0.85, 1.15, 1],
          borderRadius: ["50%", "45% 55% 50% 50%", "55% 45% 48% 52%", "48% 52% 55% 45%", "50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Lava blob 2 - Gold blob */}
      <LavaBlob
        baseColor="rgb(245, 180, 80)"
        highlightColor="rgba(255, 240, 180, 0.7)"
        glowColor="rgba(245, 199, 106, 0.4)"
        width="240px"
        height="320px"
        style={{ right: "22%", bottom: "-12%" }}
        animate={{
          y: [0, -480, -280, -80, 0],
          x: [0, -35, 25, -25, 0],
          scaleX: [1, 1.2, 0.75, 1.1, 1],
          scaleY: [1, 0.75, 1.25, 0.85, 1],
          borderRadius: ["50%", "52% 48% 45% 55%", "45% 55% 52% 48%", "50% 50% 48% 52%", "50%"],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Lava blob 3 - Smaller green */}
      <LavaBlob
        baseColor="rgb(35, 85, 60)"
        highlightColor="rgba(100, 180, 130, 0.6)"
        glowColor="rgba(29, 71, 50, 0.4)"
        width="160px"
        height="220px"
        style={{ left: "58%", bottom: "-8%" }}
        animate={{
          y: [0, -420, -520, -280, 0],
          x: [0, 45, -25, 20, 0],
          scaleX: [1, 0.75, 1.2, 0.85, 1],
          scaleY: [1, 1.4, 0.7, 1.25, 1],
          borderRadius: ["50%", "48% 52% 55% 45%", "55% 45% 48% 52%", "45% 55% 52% 48%", "50%"],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8,
        }}
      />

      {/* Lava blob 4 - Gold accent */}
      <LavaBlob
        baseColor="rgb(235, 170, 70)"
        highlightColor="rgba(255, 235, 170, 0.7)"
        glowColor="rgba(245, 199, 106, 0.35)"
        width="180px"
        height="250px"
        style={{ left: "8%", bottom: "-8%" }}
        animate={{
          y: [0, -380, -220, -460, 0],
          x: [0, 25, -35, 30, 0],
          scaleX: [1, 1.15, 0.8, 1.1, 1],
          scaleY: [1, 0.8, 1.35, 0.75, 1],
          borderRadius: ["50%", "45% 55% 50% 50%", "52% 48% 45% 55%", "48% 52% 52% 48%", "50%"],
        }}
        transition={{
          duration: 21,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 11,
        }}
      />

      {/* Lava blob 5 - Top blob sinking (indigo/purple) */}
      <LavaBlob
        baseColor="rgb(60, 70, 120)"
        highlightColor="rgba(140, 150, 200, 0.6)"
        glowColor="rgba(60, 70, 120, 0.4)"
        width="200px"
        height="270px"
        style={{ right: "12%", top: "8%" }}
        animate={{
          y: [0, 120, 320, 520, 720],
          x: [0, -25, 20, -15, 0],
          scaleX: [1, 0.9, 1.1, 0.85, 1],
          scaleY: [1, 1.15, 0.8, 1.2, 1],
          opacity: [0.9, 0.7, 0.5, 0.25, 0],
          borderRadius: ["50%", "52% 48% 50% 50%", "48% 52% 48% 52%", "50% 50% 52% 48%", "50%"],
        }}
        transition={{
          duration: 23,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
      />

      {/* Lava blob 6 - Another sinking blob */}
      <LavaBlob
        baseColor="rgb(40, 90, 65)"
        highlightColor="rgba(110, 190, 140, 0.6)"
        glowColor="rgba(29, 71, 50, 0.35)"
        width="150px"
        height="200px"
        style={{ left: "32%", top: "3%" }}
        animate={{
          y: [0, 140, 380, 580, 780],
          x: [0, 35, -20, 25, 0],
          scaleX: [1, 1.1, 0.8, 1.15, 1],
          scaleY: [1, 0.75, 1.3, 0.7, 1],
          opacity: [0.85, 0.6, 0.35, 0.15, 0],
          borderRadius: ["50%", "45% 55% 52% 48%", "55% 45% 48% 52%", "50% 50% 50% 50%", "50%"],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 13,
        }}
      />

      {/* Subtle vignette overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}
