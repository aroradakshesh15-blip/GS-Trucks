import { createFileRoute } from "@tanstack/react-router";

import { ContentPage } from "@/components/content-page";
import { BUSINESS } from "@/lib/site";

const title = "Privacy Policy | GS Truck & Trailer Repair";
const description =
  "How GS Truck & Trailer Repair collects, uses and protects information submitted through our website.";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="Last updated September 2026. This policy explains what information we collect through gstruckrepair.ca and how we use it."
    >
      <section className="border-b border-border bg-surface-2 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="font-display text-2xl text-foreground">1. Information we collect</h2>
              <p className="mt-3">
                When you submit a service request, contact form or inspection request on this site,
                we collect the details you provide — such as your name, phone number, email address,
                vehicle or fleet information, and the message or service details you enter. We do
                not collect payment information through this website.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">
                2. How we use your information
              </h2>
              <p className="mt-3">
                We use the information you submit to respond to your request, schedule service or
                inspections, contact you about your vehicle or fleet, and improve our customer
                service. We do not sell your personal information to third parties.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">3. Sharing of information</h2>
              <p className="mt-3">
                We only share information with service providers who help us operate this website
                and respond to service requests (for example, email delivery), and where required by
                law.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">4. Data retention</h2>
              <p className="mt-3">
                We retain service request and inspection records for as long as reasonably necessary
                for business, warranty and legal record-keeping purposes.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">5. Your choices</h2>
              <p className="mt-3">
                You can contact us at any time to ask what information we hold about you, to correct
                it, or to request that we delete it, subject to any legal or record-keeping
                requirements we must follow.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">6. Cookies</h2>
              <p className="mt-3">
                This site may use basic cookies or similar technologies required for the website to
                function correctly. We do not use these to build advertising profiles.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground">7. Contact us</h2>
              <p className="mt-3">
                Questions about this policy can be sent to{" "}
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
