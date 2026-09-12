"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Scroll-triggered reveal with directional offset. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: "-12% 0px -10% 0px" }}
      transition={{ duration: 0.85, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.5em", rotateX: -55 },
  show: { opacity: 1, y: 0, rotateX: 0 },
};

/** Word-by-word staggered headline. */
export function StaggerHeading({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[Tag] as typeof motion.div;

  return (
    <MotionTag
      className={cn("flex flex-wrap", className)}
      style={{ perspective: 800 }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ staggerChildren: reduce ? 0 : stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.06em] pr-[0.28em]">
          <motion.span
            className="inline-block"
            variants={reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : wordVariants}
            transition={{ duration: 0.75, ease: EASE_OUT }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Count-up statistic driven by a spring, triggered in view. */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotion();
  const value = useMotionValue(0);
  const spring = useSpring(value, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) value.set(to);
  }, [inView, to, value]);

  useEffect(() => {
    if (reduce) {
      setDisplay(to.toFixed(decimals));
      return;
    }
    const unsub = spring.on("change", (v) => setDisplay(v.toFixed(decimals)));
    return () => unsub();
  }, [spring, decimals, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/** Section eyebrow label with an animated rule. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <motion.span
        className="block h-px bg-primary"
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      />
      <span className="label-tech text-primary">{children}</span>
    </div>
  );
}
