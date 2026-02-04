"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { DitheringBackground } from "../components/ui/hero-dithering-background";
function PublicationButtons() {
  useEffect(() => {
    const updateButtonColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      document.querySelectorAll(".doc-button").forEach((btn) => {
        (btn as HTMLElement).style.borderColor = isDark ? "#eaeaea" : "#1d4732";
        (btn as HTMLElement).style.color = isDark ? "#eaeaea" : "#1d4732";
      });
    };

    updateButtonColors();

    const observer = new MutationObserver(updateButtonColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.borderColor = "#f5c76a";
    e.currentTarget.style.color = "#f5c76a";
  };

  const handleLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isDark = document.documentElement.classList.contains("dark");
    e.currentTarget.style.borderColor = isDark ? "#eaeaea" : "#1d4732";
    e.currentTarget.style.color = isDark ? "#eaeaea" : "#1d4732";
  };

  return (
    <>
      {/* View Published Article */}
      <motion.a
        href="/publications/Article.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="doc-button px-5 py-2 text-sm font-semibold rounded-lg border-2 border-solid transition-all duration-300"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        View Published Article
      </motion.a>

      {/* View Submitted Manuscript */}
      <motion.a
        href="/publications/Manuscript.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="doc-button px-5 py-2 text-sm font-semibold rounded-lg border-2 border-solid transition-all duration-300"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        View Submitted Manuscript
      </motion.a>
    </>
  );
}
/* === Types === */
type Role = {
  title: string;
  date: string;
  color: string;
  points: string[];
};

