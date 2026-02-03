"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { GlowMenu } from "@/app/components/ui/glow-menu";

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
      scale: { duration: 0.5, type: "spring" as const, stiffness: 300, damping: 25 },
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

export default function Header() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : undefined;
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) return null;

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 transition-all duration-500 ease-in-out
      ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      bg-transparent backdrop-blur-none`}
    >
      {/* ===== LOGO ===== */}
      <motion.div
        className="block rounded-xl overflow-hidden group relative"
        style={{ perspective: "600px" }}
        whileHover="hover"
        initial="initial"
      >
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          variants={glowVariants}
          style={{
            background:
              "radial-gradient(circle, rgba(245,199,106,0.2) 0%, rgba(245,199,106,0.08) 50%, rgba(245,199,106,0) 100%)",
            opacity: 0,
            borderRadius: "16px",
          }}
        />
        <motion.a
          href="/"
          className="flex items-center px-4 py-2 relative z-10 bg-transparent text-primary/70 dark:text-sage/70 group-hover:text-primary dark:group-hover:text-white transition-colors rounded-xl text-lg font-semibold"
          variants={itemVariants}
          transition={sharedTransition}
          style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
        >
          A. TASSO
        </motion.a>
        <motion.a
          href="/"
          className="flex items-center px-4 py-2 absolute inset-0 z-10 bg-transparent text-primary/70 dark:text-sage/70 group-hover:text-primary dark:group-hover:text-white transition-colors rounded-xl text-lg font-semibold"
          variants={backVariants}
          transition={sharedTransition}
          style={{ transformStyle: "preserve-3d", transformOrigin: "center top", rotateX: 90 }}
        >
          A. TASSO
        </motion.a>
      </motion.div>

      {/* ===== NAVIGATION + THEME TOGGLE ===== */}
      <div className="flex items-center gap-4">
        <GlowMenu />
        {pathname !== "/secret" && <ThemeToggle />}
      </div>
    </header>
  );
}
