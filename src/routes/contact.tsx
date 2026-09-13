import { createFileRoute } from "@tanstack/react-router";

import { EmergencyCta } from "@/components/emergency-cta";
import { FloatingCall } from "@/components/floating-call";
import { RequestForm } from "@/components/request-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteMap } from "@/components/site-map";
import { SiteNav } from "@/components/site-nav";
import { Eyebrow, Reveal, StaggerHeading } from "@/components/motion";
import { BUSINESS } from "@/lib/site";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

const title = "About & Contact — GS Truck & Trailer Repair, Mississauga";
const description =
  "Talk to the GS Truck & Trailer Repair team in Mississauga, ON. Call +1 (416) 918-2630, email info@gstruckrepair.ca or request service online.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const details = [
  { icon: Phone, label: "Call", value: BUSINESS.phoneDisplay, href: BUSINESS.phoneHref },
  { icon: Mail, label: "Email", value: BUSINESS.email, href: BUSINESS.emailHref },
  { icon: Clock, label: "Hours", value: "24/7 emergency dispatch" },
];

function ContactPage() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-surface pb-20 pt-36">
          <div className="technical-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
            <Eyebrow>About / Contact</Eyebrow>
            <StaggerHeading
              text="Passion for heavy machines."
              as="h1"
              className="mt-5 max-w-4xl text-[clamp(2.3rem,6.5vw,5.5rem)] font-bold leading-[0.95]"
            />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {BUSINESS.promise} Every truck is a different canvas for the passion we have for
                repairing and restoring heavy equipment. Our technicians are experienced, trained
                and equipped — and we work to keep your downtime as short as possible.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-px bg-border sm:grid-cols-3">
              {details.map((d) => {
                const inner = (
                  <>
                    <d.icon className="h-6 w-6 text-primary" />
                    <span className="label-tech mt-5 block text-muted-foreground">{d.label}</span>
                    <span className="mt-2 block font-display text-xl leading-snug">{d.value}</span>
                  </>
                );
                return (
                  <div
                    key={d.label}
                    className="bg-surface-2 p-7 transition-colors hover:bg-surface"
                  >
                    {d.href ? (
                      <a href={d.href} className="block">
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </div>
                );
              })}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-8 border border-border bg-surface-2 p-2">
                <SiteMap className="h-80 w-full sm:h-96" />
                <a
                  href={BUSINESS.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex items-center gap-2 p-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  {BUSINESS.address} — Get directions
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <RequestForm />
        <EmergencyCta />
      </main>
      <SiteFooter />
      <FloatingCall />
    </>
  );
}