/* === Industry Grid Helper === */
const IndustryGrid = ({
  roles,
  flipped,
  setFlipped,
}: {
  roles: Role[];
  flipped: number | null;
  setFlipped: (i: number | null) => void;
}) => {
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const wrappers = useRef<Array<HTMLDivElement | null>>([]);

useEffect(() => {
  const updateHeights = () => {
    requestAnimationFrame(() => {
      const heights = wrappers.current.map((el) => {
        if (!el) return 0;

        const inner = el.querySelector(".flip-inner") as HTMLElement | null;
        if (!inner) return el.scrollHeight;

        // Temporarily disable transform for proper measurement
        const prevTransform = inner.style.transform;
        inner.style.transform = "none";

        // Measure both faces separately
        const front = inner.querySelector(".flip-front") as HTMLElement | null;
        const back = inner.querySelector(".flip-back") as HTMLElement | null;

        const frontHeight = front ? front.scrollHeight : 0;
        const backHeight = back ? back.scrollHeight : 0;

        // Restore transform
        inner.style.transform = prevTransform;

        // Return the taller of the two sides + small buffer
        return Math.max(frontHeight, backHeight) + 20;
      });

      const tallest = Math.max(...heights);
      if (tallest > 0) setMaxHeight(tallest);
    });
  };

  updateHeights();
  window.addEventListener("resize", updateHeights);

  return () => window.removeEventListener("resize", updateHeights);
}, [roles.length]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {roles.map((role, i) => (
        <div
          key={i}
          ref={(el: HTMLDivElement | null): void => {
  wrappers.current[i] = el;
}}

style={{
  height: maxHeight ? `${maxHeight}px` : "auto",
  minHeight: "375px",
}}
          className={`flip-card ${flipped === i ? "flipped" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setFlipped(flipped === i ? null : i);
          }}
        >
          <div className="flip-inner">
            {/* FRONT SIDE */}
            <div className="flip-front bg-white border-2 border-neutral-300 flex flex-col items-center text-center p-6 pt-12">
              {/* Medtronic Logo */}
              <div className="absolute top-8 w-64 h-25 rounded-lg border-4 border-white bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logos/medtronic-logo.JPG"
                  alt="Medtronic logo"
                  fill
                  className="object-contain px-2"
                  priority
                />
              </div>

              <div className="mt-32 flex flex-col items-center">
                <h3
                  className={`text-2xl font-semibold ${
                    role.color === "blue"
                      ? "text-blue-700 dark:text-blue-400"
                      : role.color === "purple"
                      ? "text-purple-700 dark:text-purple-400"
                      : "text-green-700 dark:text-green-400"
                  }`}
                >
                  {role.title}
                </h3>
               <p className="mt-4 text-lg font-medium italic text-neutral-800">
                  {role.date}
                </p>
<p className="mt-6 text-base text-neutral-700">
                  Click to view details →
                </p>
              </div>
            </div>

            {/* BACK SIDE */}
            <div
              className={`
    absolute inset-0 rounded-xl p-8 shadow-xl backface-hidden rotate-y-180 
    flex flex-col border-2 bg-white overflow-hidden
    ${
      role.color === "blue"
        ? "border-blue-500"
        : role.color === "purple"
        ? "border-purple-500"
        : role.color === "green"
        ? "border-green-500"
        : "border-orange-500"
    }
  `}
            >
              <h4
                className={`text-xl font-semibold mb-4 ${
                  role.color === "blue"
                    ? "text-blue-700 dark:text-blue-300"
                    : role.color === "purple"
                    ? "text-purple-700 dark:text-purple-300"
                    : "text-green-700 dark:text-green-300"
                }`}
              >
                Key Contributions
              </h4>
              <ul className="list-disc list-inside space-y-2 text-neutral-900 leading-relaxed wrap-break-word">
                {role.points.map((point, j) => (
                  <li key={j} className="wrap-break-word">{point}</li>
                ))}
              </ul>
              <div className="flex-1 flex items-center">
                <span className="text-sm italic text-neutral-700">
                  ← Click anywhere to flip back
                </span>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ProfessionalPage() {
  const [flipped, setFlipped] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const researchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        researchRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !researchRef.current.contains(e.target as Node)
      ) {
        setFlipped(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const roles: Role[] = [
    {
      title: "Surgical Robotics — R&D",
      date: "Summer 2025 · Lafayette, CO",
      color: "blue",
      points: [
        "Designed custom Instron fixtures for Hugo™ RAS Instrumentation, leveraging DOE & Minitab to quantify friction and wear performance.",
        "Applied Monte Carlo tolerance‐stack simulations to reduce kinematic backlash in end-effectors.",
        "Performed fracture‐surface analysis using Keyence VHX microscopy post-fatigue testing.",
      ],
    },
    {
      title: "RPM Test Hardware — R&D",
      date: "Summer 2024 · Lafayette, CO",
      color: "purple",
      points: [
        "Executed verification testing of SpineAir™ frames on S8 StealthStation and O-Arm achieving ≤2.3 mm accuracy.",
        "Developed torque and clamp fixtures in SolidWorks improving mechanical test throughput by ~20%.",
        "Led Minitab-based functional analysis study comparing reprocessed vs new AQM devices, driving FMEA reliability updates.",
      ],
    },
    {
      title: "Sterilization & Operations Engineering",
      date: "Summer 2023 · Lafayette, CO",
      color: "green",
      points: [
        "Directed a 750-sample validation study confirming EO sterility and 7-day release protocol compliance.",
        "Analyzed 100+ cycle datasets to verify process reproducibility and identify variability trends.",
        "Authored a 30-page ISO11135 parametric release report supporting cross-site standardization.",
      ],
    },
  ];
const [researchMaxHeight, setResearchMaxHeight] = useState<number>(0);
const researchWrappers = useRef<Array<HTMLDivElement | null>>([]);

useEffect(() => {
  const updateHeights = () => {
    requestAnimationFrame(() => {
      const heights = researchWrappers.current.map((el) => {
        if (!el) return 0;

        const inner = el.querySelector(".flip-inner") as HTMLElement | null;
        if (!inner) return el.scrollHeight;

        // Temporarily disable transform for accurate measurement
        const prevTransform = inner.style.transform;
        inner.style.transform = "none";

        // Measure both faces
        const front = inner.querySelector(".flip-front") as HTMLElement | null;
        const back = inner.querySelector(".flip-back") as HTMLElement | null;

        const frontHeight = front ? front.scrollHeight : 0;
        const backHeight = back ? back.scrollHeight : 0;

        // Restore transform
        inner.style.transform = prevTransform;

        // Return tallest side + padding buffer
        return Math.max(frontHeight, backHeight) + 20;
      });

      const tallest = Math.max(...heights);
      if (tallest > 0) setResearchMaxHeight(tallest);
    });
  };

  updateHeights();
  window.addEventListener("resize", updateHeights);
  return () => window.removeEventListener("resize", updateHeights);
}, [roles.length]);
  return (
    <section className="py-8 w-full flex flex-col gap-10 bg-background dark:bg-darkbg transition-colors duration-500">
      {/* ===== HERO ===== */}
      <div className="w-full relative">
      <section className="relative w-full max-w-[1350px] mx-auto h-[90vh] rounded-xl overflow-hidden shadow-lg">
        <div className="relative w-full h-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl flex flex-col items-center justify-center">
          <DitheringBackground
            color="#5A9DF9"
            speed={0.2}
            hoverSpeed={0.6}
            darkOpacity={40}
          />
          <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5A9DF9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5A9DF9]"></span>
              </span>
              Industry & Research
            </div>

            <h1
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.05]"
              style={{ color: "#ffffff" }}
            >
              Professional<br />
              <span style={{ color: "#ffffff" }}>Experience</span>
            </h1>

            <p className="text-white text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Bridging engineering, research, and design across industry and academia.
            </p>

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

      {/* ===== INDUSTRY EXPERIENCE ===== */}
      <section
        ref={containerRef}
        className="w-full max-w-[1600px] mx-auto px-12 py-5 space-y-24"
      >
        <motion.div
  className="space-y-12 px-12 py-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2
            className="text-6xl font-extrabold text-center mb-8 tracking-wide"
            style={{ color: "#1d4732" }}
          >
            Industry Experience
          </h2>
          <IndustryGrid roles={roles} flipped={flipped} setFlipped={setFlipped} />
        </motion.div>
      </section>

 {/* ===== RESEARCH EXPERIENCE ===== */}
<section
  ref={researchRef}
  className="w-full max-w-[1400px] mx-auto px-12 py-5 space-y-16"
>
  <motion.div
    className="space-y-12"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
  >
    <h2
      className="text-6xl font-extrabold text-center mb-8 tracking-wide"
      style={{ color: "#1d4732" }}
    >
      Research Experience
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {[
        {
          title:
            "Undergraduate Researcher — USC Laboratory for Design of Medical & Analytical Devices",
          date: "Aug 2022 – May 2025 · Los Angeles, CA",
          color: "orange",
          points: [
            "Developed a flexible electrochemical biosensor for theophylline quantification in human milk, enabling noninvasive pharmacological monitoring.",
            "Integrated enzyme immobilization and potentiometric detection achieving high sensitivity and repeatability in lactation fluid analysis.",
            "Designed, fabricated, and calibrated sensor electrodes using laser-induced graphene and analyzed signal response in MATLAB.",
          ],
        },
        {
          title:
            "Graduate Research Assistant — USC Advanced Composites Design Lab",
          date: "July 2025 – Present · Los Angeles, CA",
          color: "red",
          points: [
            "Led finite element modeling and structural optimization of continuous fiber–reinforced polymer composites for SAMPE 2026 competition.",
            "Performed vacuum infusion experiments to optimize fiber alignment and resin flow using MATLAB and SolidWorks Simulation.",
            "Conducted delamination testing and failure analysis correlating strain energy release rate (G₁c) with laminate layup design.",
          ],
        },
      ].map((role, i) => (
        <div
  key={i}
  ref={(el: HTMLDivElement | null) => {
    researchWrappers.current[i] = el;
  }}
style={{
  height: researchMaxHeight ? `${researchMaxHeight}px` : "auto",
  minHeight: "480px",
}}
  className="relative cursor-pointer perspective-[1000px]"
  onClick={(e) => {
    e.stopPropagation();
    setFlipped(flipped === i + 10 ? null : i + 10);
  }}
>
          <div
            className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
              flipped === i + 10 ? "rotate-y-180" : ""
            }`}
          >
            {/* FRONT SIDE */}
            <div className="absolute inset-0 bg-white light:bg-neutral-900 border-2 border-neutral-300 light:border-neutral-700 rounded-xl shadow-lg flex flex-col items-center text-center p-6 pt-12 backface-hidden">
              {/* USC Viterbi Logo */}
              <div className="absolute top-6 w-94 h-30 rounded-lg border-4 border-white light:border-neutral-800 bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logos/viterbi-logo.JPG"
                  alt="USC Viterbi School of Engineering logo"
                  fill
                  className="object-contain px-2"
                  priority
                />
              </div>

              {/* Title and info */}
              <div className="mt-32 flex flex-col items-center">
                <h3
                  className={`text-2xl font-semibold ${
                    role.color === "orange"
                      ? "text-orange-700 dark:text-orange-400"
                      : "text-red-700 dark:text-red-500"
                  }`}
                >
                  {role.title}
                </h3>
<p className="mt-4 text-lg font-medium italic text-neutral-800">
                  {role.date}
                </p>
<p className="mt-6 text-base text-neutral-700">
                  Click to view details →
                </p>
              </div>
            </div>

{/* BACK SIDE */}
            <div
              className={`
    absolute inset-0 rounded-xl p-8 shadow-xl backface-hidden rotate-y-180 
    flex flex-col border-2 bg-white overflow-hidden
    ${
      role.color === "orange"
        ? "border-orange-500"
        : role.color === "red"
        ? "border-red-700"
        : "border-red-700"
    }`}
            >


              <h4
                className={`text-xl font-semibold mb-4 ${
                  role.color === "orange"
                    ? "text-orange-700 dark:text-orange-300"
                    : "text-red-700 dark:text-red-700"
                }`}
              >
                Key Contributions
              </h4>
              <ul className="list-disc list-inside space-y-2 text-neutral-900 leading-relaxed wrap-break-word">
                {role.points.map((point, j) => (
                  <li key={j} className="wrap-break-word">{point}</li>
                ))}
              </ul>
              <div className="flex-1 flex items-center">
                <span className="text-sm italic text-neutral-700">
                  ← Click anywhere to flip back
                </span>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
</section>

      {/* ===== PUBLICATIONS ===== */}
      <motion.div
  className="flex flex-col items-center justify-center py-20 space-y-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
            <h2
      className="text-6xl font-extrabold text-center mb-8 tracking-wide"
      style={{ color: "#1d4732" }}
    >
      Publications
    </h2>

        <div className="space-y-8">
          {/* Theophylline Paper */}
          <div className="p-8 rounded-xl bg-white/90 dark:bg-darkprimary/30 shadow-lg">
<h3 className="publication-title text-2xl font-semibold mb-4 leading-snug">
  A Point-of-Care Device for Theophylline Quantification in Human Milk Using Laser-Induced Graphene Electrodes
</h3>
  <p className="text-xl italic text-neutral-800 dark:text-sage mb-6">
    USC Laboratory for Design of Medical and Analytical Devices, 2024.
  </p>
  <p className="text-lg text-neutral-800 dark:text-sage leading-relaxed tracking-wide">
    Developed a <strong>rapid electrochemical biosensor</strong> using
    <strong> laser-induced graphene electrodes </strong> for direct <em>theophylline</em> detection in human breast milk,
    achieving <strong>sub-1-minute analysis time</strong>, <strong>6.5 µM detection limit</strong>, and
    <strong> 0.03 µA/µM sensitivity</strong>. Demonstrated <strong>99–111% recovery</strong> across lactation stages,
    indicating high reproducibility for <strong>noninvasive therapeutic drug monitoring</strong> in lactating mothers.
  </p>
</div>


{/* === PUBLICATION BUTTONS (Reactive with Theme Switch) === */}
<motion.div
  className="flex justify-center gap-6 -mt-4"
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <PublicationButtons />
</motion.div>

          {/* Glucose Paper */}
          <div className="p-8 rounded-xl bg-white/90 dark:bg-darkprimary/30 shadow-lg">
<h3 className="publication-title text-2xl font-semibold mb-4 leading-snug">
  Mom and Baby Wellness with a Smart Lactation Pad: A Wearable Sensor-Embedded Lactation Pad for On-Body Quantification of Glucose in Breast Milk
</h3>
  <p className="text-xl italic text-neutral-800 dark:text-sage mb-6">
    USC Laboratory for Design of Medical and Analytical Devices, 2024.
  </p>
  <p className="text-lg text-neutral-800 dark:text-sage leading-relaxed tracking-wide">
    Designed the first <strong>wearable lactation pad</strong> integrating <strong>microfluidic channels </strong> 
    and <strong>enzymatic electrochemical sensors</strong> for on-body <em>glucose</em> quantification in undiluted human milk. 
    Achieved <strong>96.8–104.1 % recovery accuracy</strong> across postpartum stages, establishing a new <strong>biosensing platform</strong> for <strong>maternal and infant wellness monitoring</strong>.
  </p>
</div>
{/* Button for Mom & Baby Published Article */}
<motion.div
  className="flex justify-center gap-6 mt-4 mb-10"
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <motion.a
    href="/publications/Mom_Baby_Article.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="doc-button px-5 py-2 text-sm font-semibold rounded-lg border-2 border-solid transition-all duration-300"
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "#f5c76a";
      e.currentTarget.style.color = "#f5c76a";
    }}
    onMouseLeave={(e) => {
      const isDark = document.documentElement.classList.contains("dark");
      e.currentTarget.style.borderColor = isDark ? "#eaeaea" : "#1d4732";
      e.currentTarget.style.color = isDark ? "#eaeaea" : "#1d4732";
    }}
  >
    View Published Article
  </motion.a>
</motion.div>
        </div>
      </motion.div>

      {/* ===== VIEW MY DOCUMENTS ===== */}
<motion.div
  className="flex flex-col items-center justify-center py-5 space-y-6 text-center"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  viewport={{ once: true }}
>
 <h2
      className="text-6xl font-extrabold text-center mb-8 tracking-wide"
      style={{ color: "#1d4732" }}
    >
      My Documents
    </h2>
  <div className="flex flex-wrap justify-center gap-6">
    {/* View CV Button */}
    <motion.a
      href="/cv_resume/Alessandro_Tasso_CV.pdf"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ backgroundColor: "transparent", color: "rgb(22, 101, 52)" }}
      whileHover={{
        backgroundColor: "rgb(34, 197, 94)",
        color: "#fff",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      className="px-6 py-3 text-md font-semibold border-2 border-green-600 rounded-xl hover:shadow-lg transition-all duration-300"
    >
      View CV
    </motion.a>

    {/* View Resume Button */}
    <motion.a
      href="/cv_resume/Alessandro_Tasso_BME(BS)_ME(MS)_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ backgroundColor: "transparent", color: "rgb(37, 99, 235)" }}
      whileHover={{
        backgroundColor: "rgb(59, 130, 246)",
        color: "#fff",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      className="px-6 py-3 text-md font-semibold border-2 border-blue-600 rounded-xl hover:shadow-lg transition-all duration-300"
    >
      View Resume
    </motion.a>
  </div>
</motion.div>
    </section>
  );
}    

