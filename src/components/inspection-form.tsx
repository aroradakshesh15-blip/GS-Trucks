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

const VEHICLE_TYPES = ["Semi Truck", "Box Truck", "Straight Truck", "Tractor", "Trailer", "Other"];
const LOCATIONS = ["At GS Trucks", "On-Site / Fleet Location", "Other"];
const TIME_SLOTS = [
  "7:00 AM",
  "8:30 AM",
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
  "5:30 PM",
];

type VehicleFields = {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  vehicleType: string;
  year: string;
  make: string;
  model: string;
  vin: string;
  unitNumber: string;
  mileage: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  message: string;
};

const EMPTY_VEHICLE: VehicleFields = {
  fullName: "",
  phone: "",
  email: "",
  company: "",
  vehicleType: "",
  year: "",
  make: "",
  model: "",
  vin: "",
  unitNumber: "",
  mileage: "",
  preferredDate: "",
  preferredTime: "",
  location: "",
  message: "",
};

type VehicleErrors = Partial<Record<keyof VehicleFields, string>>;

function validateVehicle(v: VehicleFields): VehicleErrors {
  const e: VehicleErrors = {};
  if (!v.fullName.trim()) e.fullName = "Full name is required";
  if (!v.phone.trim()) e.phone = "Phone number is required";
  else if (v.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number";
  if (!v.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email";
  if (!v.company.trim()) e.company = "Company / fleet name is required";
  if (!v.vehicleType) e.vehicleType = "Select a vehicle type";
  return e;
}

const inputClass =
  "w-full border border-border bg-background px-4 py-3.5 font-sans text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

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
      <div className="mt-2">{children}</div>
      {error ? <span className="mt-2 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

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
    <div className="border border-border bg-surface p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="font-display text-xl tracking-wide sm:text-2xl">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {selectedCount} of {ids.length} selected
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <Checkbox
            checked={allSelected ? true : someSelected ? "indeterminate" : false}
            onCheckedChange={() => onToggleAll(ids, !allSelected)}
            aria-label={`Select all ${title} services`}
          />
          Select all
        </label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const checked = selected.has(item.id);
          return (
            <label
              key={item.id}
              htmlFor={`${categoryId}-${item.id}`}
              className={cn(
                "flex min-h-[3.25rem] cursor-pointer items-start gap-3 border p-4 transition-colors",
                checked ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              )}
            >
              <Checkbox
                id={`${categoryId}-${item.id}`}
                checked={checked}
                onCheckedChange={() => onToggleItem(item.id)}
                className="mt-0.5"
              />
              <span>
                <span className="block text-sm font-medium text-foreground">{item.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function InspectionForm() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [vehicle, setVehicle] = useState<VehicleFields>(EMPTY_VEHICLE);
  const [errors, setErrors] = useState<VehicleErrors>({});
  const [agree, setAgree] = useState(false);
  const [serviceError, setServiceError] = useState<string | undefined>();
  const [agreeError, setAgreeError] = useState<string | undefined>();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (key: keyof VehicleFields) => (v: string) => {
    setVehicle((p) => ({ ...p, [key]: v }));
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateVehicle(vehicle);
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
          ...vehicle,
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
            <h3 className="mt-7 font-display text-3xl">Request received</h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              Thank you! Your inspection request has been received. Our team will review your
              request and contact you shortly to confirm the details.
            </p>
            <button
              type="button"
              onClick={() => {
                setVehicle(EMPTY_VEHICLE);
                setSelected(new Set());
                setAgree(false);
                setState("idle");
              }}
              className="mt-8 border border-border px-6 py-3 font-display tracking-wide transition-colors hover:border-primary hover:text-primary"
            >
              Submit another request
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
        className="scroll-mt-24 border-t border-border bg-background py-20 sm:py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Eyebrow>Select services</Eyebrow>
          <StaggerHeading
            text="What Would You Like Us to Inspect?"
            as="h2"
            className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.6rem)] font-bold"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-muted-foreground">
              Select every inspection you'd like included. You can choose a single service, mix
              and match across categories, or select an entire category at once.
            </p>
          </Reveal>

          <div className="mt-10 space-y-6">
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
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          <Eyebrow>Vehicle & contact details</Eyebrow>
          <StaggerHeading
            text="Tell Us About Your Vehicle"
            as="h2"
            className="mt-5 max-w-2xl text-[clamp(2rem,4.6vw,3.6rem)] font-bold"
          />

          <div className="mt-10 border border-border bg-surface-2 p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName} required>
                <input
                  className={cn(inputClass, errors.fullName && "border-destructive")}
                  value={vehicle.fullName}
                  onChange={(e) => set("fullName")(e.target.value)}
                  placeholder="John Singh"
                  autoComplete="name"
                />
              </Field>
              <Field label="Phone number" error={errors.phone} required>
                <input
                  type="tel"
                  className={cn(inputClass, errors.phone && "border-destructive")}
                  value={vehicle.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  placeholder="(416) 000-0000"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Email address" error={errors.email} required>
                <input
                  type="email"
                  className={cn(inputClass, errors.email && "border-destructive")}
                  value={vehicle.email}
                  onChange={(e) => set("email")(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </Field>
              <Field label="Company / fleet name" error={errors.company} required>
                <input
                  className={cn(inputClass, errors.company && "border-destructive")}
                  value={vehicle.company}
                  onChange={(e) => set("company")(e.target.value)}
                  placeholder="Your company name"
                  autoComplete="organization"
                />
              </Field>

              <Field label="Vehicle type" error={errors.vehicleType} required>
                <select
                  className={cn(inputClass, errors.vehicleType && "border-destructive")}
                  value={vehicle.vehicleType}
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
              <Field label="Year">
                <input
                  className={inputClass}
                  value={vehicle.year}
                  onChange={(e) => set("year")(e.target.value)}
                  placeholder="2021"
                  inputMode="numeric"
                />
              </Field>
              <Field label="Make">
                <input
                  className={inputClass}
                  value={vehicle.make}
                  onChange={(e) => set("make")(e.target.value)}
                  placeholder="Freightliner"
                />
              </Field>
              <Field label="Model">
                <input
                  className={inputClass}
                  value={vehicle.model}
                  onChange={(e) => set("model")(e.target.value)}
                  placeholder="Cascadia"
                />
              </Field>
              <Field label="VIN">
                <input
                  className={inputClass}
                  value={vehicle.vin}
                  onChange={(e) => set("vin")(e.target.value)}
                  placeholder="Vehicle identification number"
                />
              </Field>
              <Field label="License plate / unit number">
                <input
                  className={inputClass}
                  value={vehicle.unitNumber}
                  onChange={(e) => set("unitNumber")(e.target.value)}
                  placeholder="Unit #"
                />
              </Field>
              <Field label="Current mileage">
                <input
                  className={inputClass}
                  value={vehicle.mileage}
                  onChange={(e) => set("mileage")(e.target.value)}
                  placeholder="e.g. 240,000 km"
                  inputMode="numeric"
                />
              </Field>

              <Field label="Preferred date">
                <input
                  type="date"
                  className={inputClass}
                  value={vehicle.preferredDate}
                  onChange={(e) => set("preferredDate")(e.target.value)}
                />
              </Field>
              <Field label="Preferred time">
                <select
                  className={inputClass}
                  value={vehicle.preferredTime}
                  onChange={(e) => set("preferredTime")(e.target.value)}
                >
                  <option value="">Select a time…</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Location">
                  <select
                    className={inputClass}
                    value={vehicle.location}
                    onChange={(e) => set("location")(e.target.value)}
                  >
                    <option value="">Select a location…</option>
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Additional details">
                  <textarea
                    rows={5}
                    className={cn(inputClass, "resize-none")}
                    value={vehicle.message}
                    onChange={(e) => set("message")(e.target.value)}
                    placeholder="Anything else we should know before the inspection…"
                  />
                </Field>
              </div>
            </div>

            {selectedItems.length > 0 && (
              <div className="mt-8 border border-primary/30 bg-primary/10 p-5">
                <span className="label-tech text-primary">Selected services</span>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selectedItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
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
              className="mt-8 flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 font-display text-lg tracking-[0.1em] text-primary-foreground transition-colors hover:bg-hazard disabled:opacity-70"
            >
              {state === "sending" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Request Inspection
                </>
              )}
            </motion.button>
            {state === "error" && (
              <p className="mt-4 text-sm text-destructive">
                Something went wrong sending your request. Please try again, or call{" "}
                {BUSINESS.phoneDisplay}.
              </p>
            )}
          </div>
        </div>
      </section>
    </form>
  );
}
