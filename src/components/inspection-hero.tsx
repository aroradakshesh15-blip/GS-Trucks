"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ClipboardCheck, ShieldCheck, Truck } from "lucide-react";

import workshop from "@/assets/workshop.jpg";
import { EASE_OUT, Eyebrow } from "@/components/motion";

const trust = [
  { icon: ShieldCheck, label: "CVOR-compliant inspections" },
  { icon: Truck, label: "Trucks & trailers, all makes" },
  { icon: ClipboardCheck, label: "Experienced service team" },
];

export function InspectionHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[36rem] flex-col justify-end overflow-hidden pb-16 pt-32 sm:min-h-[42rem] sm:pb-20 sm:pt-40">
      <div className="absolute inset-0 -z-20">
        <motion.img
          src={workshop}
          alt=""
          className="h-full w-full object-cover"
          initial={reduce ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.55, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/85" />
      </div>
      <div className="technical-grid absolute inset-0 -z-10 opacity-[0.14]" aria-hidden />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <Eyebrow>Annual Inspection</Eyebrow>
        </motion.div>

        <h1 className="mt-5 max-w-4xl text-[clamp(2.6rem,7vw,5.75rem)] font-bold leading-[0.95]">
          {["Annual Truck", "Inspection"].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.75, delay: 0.2 + i * 0.09, ease: EASE_OUT }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT }}
        >
          Keep your commercial vehicle safe, compliant, and road-ready with a thorough annual
          inspection performed by our experienced service team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE_OUT }}
        >
          <a
            href="#inspection-request"
            className="group mt-9 inline-flex items-center justify-center gap-3 bg-primary px-7 py-4 font-display text-lg tracking-wide text-primary-foreground transition-colors hover:bg-hazard"
          >
            Request an Inspection
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        <motion.ul
          className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08, delayChildren: 0.7 }}
        >
          {trust.map(({ icon: Icon, label }) => (
            <motion.li
              key={label}
              className="flex items-center gap-2 text-sm text-muted-foreground"
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
            >
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
