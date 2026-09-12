import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { EmergencyCta } from "@/components/emergency-cta";
import { FloatingCall } from "@/components/floating-call";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Eyebrow, Reveal, StaggerHeading } from "@/components/motion";
import { BUSINESS } from "@/lib/site";

export type ContentCard = { title: string; body: string; href?: string };

export function ContentPage({
  eyebrow,
  title,
  intro,
  cards,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  cards?: ContentCard[];
  children?: React.ReactNode;
}) {
  return (
    <>
      <SiteNav />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-surface pb-14 pt-28 sm:pb-16 sm:pt-32">
          <div className="technical-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
            <Eyebrow>{eyebrow}</Eyebrow>
            <StaggerHeading
              text={title}
              as="h1"
              className="mt-5 max-w-5xl text-[clamp(2.3rem,6.5vw,5.5rem)] font-bold leading-[0.95]"
            />
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {intro}
              </p>
            </Reveal>
          </div>
        </section>
        {cards && (
          <section className="border-b border-border bg-background py-14 sm:py-16">
            <div className="mx-auto grid w-full max-w-7xl gap-px bg-border px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <article
                  key={card.title}
                  className="bg-surface p-7 transition-colors hover:bg-surface-2"
                >
                  <h2 className="font-display text-2xl tracking-wide">{card.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  {card.href && (
                    <Link
                      to={card.href}
                      className="mt-6 inline-flex items-center gap-2 font-display text-sm tracking-wide text-primary"
                    >
                      Explore <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
        {children}
        <EmergencyCta />
      </main>
      <SiteFooter />
      <FloatingCall />
    </>
  );
}

export function ContactHandoff({ subject = "Website enquiry" }: { subject?: string }) {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <a
        href={BUSINESS.phoneHref}
        className="inline-flex min-h-12 items-center justify-center bg-primary px-6 py-3 font-display tracking-wide text-primary-foreground hover:bg-hazard"
      >
        Call {BUSINESS.phoneDisplay}
      </a>
      <a
        href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}`}
        className="inline-flex min-h-12 items-center justify-center border border-border px-6 py-3 font-display tracking-wide hover:border-primary hover:text-primary"
      >
        Email the shop
      </a>
    </div>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}
