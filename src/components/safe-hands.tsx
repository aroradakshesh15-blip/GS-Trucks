"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MessagesSquare, Gauge, CalendarCheck, HeartHandshake } from "lucide-react";

import fleet from "@/assets/workshop.jpg";
import { EASE_OUT, Eyebrow, Reveal, StaggerHeading } from "@/components/motion";

const points = [
  {
    icon: MessagesSquare,
    title: "You stay informed",
    body: "We communicate through the repair so you always know where your unit stands.",
  },
  {
    icon: Gauge,
    title: "Performance first",
    body: "Repairs done properly so the truck leaves running the way it should.",
  },
  {
    icon: CalendarCheck,
    title: "On time",
    body: "We get the job done on schedule and keep your dispatch plan intact.",
  },
  {
    icon: HeartHandshake,
    title: "Customer satisfaction",
    body: "An experienced team that genuinely wants you happy with the outcome.",
  },
];

export function SafeHands() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const overlay = useTransform(scrollYProgress, [0, 0.5, 1], [0.72, 0.46, 0.72]);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border">
      <motion.img
        src={fleet}
        alt="Heavy-duty trucks lined up at the GS service yard"
        loading="lazy"
        className="absolute inset-0 h-[120%] w-full scale-110 object-cover"
        style={{ y }}
      />
      <motion.div
        className="absolute inset-0 bg-background"
        style={{ opacity: overlay }}
        aria-hidden
      />
      <div className="technical-grid absolute inset-0 opacity-20" aria-hidden />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <Eyebrow>Our promise</Eyebrow>
        <StaggerHeading
          text="Your truck is in safe hands."
          as="h2"
          className="mt-5 max-w-4xl text-[clamp(2.2rem,6vw,5rem)] font-bold leading-[0.95]"
        />
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Our experienced team handles every repair with care and keeps you in the loop from
            diagnosis to hand-back. Reliability, performance and getting the job done on time — that
            is what we promise on every unit that rolls through the door.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-px bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              className="group relative bg-background/70 p-5 backdrop-blur-sm transition-colors hover:bg-surface/80 sm:p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.09, ease: EASE_OUT }}
            >
              <p.icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:-translate-y-1" />
              <h3 className="mt-5 font-display text-xl tracking-wide">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
