"use client";

import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarCheck } from "lucide-react";

import { Reveal } from "@/components/motion";

export function AnnualInspectionStrip() {
  return (
    <section className="border-y border-border bg-surface">
      <Reveal>
        <Link
          to="/annual-inspection"
          className="group mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 px-5 py-5 sm:px-8"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/40 text-primary">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg tracking-wide sm:text-xl">
              Annual inspection due soon?
            </span>
            <span className="block text-sm text-muted-foreground">
              CVOR-compliant safety inspections for trucks and trailers — book before the expiry
              date.
            </span>
          </span>
          <span className="flex items-center gap-2 font-display text-sm tracking-wide text-primary transition-transform group-hover:translate-x-1">
            Book inspection
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
