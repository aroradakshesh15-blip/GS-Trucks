import { createFileRoute } from "@tanstack/react-router";

import { Checklist, ContactHandoff, ContentPage } from "@/components/content-page";

const title = "Annual Inspection | GS Truck & Trailer Repair";
const description =
  "CVOR-compliant annual safety inspections for trucks and trailers in Brampton and the GTA. Book before your expiry date and avoid downtime.";

export const Route = createFileRoute("/annual-inspection")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/annual-inspection" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/annual-inspection" }],
  }),
  component: AnnualInspectionPage,
});

function AnnualInspectionPage() {
  return (
    <ContentPage
      eyebrow="Maintenance & Inspection"
      title="Annual inspection, done right the first time."
      intro="A full CVOR-compliant annual safety inspection for trucks and trailers, performed by technicians who know exactly what the inspection sheet is looking for. Book ahead of your expiry date and keep the unit on the road."
    >
      <section className="border-b border-border bg-surface-2 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-3xl">What's covered</h2>
          <div className="mt-8 max-w-3xl">
            <Checklist
              items={[
                "Brakes, air system and brake chambers",
                "Steering, suspension and driveline components",
                "Frame, coupling devices and structural integrity",
                "Lighting, reflectors and electrical system",
                "Tires, wheels and rims",
                "Exhaust system and emissions compliance",
                "Windshield, mirrors and glazing",
                "Full CVOR-compliant inspection report",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-3xl">Why book ahead of expiry</h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            An expired safety certificate takes a unit off the road immediately. Booking your
            annual inspection before the expiry date lets us fix any flagged items on the same
            visit, instead of scrambling for a slot once the unit is already out of service.
          </p>
          <ContactHandoff subject="Annual inspection booking" />
        </div>
      </section>
    </ContentPage>
  );
}
