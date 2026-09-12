"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  LocateFixed,
  MessageCircle,
  Navigation,
  Send,
  Truck,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";

import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";

const quoteServices = [
  ["Brakes & air system", 450],
  ["Annual safety inspection", 180],
  ["Electrical / computer diagnostics", 320],
  ["Engine repair", 1400],
  ["Tires & wheels", 260],
  ["Trailer bodywork", 700],
] as const;

const fleetUnits = [
  {
    id: "UNIT 4471",
    vehicle: "Freightliner Cascadia 2019",
    status: "In service",
    details: [
      "Brake chamber replacement - 12 Aug 2026 - $842",
      "Annual safety inspection - passed",
      "Next inspection due: 03 Mar 2027",
    ],
  },
  {
    id: "UNIT 2208",
    vehicle: "Volvo VNL 760 2021",
    status: "In bay 2",
    details: [
      "Currently in shop: transmission diagnostics",
      "Estimated release: pending diagnosis",
      "Last service - 19 Jun 2026 - $1,310",
    ],
  },
  {
    id: "UNIT 1936",
    vehicle: "Kenworth T680 2018",
    status: "Inspection due",
    details: [
      "Annual safety inspection expires soon",
      "DPF cleaning - 22 Jul 2026 - $610",
      "Book the next open bay below",
    ],
  },
];

const slots = [
  "7:00 AM",
  "8:30 AM",
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
  "5:30 PM",
];

function ToolShell({
  title,
  detail,
  icon: Icon,
  children,
}: {
  title: string;
  detail: string;
  icon: typeof Truck;
  children: React.ReactNode;
}) {
  return (
    <article className="border border-border bg-surface p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/40 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-2xl tracking-wide">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </article>
  );
}

function Readout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 border border-primary/30 bg-primary/10 p-4 text-sm">
      <span className="label-tech text-primary">{title}</span>
      <div className="mt-2 leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export function ProposalTools() {
  return (
    <section className="border-t border-border bg-surface-2 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p className="label-tech text-primary">Driver tools</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4.5rem)] font-bold">
          Less waiting. More certainty.
        </h2>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Useful tools for the moments before and after a repair. Estimates are ballpark only; the
          shop confirms scope and pricing before work begins.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <LocationTool />
          <QuoteTool />
          <InspectionTool />
          <BookingTool />
          <FleetTool />
          <LanguageTool />
        </div>
      </div>
    </section>
  );
}

