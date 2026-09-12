"use client";

import { ClipboardCheck, ShieldCheck, Wrench } from "lucide-react";

import { Eyebrow, Reveal, StaggerHeading } from "@/components/motion";

const points = [
  {
    icon: ShieldCheck,
    title: "Safety first",
    body: "Catch worn brakes, lighting faults and other safety issues before they put your driver or the public at risk.",
  },
  {
    icon: Wrench,
    title: "Mechanical condition",
    body: "A close look at the engine, driveline and running gear so small problems get fixed before they become breakdowns.",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance ready",
    body: "Documentation and checks aligned with annual inspection requirements, so your paperwork stays clean.",
  },
];

export function InspectionIntro() {
  return (
    <section className="border-b border-border bg-background py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Eyebrow>Why it matters</Eyebrow>
        <StaggerHeading
          text="Complete Annual Inspection Services"
          as="h2"
          className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.6rem)] font-bold"
        />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            An annual inspection is one of the most effective ways to catch safety, mechanical and
            compliance-related issues before they turn into bigger problems on the road. Our team
            inspects trucks and trailers of every type, so you know exactly where the unit stands
            before its certificate is due.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px bg-border sm:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={0.05 * i} className="bg-surface p-7">
              <span className="flex h-11 w-11 items-center justify-center border border-primary/40 text-primary">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl tracking-wide">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
