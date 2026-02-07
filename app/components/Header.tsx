"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { GlowMenu } from "@/app/components/ui/glow-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const mobileLinks = [
  { label: "Professional", href: "/professional" },
  { label: "Projects", href: "/projects" },
  { label: "Photography", href: "/photography" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        setIsVisible(true);
      } else {
        setIsVisible(window.scrollY <= 10);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMounted]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (!isMounted) return null;

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 transition-all duration-500 ease-in-out
      ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      bg-transparent backdrop-blur-none`}
    >
      <div className="flex items-center">
        <motion.div
          className="hidden lg:block rounded-xl overflow-hidden group relative"
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

        <a
          href="/"
          className="lg:hidden text-lg font-semibold text-primary/80 dark:text-sage/80"
        >
          A. TASSO
        </a>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {pathname !== "/secret" && (
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        )}

        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="group lg:hidden border-none bg-[#f5c76a] text-neutral-900 hover:bg-[#f5c76a]/90 hover:text-neutral-900 dark:bg-[#f5c76a] dark:text-white dark:hover:bg-[#f5c76a]/90"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            >
              <svg
                className="pointer-events-none"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12L20 12"
                  className="origin-center -translate-y-[7px] transition-all duration-300 stroke-[#111111] dark:stroke-white [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                />
                <path
                  d="M4 12H20"
                  className="origin-center transition-all duration-300 stroke-[#111111] dark:stroke-white [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                />
                <path
                  d="M4 12H20"
                  className="origin-center translate-y-[7px] transition-all duration-300 stroke-[#111111] dark:stroke-white [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="lg:hidden w-max rounded-lg border border-neutral-200 bg-white p-1 shadow-xl shadow-black/10"
          >
            {mobileLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <DropdownMenuItem key={item.href} asChild>
                  <a
                    href={item.href}
                    className={`flex w-full items-center rounded-md px-4 py-2.5 text-sm font-semibold tracking-wide text-black transition-colors focus-visible:outline-none ${
                      isActive ? "text-primary" : "text-black"
                    } hover:text-primary`}
                  >
                    {item.label}
                  </a>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden lg:flex items-center gap-4">
          <GlowMenu />
          {pathname !== "/secret" && <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}
