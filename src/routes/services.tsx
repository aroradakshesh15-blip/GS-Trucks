import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Wrench } from "lucide-react";
import { useState } from "react";

import { EmergencyCta } from "@/components/emergency-cta";
import { FloatingCall } from "@/components/floating-call";
import { InstantQuote } from "@/components/instant-quote";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { EASE_OUT, Eyebrow, Reveal, StaggerHeading } from "@/components/motion";
import { ALL_SERVICES, SERVICE_CATEGORIES } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ProposalTools } from "@/components/proposal-tools";

const title = "Services — Heavy Duty Truck & Trailer Repair | GS Truck & Trailer Repair";
const description =
  "30+ services: 24/7 mobile truck repair, heavy duty repairs, trailer bodywork, computer diagnostics, engine, brakes, annual inspection and fleet maintenance in Brampton.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [open, setOpen] = useState<string | null>(SERVICE_CATEGORIES[0]?.id ?? null);

  return (
    <>
      <SiteNav />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-surface pb-20 pt-36">
          <div className="technical-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
            <Eyebrow>Full capability</Eyebrow>
            <StaggerHeading
              text="Every service we run."
              as="h1"
              className="mt-5 max-w-4xl text-[clamp(2.3rem,6.5vw,5.5rem)] font-bold leading-[0.95]"
            />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Six disciplines, thirty-plus services, one shop. Open a category to see exactly what
                we handle — or call and describe the problem and we'll point you at the right bay.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-background py-20">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="border-t border-border">
              {SERVICE_CATEGORIES.map((cat, i) => {
                const isOpen = open === cat.id;
                return (
                  <motion.div
                    key={cat.id}
                    className="border-b border-border"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: EASE_OUT }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : cat.id)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center gap-5 py-8 text-left sm:gap-10"
                    >
                      <span
                        className={cn(
                          "font-display text-2xl transition-colors sm:text-3xl",
                          isOpen ? "text-primary" : "text-border group-hover:text-primary/60",
                        )}
                      >
                        {cat.code}
                      </span>
                      <span className="flex-1">
                        <span
                          className={cn(
                            "block font-display text-[clamp(1.5rem,3.6vw,2.9rem)] leading-tight transition-colors",
                            isOpen ? "text-foreground" : "group-hover:text-primary",
                          )}
                        >
                          {cat.title}
                        </span>
                        <span className="mt-2 hidden max-w-xl text-sm text-muted-foreground sm:block">
                          {cat.blurb}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center border transition-colors",
                          isOpen
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground group-hover:border-primary group-hover:text-primary",
                        )}
                      >
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE_OUT }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-3 pb-10 sm:grid-cols-2 lg:grid-cols-3">
                            {cat.services.map((s, si) => (
                              <motion.div
                                key={s}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: 0.06 + si * 0.045 }}
                                className="group flex items-center gap-4 border border-border bg-surface p-5 transition-colors hover:bg-surface-2"
                              >
                                <Wrench className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:rotate-45" />
                                <span className="text-sm tracking-wide">{s}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <Reveal className="mt-20">
              <h2 className="font-display text-2xl tracking-wide">Complete service index</h2>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {ALL_SERVICES.map((s) => (
                  <span
                    key={s}
                    className="flex items-center justify-center border border-border px-4 py-2 text-center text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <InstantQuote />
        <ProposalTools />

        <EmergencyCta />
      </main>
      <SiteFooter />
      <FloatingCall />
    </>
  );
}
