"use client";

import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, CalendarCheck, Phone, Radio, Truck } from "lucide-react";

import { BUSINESS } from "@/lib/site";
import { EASE_OUT } from "@/components/motion";
import { ProposalLanguageStrip } from "@/components/proposal-tools";

const marquee = [
  "24/7 Emergency Roadside Assistance",
  "Mobile Truck Repair",
  "Fleet Support",
  "Trailer Repair",
  "Brampton & GTA",
];

export function EmergencyStrip() {
  const reduce = useReducedMotion();

  return (
    <section className="relative border-y border-primary/25 bg-surface">
      <div className="flex overflow-hidden border-b border-border/70 py-3">
        <motion.div
          className="flex shrink-0 items-center gap-10 pr-10"
          animate={reduce ? {} : { x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {[...marquee, ...marquee, ...marquee, ...marquee].map((item, i) => (
            <span key={i} className="label-tech flex items-center gap-4 text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-border">
        <motion.div
          className="lg:pr-12"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <div className="flex items-center gap-3 text-primary">
            <Radio className="h-4 w-4" />
            <span className="label-tech">Dispatch is live</span>
          </div>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-bold">
            Broken down? We answer the phone <span className="text-forge">at 3 a.m.</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Emergency roadside assistance and mobile repair, dispatched around the clock so your
            truck spends less time parked and more time earning.
          </p>

          <motion.a
            href={BUSINESS.phoneHref}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="group relative mt-6 inline-flex items-center gap-4 overflow-hidden bg-primary px-7 py-4 text-primary-foreground"
          >
            <Phone className="h-6 w-6" />
            <span className="font-display text-2xl tracking-wide sm:text-3xl">
              {BUSINESS.phoneDisplay}
            </span>
            <motion.span
              className="absolute inset-0 -z-0 bg-hazard"
              initial={{ x: "-101%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              style={{ mixBlendMode: "multiply" }}
            />
          </motion.a>
        </motion.div>

        <motion.div
          className="lg:pl-12"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
        >
          <div className="flex items-center gap-3 text-primary">
            <CalendarCheck className="h-4 w-4" />
            <span className="label-tech">Annual inspection</span>
          </div>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-bold">
            Due for your <span className="text-forge">annual inspection?</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            CVOR-compliant safety inspections for trucks and trailers — book before the expiry
            date and avoid unplanned downtime.
          </p>

          <Link
            to="/annual-inspection"
            className="group mt-6 inline-flex items-center gap-3 border border-primary px-7 py-4 font-display text-lg tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Book Inspection
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </motion.div>
      </div>
      <ProposalLanguageStrip />
    </section>
  );
}
