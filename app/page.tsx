"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import DotGrid from "./components/DotGrid";
import { ParticleCard, MagicBentoStyles } from "./components/MagicBentoEffects";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.03,
      ease: "easeOut" as const,
    },
  }),
};

// Animated text component
const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

// Bento items data
const bentoItems = [
  {
    title: "Engineering",
    description: "Medical devices, robotics, and mechatronic systems",
    href: "/projects",
    icon: "⚙️",
    className: "md:col-span-2 md:row-span-2",
    gradient: "from-primary/20 to-primary/5 dark:from-darkaccent/30 dark:to-darkaccent/10",
  },
  {
    title: "Design",
    description: "Human-centered product design",
    href: "/projects",
    icon: "✏️",
    className: "md:col-span-1",
    gradient: "from-accent/20 to-accent/5 dark:from-accent/30 dark:to-accent/10",
  },
  {
    title: "Photography",
    description: "Visual storytelling",
    href: "/photography",
    icon: "📷",
    className: "md:col-span-1",
    gradient: "from-sage/30 to-sage/10 dark:from-sage/30 dark:to-sage/10",
  },
  {
    title: "About Me",
    description: "Background, experience, and interests",
    href: "/about",
    icon: "👋",
    className: "md:col-span-2",
    gradient: "from-primary/20 to-primary/5 dark:from-darkaccent/30 dark:to-darkaccent/10",
  },
];

export default function HomePage() {
  const gridRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const glowColor = isDark ? "245, 199, 106" : "29, 71, 50"; // Gold for dark, green for light

  return (
    <>
      <MagicBentoStyles glowColor={glowColor} />
      
      {/* Background DotGrid - starts below header */}
      <div className="fixed top-[28px] left-0 right-0 bottom-0 -z-10 opacity-30 dark:opacity-20">
        {mounted && (
          <DotGrid
            dotSize={3}
            gap={40}
            baseColor={isDark ? "#ffffff" : "#1d4732"}
            activeColor={isDark ? "#f5c76a" : "#f5c76a"}
            proximity={120}
            speedTrigger={80}
            shockRadius={200}
            shockStrength={3}
          />
        )}
      </div>

      <motion.section
        className="min-h-[calc(100vh-120px)] flex flex-col justify-center space-y-16 pt-8 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <div className="space-y-6">
          {/* Animated Name */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary dark:text-darkaccent leading-tight tracking-tight">
              <AnimatedText text="Alessandro Tasso" />
            </h1>
          </motion.div>

          {/* Tagline with gradient */}
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-4xl font-bold bg-linear-to-r from-charcoal via-primary to-accent dark:from-white dark:via-darkaccent dark:to-accent bg-clip-text text-transparent"
          >
            Engineering meets design.
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl max-w-2xl leading-relaxed"
            style={{ color: mounted ? (isDark ? "rgba(255,255,255,0.8)" : "#1d4732") : "#1d4732" }}
          >
            Biomedical and Mechanical Engineer exploring the intersections of
            robotics, human-centered design, and medical device innovation.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <Link
              href="/projects"
              className="cta-button group inline-flex items-center gap-2 px-8 py-4 bg-transparent dark:bg-darkaccent font-semibold rounded-xl border-2 border-primary dark:border-darkaccent hover:scale-105 hover:shadow-lg hover:shadow-primary/25 dark:hover:shadow-darkaccent/40 transition-all duration-300"
              style={{ 
                color: mounted ? (isDark ? "#ffffff" : "#1d4732") : "#1d4732",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#f5c76a"}
              onMouseLeave={(e) => e.currentTarget.style.color = mounted ? (isDark ? "#ffffff" : "#1d4732") : "#1d4732"}
            >
              Explore My Work
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <motion.div variants={itemVariants}>
          <section ref={gridRef} className="home-bento relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {bentoItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className={item.className}
                >
                  <Link href={item.href} className="block h-full">
                    <ParticleCard
                      className={`magic-card h-full p-6 md:p-8 rounded-2xl bg-linear-to-br ${item.gradient} border border-solid backdrop-blur-sm cursor-pointer transition-all duration-300`}
                      style={{
                        ['--border-base-color' as string]: isDark ? '255, 255, 255' : '29, 71, 50',
                      }}
                      glowColor={glowColor}
                      enableTilt={true}
                      particleCount={6}
                      enableBorderGlow={true}
                    >
                      <div className="flex flex-col h-full justify-between relative z-10">
                        <span className="text-3xl md:text-4xl mb-4">{item.icon}</span>
                        <div>
                          <h3 
                            className="text-lg md:text-xl font-bold mb-1"
                            style={{ color: mounted ? (isDark ? "#ffffff" : "#1d4732") : "#1d4732" }}
                          >
                            {item.title}
                          </h3>
                          <p 
                            className="text-sm"
                            style={{ color: mounted ? (isDark ? "rgba(255,255,255,0.7)" : "rgba(29,71,50,0.8)") : "rgba(29,71,50,0.8)" }}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </ParticleCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: mounted ? (isDark ? "rgba(255,255,255,0.4)" : "rgba(29,71,50,0.4)") : "rgba(29,71,50,0.4)" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
}
