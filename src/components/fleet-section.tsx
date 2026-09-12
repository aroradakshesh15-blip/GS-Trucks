"use client";

import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight, Container, Truck, Wrench, Radio } from "lucide-react";

import { EASE_OUT, Eyebrow, Reveal, StaggerHeading } from "@/components/motion";
import fleetImage from "@/assets/fleet.jpg";

const capabilities = [
  {
    icon: Truck,
    title: "Heavy-duty trucks",
    body: "Tractors, straight trucks and vocational units — engine, driveline and body work.",
  },
  {
    icon: Container,
    title: "Trailer repair",
    body: "Box rollup, barn doors, panels, brakes and electrical on any trailer type.",
  },
  {
    icon: Wrench,
    title: "Fleet maintenance",
    body: "Planned service programmes that keep whole fleets inspection-ready.",
  },
  {
    icon: Radio,
    title: "Mobile & emergency",
    body: "24/7 mobile units for roadside, yard and terminal breakdowns.",
  },
];

export function FleetSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-surface-2 py-20 sm:py-24">
      <div className="hazard-stripes absolute inset-x-0 top-0 h-1.5" aria-hidden />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal className="relative overflow-hidden border border-border bg-background" y={34}>
            <motion.img
              src={fleetImage}
              alt="Heavy-duty fleet trucks supported by GS Truck & Trailer Repair"
              loading="lazy"
              className="h-[18rem] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[24rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
            <span className="label-tech absolute bottom-5 left-5 text-foreground">
              Fleet support / GTA
            </span>
          </Reveal>
          <div>
            <Eyebrow>Fleet & heavy duty</Eyebrow>
            <StaggerHeading
              text="Whole fleets. One shop."
              className="mt-5 text-[clamp(2.2rem,5vw,4.7rem)] font-bold"
            />
            <Reveal delay={0.08}>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                From a single owner-operator to a yard full of units, we cover the full heavy-duty
                spectrum: shop repairs, trailer bodywork, scheduled fleet maintenance and
                around-the- clock mobile response across Brampton and the GTA.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-10 grid gap-px bg-border lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <motion.article
              key={c.title}
              className="group relative overflow-hidden bg-surface p-6 sm:p-7"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.75, delay: i * 0.1, ease: EASE_OUT }}
            >
              <motion.span
                className="absolute inset-0 bg-primary/8"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                aria-hidden
              />
              <div className="relative">
                <span className="label-tech text-primary">{String(i + 1).padStart(2, "0")}</span>
                <c.icon className="mt-4 h-8 w-8 text-foreground transition-colors group-hover:text-primary" />
                <h3 className="mt-5 font-display text-2xl tracking-wide">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <Link
            to="/services"
            className="group inline-flex items-center gap-4 border border-border px-6 py-4 font-display tracking-[0.12em] transition-colors hover:border-primary hover:text-primary"
          >
            Explore all 30+ services
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
