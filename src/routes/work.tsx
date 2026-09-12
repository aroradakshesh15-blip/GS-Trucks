import { createFileRoute } from "@tanstack/react-router";

import { ContentPage } from "@/components/content-page";
import { BUSINESS } from "@/lib/site";
import workshop from "@/assets/workshop.jpg";
import workBrakes from "@/assets/work-brakes.jpg";
import workDiagnostics from "@/assets/work-diagnostics.jpg";
import workTrailer from "@/assets/work-trailer.jpg";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Our Work | GS Truck & Trailer Repair" },
      {
        name: "description",
        content:
          "See the shop, trailer, brake and diagnostic work behind GS Truck & Trailer Repair.",
      },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkPage,
});

const photos = [
  { src: workshop, title: "Shop capability", alt: "GS truck repair workshop" },
  { src: workTrailer, title: "Trailer repair", alt: "Trailer repair work" },
  { src: workBrakes, title: "Brake service", alt: "Heavy-duty brake service" },
  { src: workDiagnostics, title: "Diagnostics", alt: "Truck diagnostics work" },
];

function WorkPage() {
  return (
    <ContentPage
      eyebrow="Our work"
      title="The work should speak for itself."
      intro="A practical look at the bays, repairs and diagnostic work that keep heavy equipment earning."
    >
      <section className="border-b border-border bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-8 sm:grid-cols-2">
          <div className="sm:col-span-2 grid gap-5 sm:grid-cols-2">
            {photos.map((photo) => (
              <figure
                key={photo.title}
                className="group relative overflow-hidden border border-border bg-surface"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background p-5 pt-12 font-display text-xl">
                  {photo.title}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Want to add a job to the gallery? Email the team with the unit and repair details.
          </p>
          <a
            href={`mailto:${BUSINESS.email}?subject=Job%20photo%20submission`}
            className="font-display text-primary hover:underline"
          >
            Share a completed job
          </a>
        </div>
      </section>
    </ContentPage>
  );
}
