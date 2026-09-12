import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { BUSINESS, SERVICE_CATEGORIES } from "@/lib/site";
import { Reveal } from "@/components/motion";
import logo from "@/assets/gs-truck-logo.svg";

const exploreLinks = [
  ["/fleet", "Fleet services"],
  ["/work", "Our work"],
  ["/areas", "Service areas"],
  ["/reviews", "Reviews"],
  ["/resources", "Resources"],
  ["/careers", "Careers"],
] as const;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div className="grid-plate absolute inset-0 opacity-[0.12]" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="hazard-stripes h-12 w-1.5" />
            <span className="site-logo-frame relative block h-14 w-56 overflow-hidden">
              <svg
                viewBox="0 0 810 250"
                className="h-full w-full"
                role="img"
                aria-label="GS Truck & Trailer Repair"
              >
                <image
                  href={logo}
                  x="0"
                  y="-280"
                  width="810"
                  height="810"
                  preserveAspectRatio="none"
                />
              </svg>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {BUSINESS.promise}
          </p>
          <p className="mt-4 label-tech text-primary">{BUSINESS.tagline}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <h3 className="font-display text-lg">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={BUSINESS.phoneHref}
                className="flex items-start gap-3 text-foreground transition-colors hover:text-primary"
              >
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={BUSINESS.emailHref}
                className="flex items-start gap-3 text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                {BUSINESS.email}
              </a>
            </li>
            <li>
              <a
                href={BUSINESS.mapsHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 text-muted-foreground transition-colors hover:text-primary"
              >
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                {BUSINESS.address}
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.18}>
          <h3 className="font-display text-lg">Services</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {SERVICE_CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to="/services" hash={c.id} className="transition-colors hover:text-primary">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.24}>
          <h3 className="font-display text-lg">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {exploreLinks.map(([to, label]) => {
              return (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      <div className="relative border-t border-border px-5 py-4 sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </span>
          <span>Brampton, Ontario · Serving the GTA</span>
        </div>
      </div>
    </footer>
  );
}
