import { createFileRoute } from "@tanstack/react-router";

import { ContentPage, ContactHandoff } from "@/components/content-page";
import { BUSINESS } from "@/lib/site";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews | GS Truck & Trailer Repair" },
      {
        name: "description",
        content: "Read and share feedback about GS Truck & Trailer Repair in Brampton.",
      },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <ContentPage
      eyebrow="Reviews"
      title="Trust is part of the repair."
      intro="We are building this page around verified customer feedback rather than invented testimonials. Open our Google listing to read current reviews or share your experience with the team."
    >
      <section className="border-b border-border bg-surface-2 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl border border-border bg-surface p-8">
            <p className="label-tech text-primary">Verified source</p>
            <h2 className="mt-4 font-display text-3xl">Google Business Profile</h2>
            <p className="mt-4 text-muted-foreground">
              Reviews and responses stay on the platform customers already use, so the feedback
              remains current and verifiable.
            </p>
            <a
              href={BUSINESS.mapsHref}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex min-h-12 items-center justify-center bg-primary px-6 py-3 font-display text-primary-foreground hover:bg-hazard"
            >
              Open Google listing
            </a>
            <ContactHandoff subject="Review feedback" />
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
