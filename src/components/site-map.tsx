import { BUSINESS } from "@/lib/site";

export function SiteMap({ className }: { className?: string }) {
  return (
    <div className={className}>
      <iframe
        title={`${BUSINESS.name} location map`}
        src={BUSINESS.mapsEmbedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
        allowFullScreen
      />
    </div>
  );
}
