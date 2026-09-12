import { createFileRoute } from "@tanstack/react-router";

import { ContentPage } from "@/components/content-page";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources | GS Truck & Trailer Repair" },
      {
        name: "description",
        content:
          "Practical truck inspection, winter preparation and fleet maintenance resources from GS Truck & Trailer Repair.",
      },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: ResourcesPage,
});

const resources = [
  {
    title: "Annual inspection checklist",
    body: "Prepare the unit, catch common issues early and book before the expiry date.",
  },
  {
    title: "Winter readiness",
    body: "A practical pre-season list for batteries, air systems, cooling and tires.",
  },
  {
    title: "CVOR and uptime planning",
    body: "Keep inspection dates, service history and dispatch commitments visible.",
  },
  {
    title: "Roadside first steps",
    body: "Move to safety, share your location and give dispatch the unit symptoms.",
  },
];
function ResourcesPage() {
  return (
    <ContentPage
      eyebrow="Resources"
      title="Practical knowledge for the road."
      intro="Useful guidance for owner-operators, dispatchers and fleet managers. More articles can be added here without changing the site structure."
      cards={resources}
    />
  );
}
