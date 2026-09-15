"use client";

import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import { FEATURED_SERVICES } from "@/lib/site";
import { EASE_OUT, Eyebrow, StaggerHeading } from "@/components/motion";
import mobileRepair from "@/assets/mobile-repair.jpg";
import workTrailer from "@/assets/work-trailer.jpg";
import workBrakes from "@/assets/work-brakes.jpg";
import workshop from "@/assets/workshop.jpg";
import workDiagnostics from "@/assets/work-diagnostics.jpg";
import heroRoadside from "@/assets/hero-roadside.jpg";
import { cn } from "@/lib/utils";

const serviceImages = [
  mobileRepair,
  heroRoadside,
  workTrailer,
  workDiagnostics,
  workBrakes,
  workshop,
];

const serviceLabels = [
  "Emergency response",
  "Shop capability",
  "Trailer systems",
  "Electronic faults",
  "Powertrain work",
  "Inspection ready",
];

/**
 * Featured services presented as a scroll-driven horizontal rail:
 * the track slides sideways as the pinned section scrolls past.
 */
export function ServicesRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-62%"]);
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      className="services-section relative h-[260vh] overflow-x-clip bg-[#0c0f10] lg:h-[220vh]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgb(255_22_22_/_0.14),transparent_26rem)]" />
      <div className="grid-plate pointer-events-none absolute inset-0 opacity-[0.08]" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/60 to-transparent lg:left-[7vw]" />

      <div className="services-sticky sticky top-0 flex min-h-[100svh] flex-col justify-start pb-10 pt-28 lg:pt-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4 border-b border-border/70 pb-4">
                <Eyebrow>What we fix</Eyebrow>
              </div>
              <StaggerHeading
                text="Built for heavy metal."
                delay={0.1}
                className="mt-6 max-w-4xl text-[clamp(3rem,8vw,7.5rem)] font-bold leading-[0.84] tracking-[-0.02em]"
              />
            </div>
            <div className="border-l border-primary/60 pl-5 sm:pl-6">
              <div className="flex items-center justify-between gap-4">
                <span className="label-tech text-primary">Service index</span>
                <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground">
                  01 — 06
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground/90">
                Roadside response, shop repair, trailer systems and the diagnostics that keep heavy
                equipment earning.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-2.5 border-t border-border/70 pt-4 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground sm:grid-cols-3">
                {serviceLabels.map((label, i) => (
                  <span key={label} className="flex items-center gap-2">
                    <span className="text-primary">{String(i + 1).padStart(2, "0")}</span>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="services-track mt-12 flex gap-5 pl-5 pr-5 sm:mt-16 sm:gap-6 sm:pl-8 sm:pr-8"
          style={{ x }}
        >
          {FEATURED_SERVICES.map((s, i) => (
            <motion.article
              key={s.title}
              className={cn(
                "service-card group relative flex h-[min(54vh,30rem)] w-[78vw] shrink-0 flex-col overflow-hidden border border-border/60 bg-[#171b1d] transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-black/50 sm:w-[42vw] lg:w-[28vw]",
                i === 0 && "lg:w-[34vw]",
              )}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: EASE_OUT }}
            >
              <div className="relative h-[44%] min-h-36 overflow-hidden border-b border-border/70">
                <img
                  src={serviceImages[i]}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-[#171b1d] via-[#171b1d]/10 to-black/25"
                  aria-hidden
                />
                <span className="absolute left-5 top-5 font-mono text-xs tracking-[0.18em] text-primary">
                  {String(i + 1).padStart(2, "0")} / {serviceLabels[i]}
                </span>
                <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-foreground/70 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <div className="relative flex flex-1 flex-col justify-between p-6 sm:p-7">
                <span className="pointer-events-none absolute -right-2 -top-8 font-display text-[7rem] leading-none text-white/[0.04] transition-colors group-hover:text-primary/[0.12]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative">
                  <h3 className="max-w-[13ch] text-[clamp(1.8rem,3vw,2.7rem)] font-bold leading-[0.95]">
                    {s.title}
                  </h3>
                  <p className="mt-3.5 max-w-xs text-sm leading-relaxed text-muted-foreground/90">
                    {s.detail}
                  </p>
                </div>
                <div className="relative mt-6 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground/70">
                  <span className="h-px w-10 bg-primary transition-all duration-500 group-hover:w-16" />
                  GS field service
                </div>
              </div>
              <motion.span
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />
            </motion.article>
          ))}

          <div className="relative flex h-[min(54vh,30rem)] w-[78vw] shrink-0 flex-col justify-between overflow-hidden border border-primary/50 bg-primary/[0.08] p-7 transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-black/50 sm:w-[42vw] lg:w-[30vw]">
            <span className="pointer-events-none absolute -right-7 -top-10 font-display text-[11rem] leading-none text-primary/[0.08]">
              +
            </span>
            <span className="label-tech text-primary">Complete capability</span>
            <div>
              <h3 className="max-w-[9ch] text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-[0.9]">
                Everything else, too
              </h3>
              <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground/90">
                Thirty-plus services across truck, trailer, diagnostics and maintenance.
              </p>
              <Link
                to="/services"
                className="group/cta mt-7 inline-flex items-center gap-3 bg-primary px-6 py-4 font-display tracking-wide text-primary-foreground transition-colors hover:bg-hazard"
              >
                See all services
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto mt-8 w-full max-w-7xl px-5 sm:px-8">
          <div className="services-progress h-px w-full bg-border">
            <motion.div className="h-px bg-primary" style={{ width: lineWidth }} />
          </div>
        </div>
      </div>
    </section>
  );
}
