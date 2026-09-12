import { createFileRoute } from "@tanstack/react-router";

import { AnnualInspectionStrip } from "@/components/annual-inspection-strip";
import { EmergencyCta } from "@/components/emergency-cta";
import { EmergencyStrip } from "@/components/emergency-strip";
import { FleetSection } from "@/components/fleet-section";
import { FloatingCall } from "@/components/floating-call";
import { Hero } from "@/components/hero";
import { RequestForm } from "@/components/request-form";
import { SafeHands } from "@/components/safe-hands";
import { ServicesRail } from "@/components/services-rail";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { WhyUs } from "@/components/why-us";
import { BUSINESS } from "@/lib/site";

const title = "GS Truck & Trailer Repair — 24/7 Heavy Duty Truck Repair in Brampton";
const description =
  "24/7 emergency roadside assistance, heavy duty truck and trailer repair, diagnostics and fleet maintenance in Brampton, ON. Call +1 (416) 918-2630.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoRepair",
          name: BUSINESS.name,
          telephone: BUSINESS.phoneDisplay,
          email: BUSINESS.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: "18 Knightsbridge Rd",
            addressLocality: "Brampton",
            addressRegion: "ON",
            postalCode: "L6T 3X5",
            addressCountry: "CA",
          },
          openingHours: "Mo-Su 00:00-23:59",
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <h1 className="sr-only">
          GS Truck &amp; Trailer Repair — 24/7 heavy duty truck and trailer repair in Brampton
        </h1>
        <Hero />
        <AnnualInspectionStrip />
        <EmergencyStrip />
        <ServicesRail />
        <WhyUs />
        <SafeHands />
        <FleetSection />
        <EmergencyCta />
        <RequestForm />
      </main>
      <SiteFooter />
      <FloatingCall />
    </>
  );
}
