"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const GovernorModel = dynamic(() => import("./GovernorModel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl border border-sage/40 dark:border-darkaccent/30 flex items-center justify-center bg-sage/5 dark:bg-darkaccent/5">
      <p className="text-charcoal/60 dark:text-sage/60">Loading 3D model...</p>
    </div>
  ),
});

export default function CentrifugalGovernorPage() {
  const router = useRouter();
  
  return (
    <section className="space-y-12 pt-8">
      {/* Header */}
      <div className="space-y-4">
        <button
          onClick={() => router.push("/projects")}
          className="back-to-projects inline-flex items-center gap-2 text-sm transition cursor-pointer text-[#1d4732] dark:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 dark:bg-darkaccent/10 text-primary dark:text-darkaccent">
            AME 408
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-sage/20 dark:bg-darkprimary/20 text-charcoal dark:text-sage">
            Fall 2025
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-darkaccent">
          Centrifugal Governor Design & Optimization
        </h1>
        <p className="text-lg text-charcoal/80 dark:text-sage/80 max-w-none">
          Designed and optimized a centrifugal governor under strict geometric and performance constraints, 
          then validated the final configuration through FEA stress analysis and mesh convergence studies in SolidWorks.
        </p>
      </div>

      {/* Project Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Project Overview</h2>
        <p className="text-charcoal/80 dark:text-sage/80 leading-relaxed">
          This project involved the design and optimization of a centrifugal governor operating at
          6,000 rad/s angular velocity using a custom MIRAGE 250 CVM material. The optimization
          objective was to maximize arm width (W), then maximize arm length (L₁), while minimizing
          arm thickness (t) — subject to geometric constraints, maximum von Mises stress limits,
          total deflection thresholds, and natural frequency requirements. Through parametric CAD
          modeling and systematic finite element analysis with mesh convergence validation, we
          implemented constraint-based filtering to reduce the design space from millions of
          dimension combinations to a single Pareto-optimal solution validated through static
          structural and modal FEA simulations.
        </p>
      </div>

      {/* Design Constraints */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Design Model & Constraints</h2>
        
        {/* 3D Model and Dimension Diagram side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 3D Model Viewer */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary dark:text-darkaccent">3D Model</h3>
            <p className="text-xs text-charcoal/60 dark:text-sage/60">
              Click and drag to rotate
            </p>
            <GovernorModel />
          </div>

          {/* Dimension Diagram */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary dark:text-darkaccent">Dimension Reference</h3>
            <p className="text-xs text-charcoal/60 dark:text-sage/60">&nbsp;</p>
            <div className="rounded-xl border border-sage/40 dark:border-darkaccent/30 p-4 bg-white dark:bg-white flex items-center justify-center h-[400px] md:h-[500px]">
              <Image
                src="/projects/governor-dimensions.png"
                alt="Governor dimension diagram showing L1, L2, W, t, and d parameters"
                width={500}
                height={350}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Two constraint boxes side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Performance Constraints */}
          <div className="p-5 rounded-xl border border-sage/40 dark:border-darkaccent/30 space-y-3">
            <h3 className="text-lg font-semibold text-primary dark:text-darkaccent">Performance Constraints</h3>
            <table className="w-full text-sm">
              <tbody className="text-charcoal/80 dark:text-sage/80">
                <tr className="border-b border-sage/20 dark:border-darkaccent/20">
                  <td className="py-2 font-medium">Axial Deflection</td>
                  <td className="py-2 font-mono text-right">&lt; 1.15 mm</td>
                </tr>
                <tr className="border-b border-sage/20 dark:border-darkaccent/20">
                  <td className="py-2 font-medium">Natural Frequency</td>
                  <td className="py-2 font-mono text-right">&lt; 2000 Hz</td>
                </tr>
                <tr className="border-b border-sage/20 dark:border-darkaccent/20">
                  <td className="py-2 font-medium">Centrifugal Load</td>
                  <td className="py-2 font-mono text-right">6,000 rad/s</td>
                </tr>
                <tr className="border-b border-sage/20 dark:border-darkaccent/20">
                  <td className="py-2 font-medium">Material</td>
                  <td className="py-2 text-right">MIRAGE 250 CVM</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Optimization Priority</td>
                  <td className="py-2 text-right">Wide → Long → Thin</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Geometric Constraints */}
          <div className="p-5 rounded-xl border border-sage/40 dark:border-darkaccent/30 space-y-3">
            <h3 className="text-lg font-semibold text-primary dark:text-darkaccent">Geometric Constraints</h3>
            <table className="w-full text-sm">
              <tbody className="text-charcoal/80 dark:text-sage/80">
                <tr className="border-b border-sage/20 dark:border-darkaccent/20">
                  <td className="py-2 font-medium">Proportional Limit</td>
                  <td className="py-2 font-mono text-right">1.4L₂ ≤ L₁ ≤ 1.8L₂</td>
                </tr>
                <tr className="border-b border-sage/20 dark:border-darkaccent/20">
                  <td className="py-2 font-medium">Container Fitment</td>
                  <td className="py-2 font-mono text-right">L₁ + L₂ + t &lt; 25 mm</td>
                </tr>
                <tr className="border-b border-sage/20 dark:border-darkaccent/20">
                  <td className="py-2 font-medium">Offset Range</td>
                  <td className="py-2 font-mono text-right">0.75 mm ≤ d ≤ 2.0 mm</td>
                </tr>
                <tr className="border-b border-sage/20 dark:border-darkaccent/20">
                  <td className="py-2 font-medium">Thickness Limit</td>
                  <td className="py-2 font-mono text-right">t ≤ 0.5 · d</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Dimension Increment</td>
                  <td className="py-2 font-mono text-right">0.25 mm multiples</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Optimization Methodology */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Optimization Methodology</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: "1",
              title: "Parametric Modeling",
              desc: "Implemented parametric CAD modeling with global design variables (L₁, L₂, t, W, d) to generate a configuration space spanning millions of geometric permutations.",
            },
            {
              step: "2",
              title: "Constraint Filtering",
              desc: "Applied geometric and performance constraint equations to reduce the design space through combinatorial elimination before computational analysis.",
            },
            {
              step: "3",
              title: "FEA Validation",
              desc: "Executed finite element analysis using symmetry reduction (1/8 model) with static structural and modal studies under centrifugal body forces at 6,000 rad/s.",
            },
            {
              step: "4",
              title: "Mesh Convergence",
              desc: "Performed h-refinement mesh convergence analysis, iteratively reducing element size from 0.6mm to 0.1875mm until von Mises stress convergence error <5%.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-lg border border-sage/40 dark:border-darkaccent/30"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-darkaccent/10 text-primary dark:text-darkaccent flex items-center justify-center font-bold text-sm mb-3">
                {item.step}
              </div>
              <h4 className="font-semibold text-charcoal dark:text-darkaccent mb-1">{item.title}</h4>
              <p className="text-sm text-charcoal/70 dark:text-sage/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stress Mitigation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Stress Concentration Mitigation</h2>
        <p className="text-charcoal/80 dark:text-sage/80 leading-relaxed">
          Strategic fillet placement was used to move maximum Von Mises stress away from the
          critical arm/shaft junction:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex justify-center">
            <Image
              src="/projects/governor-stress-analysis-2.png"
              alt="Von Mises stress analysis showing stress distribution on the governor model"
              width={800}
              height={600}
              className="max-w-full h-auto"
            />
          </div>
          <div className="flex justify-center">
            <Image
              src="/projects/governor-stress-analysis.png"
              alt="Von Mises stress analysis showing stress distribution on the governor model"
              width={800}
              height={600}
              className="max-w-full h-auto"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-sage/40 dark:border-darkaccent/30">
            <p className="font-semibold text-charcoal dark:text-darkaccent">0.2mm Fillet</p>
            <p className="text-sm text-charcoal/70 dark:text-sage/70">At arm/shaft junction — reduces stress concentration at critical interface</p>
          </div>
          <div className="p-4 rounded-lg border border-sage/40 dark:border-darkaccent/30">
            <p className="font-semibold text-charcoal dark:text-darkaccent">0.3mm Fillet</p>
            <p className="text-sm text-charcoal/70 dark:text-sage/70">Along arm edges — redistributes stress to first bend in governor arm</p>
          </div>
        </div>
      </div>

      {/* Final Optimized Dimensions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Final Optimized Dimensions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-sage/40 dark:border-darkaccent/30 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-sage/10 dark:bg-darkaccent/10">
                <th className="py-3 px-4 font-semibold text-charcoal dark:text-darkaccent">t (mm)</th>
                <th className="py-3 px-4 font-semibold text-charcoal dark:text-darkaccent">L₁ (mm)</th>
                <th className="py-3 px-4 font-semibold text-charcoal dark:text-darkaccent">L₂ (mm)</th>
                <th className="py-3 px-4 font-semibold text-charcoal dark:text-darkaccent">W (mm)</th>
                <th className="py-3 px-4 font-semibold text-charcoal dark:text-darkaccent">d (mm)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center text-charcoal/80 dark:text-sage/80">
                <td className="py-3 px-4 font-mono text-lg">1.5</td>
                <td className="py-3 px-4 font-mono text-lg">14.75</td>
                <td className="py-3 px-4 font-mono text-lg">8.5</td>
                <td className="py-3 px-4 font-mono text-lg">6.75</td>
                <td className="py-3 px-4 font-mono text-lg">1.5</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Constraint Verification */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { check: "1.4L₂ ≤ L₁ ≤ 1.8L₂", status: "YES" },
            { check: "L₁+L₂+t < 25mm", status: "YES" },
            { check: "f₁ < 2000Hz", status: "YES" },
            { check: "δ_axial < 1.15mm", status: "YES" },
            { check: "In Container", status: "YES" },
            { check: "Fillets Applied", status: "YES" },
          ].map((item) => (
            <div
              key={item.check}
              className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/20"
            >
              <span className="text-xs text-charcoal/80 dark:text-sage/80">{item.check}</span>
              <span className="text-xs font-bold text-green-600 dark:text-green-400">{item.status}</span>
            </div>
          ))}
        </div>

        {/* FEA Results Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Length", value: "24.75 mm" },
            { label: "Total Deflection", value: "0.9324 mm" },
            { label: "Natural Frequency", value: "1567.6 Hz" },
            { label: "Axial Deflection", value: "0.9196 mm" },
            { label: "Mass", value: "3.267 g" },
            { label: "Max Stress", value: "1421 MPa" },
          ].map((spec) => (
            <div
              key={spec.label}
              className="p-4 rounded-xl border border-sage/40 dark:border-darkaccent/30 text-center"
            >
              <p className="text-lg font-bold text-primary dark:text-darkaccent">{spec.value}</p>
              <p className="text-xs text-charcoal/60 dark:text-sage/60 mt-1">{spec.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tools & Skills */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Tools & Skills</h2>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "Finite Element Method",
            "FEA Simulation",
            "Constraint-Based Design & Verification",
            "Stress Concentration Analysis + Mitigation",
            "SolidWorks",
            "Technical Report Composition",
            "Project Leadership",
          ].map((skill, index, array) => (
            <span key={skill} className="flex items-center gap-2">
              <span className="px-3 py-1.5 text-sm rounded-full bg-sage/20 dark:bg-darkaccent/10 text-charcoal dark:text-sage">
                {skill}
              </span>
              {index < array.length - 1 && (
                <span className="text-charcoal/40 dark:text-sage/40">•</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Project Report PDF */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary dark:text-white">Project Report</h2>
        <a
          href="/projects/centrifugal-governor/report.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary dark:bg-transparent text-white dark:text-white font-medium text-sm hover:opacity-90 dark:hover:text-darkaccent transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Full Report
        </a>
      </div>
    </section>
  );
}
