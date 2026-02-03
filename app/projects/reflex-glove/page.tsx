"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ReflexGlovePage() {
  const router = useRouter();

  return (
    <section className="space-y-12 pt-8 max-w-5xl mx-auto">
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
            BME 405 / Fall 2024
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 dark:bg-darkaccent/10 text-primary dark:text-darkaccent">
            Senior Design Project
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-charcoal dark:text-white">
          ReFlex Glove for Stroke Recovery
        </h1>
        <p className="text-charcoal/70 dark:text-sage/70 text-lg">
          A mechatronic assistive device enabling stroke patients with weakened grip strength to regain 
          independence in daily activities through force-sensing grip activation and servo-driven finger actuation.
        </p>
      </div>

      {/* Built Under Constraints */}
      <div className="p-4 rounded-lg border border-primary/30 dark:border-darkaccent/30 bg-primary/5 dark:bg-darkaccent/5">
        <div className="flex items-start gap-3">
          <span className="text-primary dark:text-darkaccent text-xl">⚠</span>
          <div>
            <h3 className="font-semibold text-primary dark:text-darkaccent">Built Under Constraints</h3>
            <p className="text-sm text-charcoal/70 dark:text-sage/70">
              Completed in 6 weeks with limited materials and budget. The emphasis was on creating a 
              functional proof-of-concept that demonstrated core assistive capabilities and validated 
              the mechatronic design approach.
            </p>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Project Overview</h2>
        <p className="text-charcoal/80 dark:text-sage/80 leading-relaxed">
          Strokes affect approximately 800,000 people annually in the US, with nearly 50% experiencing 
          lasting upper extremity impairments. The ReFlex Glove addresses this critical need by providing 
          real-time grip assistance through an integrated system of resistive force sensors, servo motors 
          with Bowden cable actuation, and a lightweight 3D-printed exoskeletal structure. The device 
          detects user intent via palm-mounted force sensors sampling at 100 Hz, processes signals through 
          a low-pass filter and rolling average algorithm, and actuates three servo motors to flex the 
          thumb, middle, and ring fingers with up to 15 N of gripping force.
        </p>
      </div>

      {/* Key Specifications */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Technical Specifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Grip Force", value: "≥15 N", detail: "Secure object retention" },
            { label: "System Weight", value: "≤680 g", detail: "1.5 lbs total" },
            { label: "Battery Runtime", value: "~2 hrs", detail: "Continuous operation" },
            { label: "Servo Torque", value: "≥0.2 N·m", detail: "Per actuator" },
            { label: "Force Detection", value: "0.2–5 N", detail: "Sensor range" },
            { label: "ADC Sampling", value: "100 Hz", detail: "Real-time response" },
            { label: "Release Force", value: "<1.5 N", detail: "Button actuation" },
            { label: "Noise Level", value: "≤40 dB", detail: "Social suitability" },
            { label: "Durability", value: "1,000+", detail: "Grip-release cycles" },
          ].map((spec) => (
            <div
              key={spec.label}
              className="p-4 rounded-lg bg-sage/20 dark:bg-white/5 border border-sage/30 dark:border-white/10"
            >
              <p className="text-sm text-charcoal/60 dark:text-sage/60">{spec.label}</p>
              <p className="text-2xl font-bold text-primary dark:text-darkaccent">{spec.value}</p>
              <p className="text-xs text-charcoal/50 dark:text-sage/50">{spec.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">System Architecture</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hardware */}
          <div className="p-6 rounded-xl bg-sage/10 dark:bg-white/5 border border-sage/30 dark:border-white/10">
            <h3 className="text-lg font-semibold text-primary dark:text-darkaccent mb-4">Hardware Components</h3>
            <ul className="space-y-3 text-charcoal/80 dark:text-sage/80 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary dark:text-darkaccent mt-1">•</span>
                <span><strong>Microcontroller:</strong> Adafruit Feather M0 (ATSAMD21) with integrated ADC and PWM outputs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary dark:text-darkaccent mt-1">•</span>
                <span><strong>Force Sensor:</strong> Alpha MF01A-N-221-A01 resistive sensor with 0.2–5 N detection range</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary dark:text-darkaccent mt-1">•</span>
                <span><strong>Actuation:</strong> 3× 25KG servo motors with Bowden cable transmission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary dark:text-darkaccent mt-1">•</span>
                <span><strong>Power:</strong> 6V battery pack (4× AAA in series), ~520 mA draw</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary dark:text-darkaccent mt-1">•</span>
                <span><strong>Structure:</strong> 3D-printed PLA Tough with thermoformable palm brace</span>
              </li>
            </ul>
          </div>
          
          {/* Software */}
          <div className="p-6 rounded-xl bg-sage/10 dark:bg-white/5 border border-sage/30 dark:border-white/10">
            <h3 className="text-lg font-semibold text-primary dark:text-darkaccent mb-4">Signal Processing</h3>
            <ul className="space-y-3 text-charcoal/80 dark:text-sage/80 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary dark:text-darkaccent mt-1">•</span>
                <span><strong>Sampling:</strong> 100 Hz ADC digitization for real-time responsiveness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary dark:text-darkaccent mt-1">•</span>
                <span><strong>Filtering:</strong> Low-pass filter removes high-frequency noise artifacts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary dark:text-darkaccent mt-1">•</span>
                <span><strong>Smoothing:</strong> Rolling average over 5 samples stabilizes fluctuations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary dark:text-darkaccent mt-1">•</span>
                <span><strong>Threshold:</strong> Calibrated 0.2 N activation to prevent false triggers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary dark:text-darkaccent mt-1">•</span>
                <span><strong>Debounce:</strong> 50 ms software debounce for button input reliability</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Design Decisions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Engineering Decisions</h2>
        <div className="space-y-4">
          {[
            {
              title: "Servo Motors over DC Motors",
              rationale: "Servo motors maintain precise angular position without continuous power draw, enabling reliable return-to-position functionality essential for repeatable grip-release cycles. DC motors would require additional encoder feedback and control complexity.",
            },
            {
              title: "Bowden Cable Transmission",
              rationale: "Decouples motor housing from glove structure, reducing hand-mounted weight by relocating actuators to a hip-mounted enclosure. Minimizes user fatigue during extended wear while maintaining responsive force transmission.",
            },
            {
              title: "Hip-Mounted Motor Housing",
              rationale: "Shifts 85% of system mass away from the hand, improving comfort and reducing interference with natural hand movements. Design validated through iterative user feedback during design review process.",
            },
            {
              title: "Thermoformable PLA Structure",
              rationale: "PLA Tough heated to 100°C for 1 minute becomes moldable, enabling custom fit to individual hand geometry. Addresses accessibility across hand circumferences from 6.5–9 inches without requiring multiple SKUs.",
            },
          ].map((decision, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-sage/30 dark:border-white/10 bg-white/50 dark:bg-white/5"
            >
              <h3 className="font-semibold text-primary dark:text-darkaccent mb-2">{decision.title}</h3>
              <p className="text-sm text-charcoal/70 dark:text-sage/70">{decision.rationale}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Power Budget */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Power Budget Analysis</h2>
        <div className="p-6 rounded-xl bg-sage/10 dark:bg-white/5 border border-sage/30 dark:border-white/10">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-primary dark:text-darkaccent mb-3">Current Draw</h3>
              <table className="w-full text-sm">
                <tbody className="text-charcoal/80 dark:text-sage/80">
                  <tr className="border-b border-sage/20 dark:border-white/10">
                    <td className="py-2 w-2/3">Adafruit Feather M0</td>
                    <td className="py-2 w-1/3 text-right font-mono">10 mA</td>
                  </tr>
                  <tr className="border-b border-sage/20 dark:border-white/10">
                    <td className="py-2">Servo Motors (3×170 mA)</td>
                    <td className="py-2 text-right font-mono">510 mA</td>
                  </tr>
                  <tr className="font-semibold text-primary dark:text-darkaccent">
                    <td className="py-2">Total</td>
                    <td className="py-2 text-right font-mono">520 mA</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary dark:text-darkaccent mb-3">Runtime Calculation</h3>
              <table className="w-full text-sm">
                <tbody className="text-charcoal/80 dark:text-sage/80">
                  <tr className="border-b border-sage/20 dark:border-white/10">
                    <td className="py-2 w-1/3 font-semibold">Battery</td>
                    <td className="py-2 w-2/3 text-right font-mono">4× AAA (1.5V, series)</td>
                  </tr>
                  <tr className="border-b border-sage/20 dark:border-white/10">
                    <td className="py-2 font-semibold">Voltage</td>
                    <td className="py-2 text-right font-mono">6V nominal</td>
                  </tr>
                  <tr className="border-b border-sage/20 dark:border-white/10">
                    <td className="py-2 font-semibold">Capacity</td>
                    <td className="py-2 text-right font-mono">~1000 mAh</td>
                  </tr>
                  <tr className="font-semibold text-primary dark:text-darkaccent">
                    <td className="py-2">Runtime</td>
                    <td className="py-2 text-right font-mono">≈ 1.92 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Competitive Analysis */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">Market Positioning</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-sage/30 dark:border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-sage/20 dark:bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-primary dark:text-darkaccent">Device</th>
                <th className="px-4 py-3 text-left text-primary dark:text-darkaccent">Price</th>
                <th className="px-4 py-3 text-left text-primary dark:text-darkaccent">Limitation</th>
              </tr>
            </thead>
            <tbody className="text-charcoal/80 dark:text-sage/80">
              <tr className="border-t border-sage/20 dark:border-white/10">
                <td className="px-4 py-3">Saebo Glove</td>
                <td className="px-4 py-3">$350</td>
                <td className="px-4 py-3">Passive positioning only, no active grip assistance</td>
              </tr>
              <tr className="border-t border-sage/20 dark:border-white/10">
                <td className="px-4 py-3">Ipsihand</td>
                <td className="px-4 py-3">$30,000</td>
                <td className="px-4 py-3">Brain-computer interface, prohibitive cost</td>
              </tr>
              <tr className="border-t border-sage/20 dark:border-white/10">
                <td className="px-4 py-3">RobHand</td>
                <td className="px-4 py-3">Clinical</td>
                <td className="px-4 py-3">Stationary design, not suitable for daily use</td>
              </tr>
              <tr className="border-t border-sage/20 dark:border-white/10 bg-primary/5 dark:bg-darkaccent/10">
                <td className="px-4 py-3 font-semibold text-primary dark:text-darkaccent">ReFlex Glove</td>
                <td className="px-4 py-3 font-semibold text-primary dark:text-darkaccent">~$240</td>
                <td className="px-4 py-3 text-primary dark:text-darkaccent">Active grip, portable, customizable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* My Contributions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal dark:text-darkaccent">My Contributions</h2>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "CAD (Fusion 360)",
            "3D Fabrication",
            "Mechanical Design",
            "Bowden Cable Integration",
            "Rapid Prototyping",
            "Machine Shop Work",
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

      {/* Project Report */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary dark:text-white">Project Report</h2>
        <a
          href="/projects/ReFlex_Glove_CDR_Report.pdf"
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
