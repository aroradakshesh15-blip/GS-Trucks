"use client";

import { motion } from "motion/react";
import { Check, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";

import { INSPECTION_CATEGORIES, type InspectionItem } from "@/lib/site";
import { EASE_OUT, Eyebrow, Reveal, StaggerHeading } from "@/components/motion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/lib/site";

const ALL_ITEMS: InspectionItem[] = INSPECTION_CATEGORIES.flatMap((c) => c.items);

const VEHICLE_TYPES = ["Semi Truck", "Tractor", "Trailer", "Box Truck", "Other"];

type BookingFields = {
  fullName: string;
  phone: string;
  email: string;
  vehicleType: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

const EMPTY_BOOKING: BookingFields = {
  fullName: "",
  phone: "",
  email: "",
  vehicleType: "",
  preferredDate: "",
  preferredTime: "",
  notes: "",
};

type BookingErrors = Partial<Record<keyof BookingFields, string>>;

function validateBooking(v: BookingFields): BookingErrors {
  const e: BookingErrors = {};
  if (!v.fullName.trim()) e.fullName = "Full name is required";
  if (!v.phone.trim()) e.phone = "Phone number is required";
  else if (v.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number";
  if (!v.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email";
  if (!v.vehicleType) e.vehicleType = "Select a vehicle type";
  if (!v.preferredDate) e.preferredDate = "Select a preferred date";
  if (!v.preferredTime) e.preferredTime = "Select a preferred time";
  return e;
}

const inputClass =
  "w-full border border-border bg-background px-3.5 py-3 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string | undefined;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-tech text-muted-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error ? <span className="mt-1.5 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

/** Compact multi-select category block — smaller footprint than a full card grid. */
function CategoryBlock({
  categoryId,
  title,
  items,
  selected,
  onToggleItem,
  onToggleAll,
}: {
  categoryId: string;
  title: string;
  items: InspectionItem[];
  selected: Set<string>;
  onToggleItem: (id: string) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
}) {
  const ids = items.map((i) => i.id);
  const selectedCount = ids.filter((id) => selected.has(id)).length;
  const allSelected = selectedCount === ids.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className="border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <h3 className="font-display text-base tracking-wide sm:text-lg">
          {title}
          <span className="ml-2 text-xs font-sans font-normal normal-case text-muted-foreground">
            {selectedCount}/{ids.length}
          </span>
        </h3>
        <label className="flex cursor-pointer items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <Checkbox
            checked={allSelected ? true : someSelected ? "indeterminate" : false}
            onCheckedChange={() => onToggleAll(ids, !allSelected)}
            aria-label={`Select all ${title} services`}
          />
          All
        </label>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const checked = selected.has(item.id);
          return (
            <label
              key={item.id}
              htmlFor={`${categoryId}-${item.id}`}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-2.5 border px-3 py-2.5 text-sm transition-colors",
                checked ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              )}
            >
              <Checkbox
                id={`${categoryId}-${item.id}`}
                checked={checked}
                onCheckedChange={() => onToggleItem(item.id)}
              />
              <span className="text-foreground">{item.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function InspectionForm() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [booking, setBooking] = useState<BookingFields>(EMPTY_BOOKING);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [agree, setAgree] = useState(false);
  const [serviceError, setServiceError] = useState<string | undefined>();
  const [agreeError, setAgreeError] = useState<string | undefined>();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (key: keyof BookingFields) => (v: string) => {
    setBooking((p) => ({ ...p, [key]: v }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  function toggleItem(id: string) {
    setServiceError(undefined);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(ids: string[], checked: boolean) {
    setServiceError(undefined);
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }

  const selectedItems = ALL_ITEMS.filter((i) => selected.has(i.id));
  const todayIso = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateBooking(booking);
    setErrors(nextErrors);

    let hasError = Object.keys(nextErrors).length > 0;

    if (selectedItems.length === 0) {
      setServiceError("Select at least one inspection service");
      hasError = true;
    } else {
      setServiceError(undefined);
    }

    if (!agree) {
      setAgreeError("Please confirm you agree to be contacted");
      hasError = true;
    } else {
      setAgreeError(undefined);
    }

    if (hasError) return;

    setState("sending");
    try {
      const res = await fetch("/send-inspection.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          services: selectedItems.map((i) => i.label),
        }),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (!res.ok || !data?.success) throw new Error("Send failed");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <section
        id="inspection-request"
        className="scroll-mt-24 border-t border-border bg-surface py-20 sm:py-24"
      >
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
          <motion.div
            className="flex flex-col items-center border border-primary/40 bg-primary/10 p-12 text-center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <span className="flex h-16 w-16 items-center justify-center border border-primary text-primary">
              <Check className="h-8 w-8" />
            </span>
            <h3 className="mt-7 font-display text-3xl">Inspection booked</h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              Thank you! Your inspection request has been received. Our team will review your
              request and contact you shortly to confirm the details. A confirmation email is on
              its way, and we'll remind you again as the date approaches.
            </p>
            <button
              type="button"
              onClick={() => {
                setBooking(EMPTY_BOOKING);
                setSelected(new Set());
                setAgree(false);
                setState("idle");
              }}
              className="mt-8 border border-border px-6 py-3 font-display tracking-wide transition-colors hover:border-primary hover:text-primary"
            >
              Book another inspection
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <section
        id="inspection-services"
        className="scroll-mt-24 border-t border-border bg-background py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Eyebrow>Select services</Eyebrow>
          <StaggerHeading
            text="What Would You Like Us to Inspect?"
            as="h2"
            className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.6rem)] font-bold"
          />
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Select every inspection you'd like included — mix and match across categories, or
              select an entire category at once.
            </p>
          </Reveal>

          <div className="mt-8 space-y-4">
            {INSPECTION_CATEGORIES.map((cat) => (
              <CategoryBlock
                key={cat.id}
                categoryId={cat.id}
                title={cat.title}
                items={cat.items}
                selected={selected}
                onToggleItem={toggleItem}
                onToggleAll={toggleAll}
              />
            ))}
          </div>
          {serviceError && <p className="mt-4 text-sm text-destructive">{serviceError}</p>}
        </div>
      </section>

      <section
        id="inspection-request"
        className="scroll-mt-24 border-t border-border bg-surface py-20 sm:py-24"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <Eyebrow>Book now</Eyebrow>
            <StaggerHeading
              text="Book Your Inspection"
              as="h2"
              className="mt-5 max-w-md text-[clamp(2rem,4.2vw,3.2rem)] font-bold"
            />
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-sm text-muted-foreground">
                Just your contact details, vehicle type and a preferred time — takes under a
                minute. We'll confirm by email and send reminders as the date gets close.
              </p>
            </Reveal>
            {selectedItems.length > 0 && (
              <div className="mt-8 border border-primary/30 bg-primary/10 p-4">
                <span className="label-tech text-primary">Selected services</span>
                <ul className="mt-3 space-y-1.5">
                  {selectedItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Reveal y={24}>
            <div className="border border-border bg-surface-2 p-6 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Full name" error={errors.fullName} required>
                    <input
                      className={cn(inputClass, errors.fullName && "border-destructive")}
                      value={booking.fullName}
                      onChange={(e) => set("fullName")(e.target.value)}
                      placeholder="John Singh"
                      autoComplete="name"
                    />
                  </Field>
                </div>
                <Field label="Phone number" error={errors.phone} required>
                  <input
                    type="tel"
                    className={cn(inputClass, errors.phone && "border-destructive")}
                    value={booking.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    placeholder="(416) 000-0000"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Email address" error={errors.email} required>
                  <input
                    type="email"
                    className={cn(inputClass, errors.email && "border-destructive")}
                    value={booking.email}
                    onChange={(e) => set("email")(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Vehicle type" error={errors.vehicleType} required>
                    <select
                      className={cn(inputClass, errors.vehicleType && "border-destructive")}
                      value={booking.vehicleType}
                      onChange={(e) => set("vehicleType")(e.target.value)}
                    >
                      <option value="">Select vehicle type…</option>
                      {VEHICLE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Preferred date" error={errors.preferredDate} required>
                  <input
                    type="date"
                    min={todayIso}
                    className={cn(inputClass, errors.preferredDate && "border-destructive")}
                    value={booking.preferredDate}
                    onChange={(e) => set("preferredDate")(e.target.value)}
                  />
                </Field>
                <Field label="Preferred time" error={errors.preferredTime} required>
                  <input
                    type="time"
                    className={cn(inputClass, errors.preferredTime && "border-destructive")}
                    value={booking.preferredTime}
                    onChange={(e) => set("preferredTime")(e.target.value)}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Additional notes">
                    <textarea
                      rows={3}
                      className={cn(inputClass, "resize-none")}
                      value={booking.notes}
                      onChange={(e) => set("notes")(e.target.value)}
                      placeholder="Anything else we should know…"
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-5">
                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
                  <Checkbox
                    checked={agree}
                    onCheckedChange={(v) => {
                      setAgree(v === true);
                      setAgreeError(undefined);
                    }}
                    className="mt-0.5"
                    aria-invalid={Boolean(agreeError)}
                  />
                  I agree to be contacted regarding my inspection request.
                </label>
                {agreeError && <p className="mt-2 text-xs text-destructive">{agreeError}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={state === "sending"}
                whileHover={state === "idle" ? { scale: 1.01 } : {}}
                whileTap={state === "idle" ? { scale: 0.99 } : {}}
                className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 bg-primary px-8 py-4 font-display text-lg tracking-[0.1em] text-primary-foreground transition-colors hover:bg-hazard disabled:opacity-70"
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Booking…
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Book Inspection
                  </>
                )}
              </motion.button>
              {state === "error" && (
                <p className="mt-4 text-sm text-destructive">
                  Something went wrong booking your inspection. Please try again, or call{" "}
                  {BUSINESS.phoneDisplay}.
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </form>
  );
}
