import { createFileRoute } from "@tanstack/react-router";

import { ContentPage } from "@/components/content-page";
import { BUSINESS } from "@/lib/site";

const title = "Terms & Conditions | GS Truck & Trailer Repair";
const description =
  "The terms and conditions governing use of the GS Truck & Trailer Repair website and requested services.";

export const Route = createFileRoute("/terms-conditions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms-conditions" },
    ],
    links: [{ rel: "canonical", href: "/terms-conditions" }],
  }),
  component: TermsConditionsPage,
});

function TermsConditionsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="Last updated September 2026. Please read these terms before using gstruckrepair.ca or requesting service."
    >
      <section className="border-b border-border bg-surface-2 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="font-display text-2xl text-foreground">1. Acceptance of terms</h2>
              <p className="mt-3">
                By using this website or submitting a service, inspection, or contact request, you
                agree to these terms and conditions.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">2. Service requests</h2>
              <p className="mt-3">
                Submitting a request through this website is a request for service, not a confirmed
                booking. All appointments, estimates and dispatch times are confirmed directly by
                our team by phone or email.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">3. Pricing and estimates</h2>
              <p className="mt-3">
                Any pricing information discussed prior to inspection is an estimate only. Final
                pricing is confirmed after our technicians assess the vehicle or trailer, and may
                change based on parts, labour and the actual condition found on inspection.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">4. Website content</h2>
              <p className="mt-3">
                Content on this website — including text, service descriptions, and images — is
                provided for general information about GS Truck & Trailer Repair and may be updated
                at any time without notice.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">5. Limitation of liability</h2>
              <p className="mt-3">
                We are not liable for delays or issues arising from information submitted
                incorrectly through this website, or for circumstances outside our reasonable
                control (such as road, weather or traffic conditions affecting roadside dispatch).
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">6. Governing law</h2>
              <p className="mt-3">
                These terms are governed by the laws of the Province of Ontario and the applicable
                federal laws of Canada.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">7. Contact us</h2>
              <p className="mt-3">
                Questions about these terms can be sent to{" "}
                <a href={BUSINESS.emailHref} className="text-primary">
                  {BUSINESS.email}
                </a>{" "}
                or {BUSINESS.phoneDisplay}. Our shop is located at {BUSINESS.address}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
