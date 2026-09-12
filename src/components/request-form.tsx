"use client";

import { motion } from "motion/react";
import { Check, Loader2, Send } from "lucide-react";
import { useState } from "react";

import { ALL_SERVICES, BUSINESS } from "@/lib/site";
import { EASE_OUT, Eyebrow, Reveal, StaggerHeading } from "@/components/motion";
import { cn } from "@/lib/utils";

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const EMPTY: Fields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

function validate(v: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!v.firstName.trim()) e.firstName = "First name is required";
  if (!v.lastName.trim()) e.lastName = "Last name is required";
  if (!v.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email";
  if (!v.phone.trim()) e.phone = "Phone is required";
  else if (v.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number";
  if (!v.service) e.service = "Select a service";
  if (v.message.trim().length < 10) e.message = "Tell us a bit more (10+ characters)";
  return e;
}

const inputClass =
  "w-full border border-border bg-background px-4 py-4 font-sans text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

export function RequestForm() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (key: keyof Fields) => (v: string) => {
    setValues((p) => ({ ...p, [key]: v }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setState("sending");
    try {
      const res = await fetch("/send-form.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (!res.ok || !data?.success) throw new Error("Send failed");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="request" className="scroll-mt-24 border-t border-border bg-surface py-20 sm:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Eyebrow>Request service</Eyebrow>
          <StaggerHeading
            text="Tell us what's wrong."
            className="mt-5 text-[clamp(2rem,4.6vw,3.6rem)] font-bold"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Send the details and we'll come back with a plan. Broken down right now? Skip the form
              and call — our dispatch line runs around the clock.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <a
              href={BUSINESS.phoneHref}
              className="mt-8 inline-block font-display text-3xl text-primary"
            >
              {BUSINESS.phoneDisplay}
            </a>
            <p className="mt-3 text-sm text-muted-foreground">{BUSINESS.address}</p>
            <a
              href={BUSINESS.emailHref}
              className="mt-1 block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {BUSINESS.email}
            </a>
          </Reveal>
        </div>

        <Reveal y={36}>
          {state === "sent" ? (
            <motion.div
              className="flex h-full min-h-[24rem] flex-col items-center justify-center border border-primary/40 bg-primary/10 p-12 text-center"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <span className="flex h-16 w-16 items-center justify-center border border-primary text-primary">
                <Check className="h-8 w-8" />
              </span>
              <h3 className="mt-7 font-display text-3xl">Request received</h3>
              <p className="mt-4 max-w-sm text-muted-foreground">
                Thanks {values.firstName}. We've emailed your request to the shop and will follow
                up shortly. For an emergency, call {BUSINESS.phoneDisplay}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setValues(EMPTY);
                  setState("idle");
                }}
                className="mt-8 border border-border px-6 py-3 font-display tracking-wide transition-colors hover:border-primary hover:text-primary"
              >
                Send another request
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="border border-border bg-surface-2 p-6 sm:p-8"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="First name" error={errors.firstName}>
                  <input
                    className={cn(inputClass, errors.firstName && "border-destructive")}
                    value={values.firstName}
                    onChange={(e) => set("firstName")(e.target.value)}
                    placeholder="John"
                    autoComplete="given-name"
                  />
                </Field>
                <Field label="Last name" error={errors.lastName}>
                  <input
                    className={cn(inputClass, errors.lastName && "border-destructive")}
                    value={values.lastName}
                    onChange={(e) => set("lastName")(e.target.value)}
                    placeholder="Singh"
                    autoComplete="family-name"
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    className={cn(inputClass, errors.email && "border-destructive")}
                    value={values.email}
                    onChange={(e) => set("email")(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <input
                    type="tel"
                    className={cn(inputClass, errors.phone && "border-destructive")}
                    value={values.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    placeholder="(416) 000-0000"
                    autoComplete="tel"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Service needed" error={errors.service}>
                    <select
                      className={cn(inputClass, errors.service && "border-destructive")}
                      value={values.service}
                      onChange={(e) => set("service")(e.target.value)}
                    >
                      <option value="">Select a service…</option>
                      {ALL_SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Message" error={errors.message}>
                    <textarea
                      rows={5}
                      className={cn(
                        inputClass,
                        "resize-none",
                        errors.message && "border-destructive",
                      )}
                      value={values.message}
                      onChange={(e) => set("message")(e.target.value)}
                      placeholder="Unit number, symptoms, location…"
                    />
                  </Field>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={state === "sending"}
                whileHover={state === "idle" ? { scale: 1.01 } : {}}
                whileTap={state === "idle" ? { scale: 0.99 } : {}}
                className="mt-6 flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 font-display text-lg tracking-[0.1em] text-primary-foreground transition-colors hover:bg-hazard disabled:opacity-70"
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Request service
                  </>
                )}
              </motion.button>
              {state === "error" && (
                <p className="mt-4 text-sm text-destructive">
                  Something went wrong sending your request. Please try again, or call{" "}
                  {BUSINESS.phoneDisplay}.
                </p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-tech text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? (
        <motion.span
          className="mt-2 block text-xs text-destructive"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.span>
      ) : null}
    </label>
  );
}
