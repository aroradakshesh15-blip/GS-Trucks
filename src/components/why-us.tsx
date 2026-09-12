"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { GraduationCap, Timer, ThumbsUp, Wrench } from "lucide-react";
import { useRef } from "react";

import mechanic from "@/assets/work-diagnostics.jpg";
import { Counter, EASE_OUT, Eyebrow, Reveal, StaggerHeading } from "@/components/motion";

const pillars = [
  {
    icon: Timer,
    title: "Less downtime",
    body: "We strive to lessen the amount of time our customers spend off the road.",
  },
  {
    icon: Wrench,
    title: "Truck service experts",
    body: "Professionals with extensive experience, training and the right equipment.",
  },
  {
    icon: ThumbsUp,
    title: "Fast, friendly, reliable",
    body: "Straight answers, honest timelines and service you can plan around.",
  },
  {
    icon: GraduationCap,
    title: "We keep learning",
    body: "Constant training and skill upgrades on the newest truck systems.",
  },
];

const stats = [
  { to: 24, suffix: "/7", label: "Emergency dispatch" },
  { to: 30, suffix: "+", label: "Services offered" },
  { to: 100, suffix: "%", label: "Focused on satisfaction" },
];

export function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-border bg-surface py-16 sm:py-20"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Why choose GS</Eyebrow>
          <StaggerHeading
            text="Look good, feel good, drive good."
            className="mt-5 text-[clamp(2rem,5vw,4rem)] font-bold"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Every truck is a different canvas for the passion we have for repairing and restoring
              heavy equipment. Our people are experienced, trained and genuinely into this work —
              and we always strive to please our customers.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-px bg-border sm:grid-cols-2">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                className="group bg-surface p-6 transition-colors hover:bg-surface-2"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE_OUT }}
              >
                <p.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:-translate-y-1" />
                <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative">
          <motion.div
            className="relative overflow-hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            <motion.img
              src={mechanic}
              alt="GS technician performing heavy-duty engine repair"
              loading="lazy"
              width={1408}
              height={1008}
              className="h-[min(32rem,52vh)] w-full scale-110 object-cover"
              style={{ y: imgY }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </motion.div>

          <div className="mt-px grid grid-cols-3 gap-px bg-border">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface-2 p-5 text-center">
                <div className="font-display text-4xl text-primary">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
