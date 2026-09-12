import { createFileRoute } from "@tanstack/react-router";

import { EmergencyCta } from "@/components/emergency-cta";
import { FloatingCall } from "@/components/floating-call";
import { InspectionForm } from "@/components/inspection-form";
import { InspectionHero } from "@/components/inspection-hero";
import { InspectionIntro } from "@/components/inspection-intro";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

const title = "Annual Truck Inspection | GS Trucks";
const description =
  "Professional annual truck and trailer inspection services to help keep your commercial vehicles safe, compliant, and road-ready.";

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
    <>
      <SiteNav />
      <main>
        <InspectionHero />
        <InspectionIntro />
        <InspectionForm />
        <EmergencyCta />
      </main>
      <SiteFooter />
      <FloatingCall />
    </>
  );
}
