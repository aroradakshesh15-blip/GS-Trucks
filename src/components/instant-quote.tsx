"use client";

import { motion } from "motion/react";
import { Check, ChevronDown, Loader2, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { BUSINESS, SERVICE_CATEGORIES, whatsappHref } from "@/lib/site";
import { formatDateHuman, getUpcomingBookingDays, isSlotDisabled, TIME_SLOTS } from "@/lib/booking";
import { Eyebrow, Reveal, StaggerHeading } from "@/components/motion";
import { cn } from "@/lib/utils";

const LOCATIONS = [
  { id: "in-shop", label: "In Shop" },
  { id: "mobile", label: "Mobile / Onsite" },
  { id: "roadside", label: "Roadside Emergency" },
] as const;

type LocationId = (typeof LOCATIONS)[number]["id"];

const inputClass =
  "w-full border border-border bg-background px-3.5 py-3 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

export function InstantQuote() {
  const days = useMemo(() => getUpcomingBookingDays(5), []);

  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [location, setLocation] = useState<LocationId>("in-shop");
  const [date, setDate] = useState<string>(days[0]?.iso ?? "");
  const [time, setTime] = useState<string>("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [serviceError, setServiceError] = useState<string | undefined>();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function toggleService(service: string) {
    setServiceError(undefined);
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(service)) next.delete(service);
      else next.add(service);
      return next;
    });
  }

  const locationLabel = LOCATIONS.find((l) => l.id === location)?.label ?? "In Shop";
  const dateHuman = date ? formatDateHuman(date) : "Select a date";
  const dateShort = dateHuman.split(",")[0] ?? dateHuman;
  const serviceSummary =
    selectedServices.size === 0
      ? "Select a service"
      : selectedServices.size === 1
        ? ([...selectedServices][0] ?? "1 service selected")
        : `${selectedServices.size} services selected`;

  function buildWhatsAppMessage(): string {
    const services = [...selectedServices];
    const lines = [
      `Hello ${BUSINESS.name},`,
      "",
      "I'd like to get a quote for the following services:",
      "",
      ...services.map((s) => `• ${s}`),
      "",
      `Preferred Date: ${date ? formatDateHuman(date) : "Not selected"}`,
      `Preferred Time: ${time || "Not selected"}`,
      `Location: ${locationLabel}`,
    ];
    if (name.trim()) lines.push(`Name: ${name.trim()}`);
    if (phone.trim()) lines.push(`Phone: ${phone.trim()}`);
    if (notes.trim()) lines.push("", `Notes: ${notes.trim()}`);
    lines.push("", "Please provide me with a quote.");
    return lines.join("\n");
  }

  async function onGetQuote() {
    if (selectedServices.size === 0) {
      setServiceError("Select at least one service to continue");
      return;
    }
    setServiceError(undefined);

    setState("sending");
    try {
      const res = await fetch("/send-quote.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          notes,
          services: [...selectedServices],
          location: locationLabel,
          preferredDate: date,
          preferredTime: time,
        }),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
      setState(res.ok && data?.success ? "sent" : "error");
    } catch {
      setState("error");
    }

    window.open(whatsappHref(buildWhatsAppMessage()), "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id="get-quote"
      className="scroll-mt-24 border-t border-border bg-surface py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Eyebrow>Instant ballpark quote</Eyebrow>
        <StaggerHeading
          text="Get a quote, no price guesswork."
          as="h2"
          className="mt-5 max-w-2xl text-[clamp(2rem,4.6vw,3.6rem)] font-bold"
        />
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Pick your services, where you need us and when — we'll follow up on WhatsApp with a real
            quote, no upfront pricing needed.
          </p>
        </Reveal>

        {/* Live summary bar: SERVICE | WHERE | WHEN */}
        <Reveal delay={0.14}>
          <div className="mt-8 flex flex-wrap items-stretch gap-px overflow-hidden border border-border bg-border text-sm">
            <SummaryCell label="Service" value={serviceSummary} />
            <SummaryCell label="Where" value={locationLabel} />
            <SummaryCell label="When" value={time ? `${dateShort} · ${time}` : dateShort} />
          </div>
        </Reveal>

        {/* Service selection */}
        <div className="mt-10 space-y-4">
          {SERVICE_CATEGORIES.map((cat) => (
            <div key={cat.id} className="border border-border bg-surface-2 p-4 sm:p-5">
              <h3 className="font-display text-base tracking-wide sm:text-lg">{cat.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {cat.services.map((service) => {
                  const checked = selectedServices.has(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      aria-pressed={checked}
                      className={cn(
                        "min-h-10 border px-3.5 py-2 text-sm transition-colors",
                        checked
                          ? "border-primary bg-primary/15 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
                      )}
                    >
                      {checked && <Check className="mr-1.5 inline h-3.5 w-3.5 text-primary" />}
                      {service}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {serviceError && <p className="text-sm text-destructive">{serviceError}</p>}
        </div>

        {/* Where */}
        <div className="mt-8">
          <span className="label-tech text-muted-foreground">Where</span>
          <div
            className="mt-3 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Service location"
          >
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                role="radio"
                aria-checked={location === loc.id}
                onClick={() => setLocation(loc.id)}
                className={cn(
                  "min-h-11 border px-4 py-2.5 font-display text-sm tracking-wide transition-colors",
                  location === loc.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bay booking: date + time */}
        <div className="mt-10 border border-border bg-surface-2 p-4 sm:p-6">
          <span className="label-tech text-primary">Bay booking</span>
          <p className="mt-2 text-sm text-muted-foreground">Choose a preferred date and time.</p>

          <div
            className="mt-4 flex gap-2 overflow-x-auto pb-2"
            role="radiogroup"
            aria-label="Preferred date"
          >
            {days.map((d) => {
              const active = date === d.iso;
              return (
                <button
                  key={d.iso}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setDate(d.iso);
                    setTime("");
                  }}
                  className={cn(
                    "flex min-h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 border font-display transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50",
                  )}
                >
                  <span className="text-xs tracking-[0.1em] opacity-80">{d.weekdayShort}</span>
                  <span className="text-xl">{d.dayOfMonth}</span>
                </button>
              );
            })}
          </div>

          <div
            className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
            role="radiogroup"
            aria-label="Preferred time"
          >
            {TIME_SLOTS.map((slot) => {
              const disabled = !date || isSlotDisabled(date, slot);
              const active = time === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={disabled}
                  onClick={() => setTime(slot)}
                  className={cn(
                    "min-h-11 border px-3 py-2.5 text-sm font-medium transition-colors",
                    disabled
                      ? "cursor-not-allowed border-border/50 bg-background/40 text-muted-foreground/40 line-through"
                      : active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/50",
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional contact details */}
        <div className="mt-6 border border-border bg-surface-2">
          <button
            type="button"
            onClick={() => setDetailsOpen((v) => !v)}
            aria-expanded={detailsOpen}
            className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left font-display text-sm tracking-wide text-foreground sm:px-5"
          >
            Add your name & phone (optional, speeds things up)
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", detailsOpen && "rotate-180")}
            />
          </button>
          {detailsOpen && (
            <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2 sm:p-5">
              <label className="block">
                <span className="label-tech text-muted-foreground">Name</span>
                <input
                  className={cn(inputClass, "mt-1.5")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Singh"
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="label-tech text-muted-foreground">Phone</span>
                <input
                  type="tel"
                  className={cn(inputClass, "mt-1.5")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(416) 000-0000"
                  autoComplete="tel"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="label-tech text-muted-foreground">Notes</span>
                <textarea
                  rows={3}
                  className={cn(inputClass, "mt-1.5 resize-none")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Unit number, symptoms, anything else…"
                />
              </label>
            </div>
          )}
        </div>

        <motion.button
          type="button"
          onClick={onGetQuote}
          disabled={state === "sending"}
          whileHover={state !== "sending" ? { scale: 1.01 } : {}}
          whileTap={state !== "sending" ? { scale: 0.99 } : {}}
          className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 bg-primary px-8 py-4 font-display text-lg tracking-[0.1em] text-primary-foreground transition-colors hover:bg-hazard disabled:opacity-70 sm:w-auto"
        >
          {state === "sending" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Preparing…
            </>
          ) : (
            <>
              <MessageCircle className="h-5 w-5" />
              Get Quote on WhatsApp
            </>
          )}
        </motion.button>

        {state === "sent" && (
          <p className="mt-4 text-sm text-primary">
            Sent to the shop and opened in WhatsApp — we'll follow up shortly.
          </p>
        )}
        {state === "error" && (
          <p className="mt-4 text-sm text-destructive">
            Opened WhatsApp, but we couldn't email the shop automatically — please also call{" "}
            {BUSINESS.phoneDisplay} to be safe.
          </p>
        )}
      </div>
    </section>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[9rem] flex-1 bg-background px-4 py-3">
      <span className="label-tech text-muted-foreground">{label}</span>
      <p className="mt-1 truncate font-display text-base tracking-wide text-foreground">{value}</p>
    </div>
  );
}
