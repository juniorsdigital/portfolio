"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BUDGET_OPTIONS,
  SERVICE_NEEDS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  type ServiceValue,
} from "@/lib/offerings";

const initial = {
  name: "",
  email: "",
  phone: "",
  service: "" as ServiceValue | "",
  needs: [] as string[],
  brand: "",
  brief: "",
  timeline: "",
  budget: "",
  links: "",
  company_website: "",
};

function isService(value: string | null): value is ServiceValue {
  return SERVICE_OPTIONS.some((s) => s.value === value);
}

/**
 * Reads ?service= and ?need= so "Get a quote" links on service pages land on
 * a form that already knows what the client wants. Wrap in <Suspense>.
 */
export function ContactFormFromParams() {
  const params = useSearchParams();
  const service = params.get("service");
  const need = params.get("need");
  if (!isService(service)) return <ContactForm />;
  return (
    <ContactForm
      key={`${service}-${need}`}
      defaultService={service}
      defaultNeed={need && SERVICE_NEEDS[service].includes(need) ? need : undefined}
    />
  );
}

export function ContactForm({
  defaultService,
  defaultNeed,
}: {
  defaultService?: ServiceValue;
  defaultNeed?: string;
} = {}) {
  const [form, setForm] = useState(() => ({
    ...initial,
    service: defaultService ?? initial.service,
    needs: defaultNeed ? [defaultNeed] : initial.needs,
  }));
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const needs = useMemo(() => {
    if (!form.service) return [];
    return SERVICE_NEEDS[form.service];
  }, [form.service]);

  function update<K extends keyof typeof initial>(
    key: K,
    value: (typeof initial)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleNeed(need: string) {
    setForm((prev) => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter((n) => n !== need)
        : [...prev.needs, need],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not send. Try email instead.");
        return;
      }
      setStatus("sent");
      setForm(initial);
    } catch {
      setStatus("error");
      setError("Could not send. Try email instead.");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-rule bg-card p-8 sm:p-12" role="status">
        <p className="kicker text-signal-ink">Sent</p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight">I have it.</h2>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-slate">
          I&apos;ll read the brief and get back to you. If it&apos;s urgent,
          email me directly.
        </p>
        <button
          type="button"
          className="btn btn-sm mt-7 border border-ink"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  const label = "flex flex-col gap-2 text-[0.9375rem] font-semibold text-ink";
  const hint = "font-normal text-slate";
  const field =
    "min-h-13 w-full border border-field bg-card px-4 py-3 text-[1.0625rem] font-normal text-ink placeholder:text-slate focus:border-ink";
  const choice = (on: boolean) =>
    `cursor-pointer border transition-colors ${
      on
        ? "border-ink bg-ink text-paper"
        : "border-field bg-card text-ink hover:border-ink"
    }`;

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex flex-col gap-8 border border-rule bg-card p-6 sm:p-10 lg:p-12"
      noValidate
      method="post"
      action="#"
    >
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => update("company_website", e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Name
          <input
            required
            className={field}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className={label}>
          Email
          <input
            required
            type="email"
            className={field}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
          />
        </label>
      </div>

      <label className={label}>
        <span>
          Phone <span className={hint}>— optional</span>
        </span>
        <input
          type="tel"
          className={field}
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          autoComplete="tel"
        />
      </label>

      <fieldset>
        <legend className="text-[0.9375rem] font-semibold">What do you need?</legend>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {SERVICE_OPTIONS.map((opt) => {
            const on = form.service === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  update("service", opt.value);
                  update("needs", []);
                }}
                className={`min-h-13 px-4 text-left font-semibold ${choice(on)}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {needs.length > 0 ? (
        <fieldset>
          <legend className="text-[0.9375rem] font-semibold">
            Specifics <span className={hint}>— pick any</span>
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {needs.map((need) => {
              const on = form.needs.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleNeed(need)}
                  className={`min-h-11 border px-4 text-[0.9375rem] font-medium transition-colors ${
                    on
                      ? "border-signal bg-signal text-ink"
                      : "cursor-pointer border-field bg-card text-ink hover:border-ink"
                  }`}
                >
                  {need}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <label className={label}>
        Brand or project name
        <input
          className={field}
          value={form.brand}
          onChange={(e) => update("brand", e.target.value)}
        />
      </label>

      <label className={label}>
        Brief
        <textarea
          required
          rows={6}
          className={`${field} min-h-40 resize-y`}
          placeholder="What you need, who it's for, and any constraints."
          value={form.brief}
          onChange={(e) => update("brief", e.target.value)}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Timeline
          <select
            className={field}
            value={form.timeline}
            onChange={(e) => update("timeline", e.target.value)}
          >
            <option value="">Select</option>
            {TIMELINE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        <label className={label}>
          <span>
            Budget <span className={hint}>— optional</span>
          </span>
          <select
            className={field}
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
          >
            <option value="">Select</option>
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={label}>
        <span>
          Links <span className={hint}>— optional</span>
        </span>
        <textarea
          rows={3}
          className={`${field} resize-y`}
          placeholder="Drive folder, references, an existing Google Business Profile…"
          value={form.links}
          onChange={(e) => update("links", e.target.value)}
        />
      </label>

      {status === "error" ? (
        <p className="border-l-0 bg-signal/12 px-4 py-3 font-medium text-ink" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-rule-soft pt-7">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-signal min-h-14 px-8 text-lg disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send brief"}{" "}
          <span aria-hidden="true">→</span>
        </button>
        <span className="text-[0.9375rem] text-slate">
          I reply to the email you leave here.
        </span>
      </div>
    </form>
  );
}
