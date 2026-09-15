import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { ContentPage } from "@/components/content-page";
import { Eyebrow, Reveal, StaggerHeading } from "@/components/motion";
import { BUSINESS, SERVICE_AREA_HIGHWAYS, SERVICE_AREAS } from "@/lib/site";

export const Route = createFileRoute("/areas")({
  head: () => ({
    meta: [
      { title: "Service Areas | GS Truck & Trailer Repair" },
      {
        name: "description",
        content:
          "Mobile truck and trailer repair across Brampton, Mississauga, Milton, Vaughan, Etobicoke and the wider GTA, plus the 401, 407 and 410.",
      },
    ],
    links: [{ rel: "canonical", href: "/areas" }],
  }),
  component: AreasPage,
});

function AreasPage() {
  return (
    <ContentPage
      eyebrow="Service areas"
      title="Wherever the route breaks down."
      intro="Our shop is in Brampton, with mobile and emergency coverage across the GTA and the 401, 407 and 410 corridors."
    >
      <section className="border-b border-border bg-background py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Eyebrow>GTA coverage</Eyebrow>
          <StaggerHeading
            text="Cities & areas we serve"
            as="h2"
            className="mt-4 max-w-3xl text-[clamp(1.8rem,4vw,3rem)] font-bold"
          />
          <Reveal delay={0.08}>
            <ul className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4">
              {SERVICE_AREAS.map((area) => (
                <li key={area} className="bg-surface p-4 sm:p-5">
                  <a
                    href={BUSINESS.mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 font-display text-base tracking-wide text-foreground transition-colors hover:text-primary sm:text-lg"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    {area}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <p className="mt-6 text-sm text-muted-foreground">
            Also running the {SERVICE_AREA_HIGHWAYS} corridors. Don't see your area listed? Call{" "}
            {BUSINESS.phoneDisplay} — we dispatch across the wider GTA too.
          </p>
        </div>
      </section>
      <section className="border-b border-border bg-surface-2 py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-muted-foreground">Need directions to the shop?</p>
          <a
            target="_blank"
            rel="noreferrer"
            href={BUSINESS.mapsHref}
            className="mt-3 inline-flex font-display text-xl text-primary hover:underline"
          >
            Open the shop location in Google Maps
          </a>
          <Link
            to="/contact"
            className="mt-6 block font-display text-sm text-muted-foreground hover:text-primary"
          >
            Request service from the contact page
          </Link>
        </div>
      </section>
    </ContentPage>
  );
}
