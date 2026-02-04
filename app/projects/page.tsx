"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DitheringBackground } from "../components/ui/hero-dithering-background";

const projects = [
  {
    title: "ReFlex Glove for Stroke Recovery",
    description:
      "Mechatronic assistive device with force-sensing grip activation, servo-driven Bowden cable actuation, and 3D-printed thermoformable structure delivering ≥15 N grip force.",
    href: "/projects/reflex-glove",
    skills: ["Embedded Systems", "Mechatronics", "3D Fabrication"],
  },
  {
    title: "Centrifugal Governor",
    description:
      "Parametric design optimization of a high-speed governor under strict constraints, validated through FEA stress analysis and mesh convergence studies.",
    href: "/projects/centrifugal-governor",
    skills: ["FEA", "SolidWorks", "Design Optimization"],
  },
];

export default function ProjectsPage() {
  return (
    <section className="py-8 w-full flex flex-col gap-10">
      {/* Hero Card with Dithering */}
      <div className="w-full relative">
        <section className="relative w-full max-w-[1350px] mx-auto h-[90vh] rounded-xl overflow-hidden shadow-lg">
        <div className="relative w-full h-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl flex flex-col items-center justify-center">
          {/* Dithering Background */}
          <DitheringBackground 
            color="#EC4E02" 
            speed={0.2} 
            hoverSpeed={0.6}
            darkOpacity={40}
          />

          {/* Content */}
          <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC4E02] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EC4E02]"></span>
              </span>
              Engineering Portfolio
            </div>

            {/* Headline */}
            <h1
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.05]"
              style={{ color: "#ffffff" }}
            >
              Projects &<br />
              <span style={{ color: "#ffffff" }}>Innovation</span>
            </h1>
            
            {/* Description */}
            <p className="text-white text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              A showcase of engineering, design, and innovation work — blending
              mechanics, medical devices, and user-centered design principles.
            </p>

            {/* Scroll indicator */}
            <div className="animate-bounce text-white">
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
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* Featured Projects Grid */}
      <div className="w-full max-w-[1350px] mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            key={project.title}
            href={project.href}
            className="group relative p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:border-[#EC4E02]/50 dark:hover:border-[#EC4E02]/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-white group-hover:text-[#EC4E02] transition-colors">
                {project.title}
              </h3>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-[#EC4E02] group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-[#EC4E02]/10 group-hover:text-[#EC4E02] transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}
