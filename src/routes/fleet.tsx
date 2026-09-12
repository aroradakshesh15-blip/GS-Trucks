import { createFileRoute } from "@tanstack/react-router";

import { Checklist, ContactHandoff, ContentPage } from "@/components/content-page";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet Services | GS Truck & Trailer Repair" },
      {
        name: "description",
        content:
          "Planned maintenance, emergency response and service visibility for Brampton and GTA fleets.",
      },
    ],
    links: [{ rel: "canonical", href: "/fleet" }],
  }),
  component: FleetPage,
});

function FleetPage() {
  return (
    <ContentPage
      eyebrow="Fleet services"
      title="One shop for every unit."
      intro="Keep your tractors, trailers and dispatch plan moving with planned maintenance, mobile response and one accountable service team."
      cards={[
        {
          title: "Planned maintenance",
          body: "Inspection-ready service programs that reduce surprises and keep your fleet on schedule.",
        },
        {
          title: "Priority response",
          body: "A direct path to mobile and emergency repair when a unit cannot wait for the next bay.",
        },
        {
          title: "Unit visibility",
          body: "Use the fleet service preview on our Services page to review the workflow we can connect to a real portal.",
        },
      ]}
    >
      <section className="border-b border-border bg-surface-2 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-3xl">Built around uptime</h2>
          <div className="mt-8 max-w-3xl">
            <Checklist
              items={[
                "Tractors, straight trucks and vocational units",
                "Trailer bodywork, brakes and electrical",
                "Scheduled inspection and routine service",
                "Mobile response across Brampton and the GTA",
              ]}
            />
          </div>
          <ContactHandoff subject="Fleet service enquiry" />
        </div>
      </section>
    </ContentPage>
  );
}
