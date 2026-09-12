import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentPage } from "@/components/content-page";
import { BUSINESS } from "@/lib/site";

export const Route = createFileRoute("/areas")({
  head: () => ({
    meta: [
      { title: "Service Areas | GS Truck & Trailer Repair" },
      {
        name: "description",
        content:
          "Mobile truck and trailer repair across Brampton, Mississauga, Milton, Vaughan, Etobicoke and the 401, 407 and 410.",
      },
    ],
    links: [{ rel: "canonical", href: "/areas" }],
  }),
  component: AreasPage,
});

const areas = [
  "Brampton",
  "Mississauga",
  "Milton",
  "Vaughan",
  "Etobicoke",
  "Highway 401 / 407 / 410",
];
function AreasPage() {
  return (
    <ContentPage
      eyebrow="Service areas"
      title="Wherever the route breaks down."
      intro="Our shop is in Brampton, with mobile and emergency coverage across the GTA and the 401, 407 and 410 corridors."
      cards={areas.map((area) => ({
        title: area,
        body: `Call ${BUSINESS.phoneDisplay} for mobile truck and trailer repair in ${area}.`,
        href: BUSINESS.mapsHref,
      }))}
    >
      <section className="border-b border-border bg-surface-2 py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-muted-foreground">Need directions to the shop?</p>
          <a
            target="_blank"
            rel="noreferrer"
            href={BUSINESS.mapsHref}
            className="mt-3 inline-flex font-display text-xl text-primary hover:underline"
          >
            Open Knightsbridge Road in Google Maps
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