function LocationTool() {
  const [status, setStatus] = useState<"idle" | "locating" | "ready">("idle");
  const [message, setMessage] = useState("");
  function locate() {
    setStatus("locating");
    const fallback = () => {
      const text = `Breakdown near Brampton. Please call me at ${BUSINESS.phoneDisplay}.`;
      setMessage(text);
      setStatus("ready");
    };
    if (!navigator.geolocation) return fallback();
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const text = `Breakdown location: https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
        setMessage(text);
        setStatus("ready");
      },
      fallback,
      { enableHighAccuracy: true, timeout: 6000 },
    );
  }
  return (
    <ToolShell
      title="Share my location"
      detail="Send a map pin to dispatch when typing an address is not practical."
      icon={LocateFixed}
    >
      <button
        type="button"
        onClick={locate}
        disabled={status === "locating"}
        className="flex min-h-12 w-full items-center justify-center gap-3 bg-primary px-5 py-3 font-display tracking-wide text-primary-foreground transition-colors hover:bg-hazard disabled:opacity-60"
      >
        <Navigation className="h-4 w-4" />
        {status === "locating" ? "Getting position..." : "Get my location"}
      </button>
      {status === "ready" && (
        <Readout title="Ready to send">
          <span className="break-words">{message}</span>
          <a
            className="mt-3 inline-flex items-center gap-2 text-foreground underline decoration-primary underline-offset-4"
            href={`mailto:${BUSINESS.email}?subject=Roadside%20location&body=${encodeURIComponent(message)}`}
          >
            <Send className="h-4 w-4" />
            Email dispatch details
          </a>
        </Readout>
      )}
    </ToolShell>
  );
}

function QuoteTool() {
  const [service, setService] = useState(450);
  const [where, setWhere] = useState(1);
  const [urgency, setUrgency] = useState(1);
  const [shown, setShown] = useState(false);
  const midpoint = service * where * urgency;
  const low = Math.round((midpoint * 0.78) / 10) * 10;
  const high = Math.round((midpoint * 1.32) / 10) * 10;
  return (
    <ToolShell
      title="Instant ballpark quote"
      detail="Get a planning range before you call. Parts and diagnosis can change the final quote."
      icon={WalletCards}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <ToolSelect
          label="Service"
          value={service}
          onChange={(e) => setService(Number(e.target.value))}
          options={quoteServices.map(([label, value]) => [label, value])}
        />
        <ToolSelect
          label="Where"
          value={where}
          onChange={(e) => setWhere(Number(e.target.value))}
          options={[
            ["In shop", 1],
            ["Mobile call-out", 1.45],
          ]}
        />
        <ToolSelect
          label="When"
          value={urgency}
          onChange={(e) => setUrgency(Number(e.target.value))}
          options={[
            ["This week", 1],
            ["After hours", 1.3],
          ]}
        />
      </div>
      <button
        type="button"
        onClick={() => setShown(true)}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-3 border border-primary bg-transparent px-5 py-3 font-display tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Show my range
      </button>
      {shown && (
        <Readout title="Estimated range">
          <strong className="font-display text-2xl text-foreground">
            CAD ${low.toLocaleString()} - ${high.toLocaleString()}
          </strong>
          <span className="mt-1 block">
            A written quote follows diagnosis. {where > 1 ? "Mobile call-out included. " : ""}
            {urgency > 1 ? "After-hours rate applied." : ""}
          </span>
        </Readout>
      )}
    </ToolShell>
  );
}

function InspectionTool() {
  const initial = new Date();
  initial.setMonth(initial.getMonth() + 2);
  const [date, setDate] = useState(
    () => localStorage.getItem("gs-inspection-expiry") ?? initial.toISOString().slice(0, 10),
  );
  const [saved, setSaved] = useState(false);
  function save() {
    localStorage.setItem("gs-inspection-expiry", date);
    setSaved(true);
  }
  return (
    <ToolShell
      title="Safety inspection reminder"
      detail="Save an expiry date in this browser and get a simple 30/15/7-day reminder schedule."
      icon={CalendarDays}
    >
      <label className="label-tech text-muted-foreground" htmlFor="inspection-expiry">
        Inspection expiry
      </label>
      <input
        id="inspection-expiry"
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setSaved(false);
        }}
        className="mt-2 w-full border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
      />
      <button
        type="button"
        onClick={save}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-3 bg-primary px-5 py-3 font-display tracking-wide text-primary-foreground hover:bg-hazard"
      >
        {saved ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
        {saved ? "Reminder saved" : "Save reminder"}
      </button>
      {saved && (
        <Readout title="Reminder schedule">
          This browser will remember the date. Add it to your calendar or contact the shop to book
          the next open bay. Email and SMS automation require a connected service.
        </Readout>
      )}
    </ToolShell>
  );
}

function BookingTool() {
  const [day, setDay] = useState(1);
  const [slot, setSlot] = useState<string | null>(null);
  const days = Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      index,
      label: date.toLocaleDateString("en-CA", { weekday: "short" }).toUpperCase(),
      date: date.getDate(),
    };
  });
  const selected = days[day];
  const dateLabel = selected ? `${selected.label} ${selected.date}` : "selected day";
  return (
    <ToolShell
      title="Bay booking"
      detail="Choose a preferred shop slot, then send the request to the team without tying up the emergency line."
      icon={CalendarDays}
    >
      <div className="grid grid-cols-5 gap-2">
        {days.map((item) => (
          <button
            key={item.index}
            type="button"
            onClick={() => {
              setDay(item.index);
              setSlot(null);
            }}
            className={cn(
              "border px-2 py-3 text-center font-display text-sm",
              day === item.index
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            <span className="block text-xs">{item.label}</span>
            {item.date}
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {slots.map((item, index) => {
          const unavailable = (day + index) % 5 === 0;
          return (
            <button
              key={item}
              type="button"
              disabled={unavailable}
              onClick={() => setSlot(item)}
              className={cn(
                "border px-2 py-3 text-sm transition-colors",
                unavailable
                  ? "cursor-not-allowed border-border/40 text-muted-foreground/40 line-through"
                  : slot === item
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary hover:text-primary",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
      {slot && (
        <Readout title="Preferred slot">
          <strong className="text-foreground">
            {dateLabel} at {slot}
          </strong>
          <a
            className="mt-3 inline-flex items-center gap-2 text-foreground underline decoration-primary underline-offset-4"
            href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent(`Bay booking request - ${dateLabel} ${slot}`)}&body=${encodeURIComponent("Please confirm the unit number, service needed and this preferred slot.")}`}
          >
            <Send className="h-4 w-4" />
            Send booking request
          </a>
        </Readout>
      )}
    </ToolShell>
  );
}

