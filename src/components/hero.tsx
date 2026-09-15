"use client";

import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Phone, ArrowRight, ShieldCheck, Clock, Wrench } from "lucide-react";
import { useRef } from "react";

import heroRoadside from "@/assets/hero-roadside.jpg";
import mobileRepair from "@/assets/mobile-repair.jpg";
import { BUSINESS } from "@/lib/site";
import { EASE_OUT } from "@/components/motion";

/**
 * Place the final hero background video at this path (create the
 * `videos` folder under `public/` if it doesn't exist yet):
 *   public/videos/hero-background.mp4
 * Recommended: 1920x1080, H.264 mp4, muted, <10s loop, <6MB.
 * If the file is missing, the browser simply fails to load the <video>
 * source and the static hero image underneath is shown instead — the
 * hero never breaks.
 */
const HERO_VIDEO_SRC = "/videos/hero-background.mp4";

const trust = [
  { icon: Clock, label: "Around-the-clock dispatch" },
  { icon: Wrench, label: "Truck service experts" },
  { icon: ShieldCheck, label: "Fast, friendly, reliable" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const floorOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

  return (
    <section
      ref={ref}
      className="hero-section relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-10 pt-28 lg:min-h-[min(100svh,54rem)] lg:pb-14 lg:pt-32"
    >
      {/* Layer 1 — environment plate (video, falls back to the static image) */}
      <motion.div className="absolute inset-0 -z-30" style={{ y: bgY, scale: bgScale }}>
        <motion.img
          src={heroRoadside}
          alt=""
          width={1920}
          height={1088}
          className="h-full w-full object-cover opacity-85"
          initial={reduce ? false : { opacity: 0, scale: 1.09 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        {!reduce && (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-85"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={heroRoadside}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-background/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/80" />
      </motion.div>

      {/* Layer 2 — technical grid + light shaft */}
      <div className="grid-plate absolute inset-0 -z-20 opacity-[0.14]" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-20 h-[70vh] w-[55vw] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]"
      />

      {/* Layer 3 — floor line */}
      <motion.div
        aria-hidden
        className="absolute bottom-[8%] left-0 right-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent"
        style={{ opacity: floorOpacity }}
      />

      {/* Content — a grid shares space with the decorative image instead of
         stacking it absolutely over the text, so nothing overlaps at any
         viewport height. */}
      <motion.div
        className="hero-content relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 sm:px-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
              className="inline-flex items-center gap-3 border border-primary/40 bg-background/70 px-4 py-2 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inset-0 rounded-full bg-primary"
                  animate={reduce ? {} : { scale: [1, 2.3], opacity: [0.7, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="label-tech text-foreground">{BUSINESS.tagline}</span>
            </motion.div>

            <h1 className="hero-title mt-6 max-w-4xl text-[clamp(2.85rem,8.4vw,7rem)] font-bold">
              {["Down", "on the", "road?"].map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, delay: 0.45 + i * 0.09, ease: EASE_OUT }}
                  >
                    {line === "road?" ? <span className="text-forge">{line}</span> : line}
                  </motion.span>
                </span>
              ))}
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-[0.42em] font-medium tracking-[0.06em] text-muted-foreground"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, delay: 0.78, ease: EASE_OUT }}
                >
                  We roll out 24/7 — Brampton &amp; the GTA
                </motion.span>
              </span>
            </h1>

            <motion.div
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.1, delayChildren: 0.95 }}
            >
              {[
                <a
                  key="call"
                  href={BUSINESS.phoneHref}
                  className="group inline-flex items-center justify-center gap-3 bg-primary px-7 py-4 font-display text-lg tracking-wide text-primary-foreground transition-colors hover:bg-hazard"
                >
                  <Phone className="h-5 w-5" />
                  Call {BUSINESS.phoneDisplay}
                </a>,
                <Link
                  key="req"
                  to="/contact"
                  hash="request"
                  className="group inline-flex items-center justify-center gap-3 border border-border bg-background/60 px-7 py-4 font-display text-lg tracking-wide text-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
                >
                  Request Service
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>,
              ].map((node, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.65, ease: EASE_OUT }}
                >
                  {node}
                </motion.div>
              ))}
            </motion.div>

            <motion.ul
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.08, delayChildren: 1.2 }}
            >
              {trust.map(({ icon: Icon, label }) => (
                <motion.li
                  key={label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            className="relative z-0 mt-10 hidden w-full overflow-hidden border border-white/20 bg-background/30 p-2 shadow-2xl shadow-black/40 lg:mt-0 lg:block"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 32, rotate: 1 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: EASE_OUT }}
          >
            <motion.img
              src={mobileRepair}
              alt="GS mobile repair technician servicing a truck"
              width={1280}
              height={1024}
              className="aspect-[5/4] w-full object-cover"
              initial={reduce ? false : { scale: 1.04 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="absolute bottom-5 left-5 border border-primary/60 bg-background/80 px-3 py-2 label-tech text-foreground">
              Mobile response / 24.7
            </span>
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          className="pointer-events-none mx-auto mt-8 hidden h-12 w-px sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <motion.div
            className="h-12 w-px bg-gradient-to-b from-primary to-transparent"
            animate={reduce ? {} : { scaleY: [0.35, 1, 0.35], originY: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
