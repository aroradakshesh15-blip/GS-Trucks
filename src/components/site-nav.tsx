"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

import { BUSINESS } from "@/lib/site";
import logo from "@/assets/gs-truck-logo.svg";
import { EASE_OUT } from "@/components/motion";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/fleet", label: "Fleet" },
  { to: "/work", label: "Our work" },
  { to: "/areas", label: "Service areas" },
  { to: "/annual-inspection", label: "Annual Inspection" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className={cn(
          "site-header fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-border bg-background/88 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-2.5 sm:px-8 sm:py-3">
          <Link
            to="/"
            className="group flex items-center gap-3"
            aria-label="GS Truck and Trailer Repair home"
          >
            <motion.span
              className="site-logo-frame relative block h-14 w-56 shrink-0 overflow-hidden sm:h-16 sm:w-64"
              initial={reduce ? false : { opacity: 0, x: -10, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: scrolled ? 0.93 : 1 }}
              whileHover={reduce ? undefined : { y: -1, scale: scrolled ? 0.945 : 1.012 }}
              transition={{ duration: 0.65, ease: EASE_OUT }}
            >
              <svg
                viewBox="0 0 810 250"
                className="h-full w-full"
                role="img"
                aria-label="GS Truck & Trailer Repair"
              >
                <image
                  href={logo}
                  x="0"
                  y="-280"
                  width="810"
                  height="810"
                  preserveAspectRatio="none"
                />
              </svg>
            </motion.span>
          </Link>

          <nav className="hidden items-center gap-5 xl:gap-7 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group relative font-display text-sm font-semibold tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px bg-primary transition-all duration-300 group-hover:w-full",
                    pathname === l.to ? "w-full" : "w-0",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={BUSINESS.phoneHref}
              className="hidden items-center gap-2 bg-primary px-5 py-3 font-display text-sm tracking-[0.1em] text-primary-foreground transition-colors hover:bg-hazard lg:flex"
            >
              <Phone className="h-4 w-4" />
              {BUSINESS.phoneDisplay}
            </a>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="min-h-12 min-w-12 border border-border bg-surface/60 p-3 text-foreground transition-colors hover:border-primary hover:text-primary lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background/97 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, clipPath: "circle(0% at 90% 6%)" }}
            animate={{ opacity: 1, clipPath: "circle(140% at 90% 6%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 90% 6%)" }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="label-tech text-primary">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="min-h-12 min-w-12 border border-border p-3"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-5">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: EASE_OUT }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border py-5 font-display text-[clamp(2.25rem,10vw,3.5rem)]"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-5 pb-10">
              <a
                href={BUSINESS.phoneHref}
                className="flex items-center justify-center gap-3 bg-primary px-6 py-5 font-display text-xl text-primary-foreground"
              >
                <Phone className="h-5 w-5" />
                {BUSINESS.phoneDisplay}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