function FleetTool() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ToolShell
      title="Fleet service view"
      detail="A preview of the unit-level history and inspection visibility promised for fleet customers."
      icon={Truck}
    >
      <div className="divide-y divide-border border border-border">
        {fleetUnits.map((unit) => (
          <div key={unit.id}>
            <button
              type="button"
              onClick={() => setOpen(open === unit.id ? null : unit.id)}
              aria-expanded={open === unit.id}
              className="flex min-h-14 w-full items-center gap-3 px-4 text-left hover:bg-surface-2"
            >
              <span className="font-mono text-xs text-primary">{unit.id}</span>
              <span className="flex-1 text-sm">{unit.vehicle}</span>
              <span className="hidden text-xs text-muted-foreground sm:block">{unit.status}</span>
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", open === unit.id && "rotate-180")}
              />
            </button>
            {open === unit.id && (
              <ul className="space-y-2 border-t border-border bg-background px-4 py-4 text-sm text-muted-foreground">
                {unit.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <a
        href={`mailto:${BUSINESS.email}?subject=Fleet%20service%20account`}
        className="mt-4 flex min-h-12 items-center justify-center gap-2 border border-border px-5 py-3 font-display tracking-wide hover:border-primary hover:text-primary"
      >
        <MessageCircle className="h-4 w-4" />
        Talk to fleet service
      </a>
    </ToolShell>
  );
}

function LanguageTool() {
  const [language, setLanguage] = useState<"en" | "pa">("en");
  const copy =
    language === "en"
      ? {
          heading: "Broken down? We roll 24/7.",
          body: "Mobile truck and trailer repair across Brampton, Mississauga and the 401, 407 and 410.",
        }
      : {
          heading: "ਟਰੱਕ ਖਰਾਬ ਹੋ ਗਿਆ? ਅਸੀਂ 24/7 ਹਾਜ਼ਰ ਹਾਂ।",
          body: "ਬਰੈਂਪਟਨ, ਮਿਸੀਸਾਗਾ ਅਤੇ 401, 407, 410 ਹਾਈਵੇਅ ਉੱਤੇ ਮੋਬਾਈਲ ਟਰੱਕ ਅਤੇ ਟ੍ਰੇਲਰ ਰਿਪੇਅਰ।",
        };
  return (
    <ToolShell
      title="English / ਪੰਜਾਬੀ"
      detail="Switch the essential emergency message for Punjabi-speaking owner-operators in the GTA."
      icon={MessageCircle}
    >
      <div className="flex gap-2">
        {(
          [
            ["en", "English"],
            ["pa", "ਪੰਜਾਬੀ"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setLanguage(value)}
            className={cn(
              "min-h-11 flex-1 border px-4 font-display",
              language === value
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <h4 className="font-display text-2xl">{copy.heading}</h4>
        <p className="mt-2 text-sm text-muted-foreground">{copy.body}</p>
      </div>
    </ToolShell>
  );
}

function ToolSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: readonly (readonly [string, number])[];
}) {
  return (
    <label className="block">
      <span className="label-tech text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-primary"
      >
        {options.map(([name, optionValue]) => (
          <option key={name} value={optionValue}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ProposalLanguageStrip() {
  const [language, setLanguage] = useState<"en" | "pa">("en");
  const copy =
    language === "en"
      ? ["Dispatch is live", "Broken down? We answer the phone at 3 a.m."]
      : ["ਡਿਸਪੈਚ ਲਾਈਵ ਹੈ", "ਟਰੱਕ ਖਰਾਬ? ਅਸੀਂ ਰਾਤ 3 ਵਜੇ ਵੀ ਫ਼ੋਨ ਚੁੱਕਦੇ ਹਾਂ।"];
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-border px-5 py-3 sm:px-8">
      <span className="label-tech text-muted-foreground">{copy[0]}</span>
      <span className="text-sm text-foreground">{copy[1]}</span>
      <div className="ml-auto flex gap-1">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={cn(
            "px-2 py-1 text-xs",
            language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("pa")}
          className={cn(
            "px-2 py-1 text-xs",
            language === "pa" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          ਪੰਜਾਬੀ
        </button>
      </div>
    </div>
  );
}
