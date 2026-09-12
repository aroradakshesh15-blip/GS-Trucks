import { createFileRoute } from "@tanstack/react-router";

import { Checklist, ContactHandoff, ContentPage } from "@/components/content-page";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers | GS Truck & Trailer Repair" },
      { name: "description", content: "Join the GS Truck & Trailer Repair team in Brampton." },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <ContentPage
      eyebrow="Careers"
      title="Bring your skills to the bay."
      intro="We are interested in experienced, dependable people who take pride in keeping heavy equipment moving."
    >
      <section className="border-b border-border bg-surface-2 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-3xl">What matters here</h2>
          <div className="mt-8 max-w-3xl">
            <Checklist
              items={[
                "Heavy-duty truck and trailer experience",
                "A safety-first approach to shop and roadside work",
                "Clear communication with drivers and fleet teams",
                "A willingness to keep learning newer systems",
              ]}
            />
          </div>
          <ContactHandoff subject="Career application" />
        </div>
      </section>
    </ContentPage>
  );
}
