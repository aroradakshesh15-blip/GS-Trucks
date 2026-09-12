"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Phone } from "lucide-react";
import { useRef } from "react";

import { BUSINESS } from "@/lib/site";
import { EASE_OUT, StaggerHeading } from "@/components/motion";
import mobileRepair from "@/assets/mobile-repair.jpg";

export function EmergencyCta() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const stripeX = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-border bg-background py-20 sm:py-24"
    >
      <motion.img
        src={mobileRepair}
        alt="Technician providing mobile truck repair"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        style={{ x: stripeX }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70"
        aria-hidden
      />
      <motion.div
        className="hazard-stripes absolute inset-x-[-20%] top-10 h-24 opacity-[0.12]"
        style={{ x: stripeX }}
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 text-center sm:px-8">
        <StaggerHeading
          text="Truck trouble? We're ready 24/7."
          as="h2"
          stagger={0.07}
          className="justify-center text-[clamp(2.4rem,9vw,7.5rem)] font-bold uppercase leading-[0.88] tracking-tight"
        />

        <motion.a
          href={BUSINESS.phoneHref}
          className="mt-8 inline-flex items-center gap-4 bg-primary px-8 py-4 font-display text-2xl tracking-[0.06em] text-primary-foreground sm:text-3xl"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <motion.span
            animate={reduce ? { rotate: 0 } : { rotate: [0, -12, 12, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.4 }}
            className="inline-flex"
          >
            <Phone className="h-7 w-7" />
          </motion.span>
          {BUSINESS.phoneDisplay}
        </motion.a>

        <motion.p
          className="mt-5 text-sm uppercase tracking-[0.35em] text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {BUSINESS.tagline}
        </motion.p>
      </div>
    </section>
  );
}
