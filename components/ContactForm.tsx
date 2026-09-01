"use client";

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

export function ContactForm() {
  const [form, setForm] = useState(initial);
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
      <div className="clip-shard hairline bg-bg-elev p-8">
        <p className="label-kicker">Sent</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold">
          I have it.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          I&apos;ll read the brief and get back to you. If it&apos;s urgent, email
          me directly.
        </p>
        <button
          type="button"
          className="mt-6 text-xs tracking-[0.16em] text-volt uppercase"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  const field =
    "clip-shard-sm w-full border border-gilt/25 bg-bg px-4 py-3 text-sm text-bone placeholder:text-faint";

  return (
    <form onSubmit={onSubmit} className="relative space-y-6" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => update("company_website", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs tracking-[0.14em] text-muted uppercase">
          Name
          <input
            required
            className={`${field} mt-2`}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="block text-xs tracking-[0.14em] text-muted uppercase">
          Email
          <input
            required
            type="email"
            className={`${field} mt-2`}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
          />
        </label>
      </div>

      <label className="block text-xs tracking-[0.14em] text-muted uppercase">
        Phone <span className="text-faint">(optional)</span>
        <input
          type="tel"
          className={`${field} mt-2`}
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          autoComplete="tel"
        />
      </label>

      <fieldset>
        <legend className="text-xs tracking-[0.14em] text-muted uppercase">
          What do you need?
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {SERVICE_OPTIONS.map((opt) => {
            const on = form.service === opt.value;
            return (
              <label
                key={opt.value}
                className={`clip-shard-sm cursor-pointer border px-4 py-3 text-sm ${
                  on
                    ? "border-volt bg-volt/10 text-bone"
                    : "border-gilt/25 text-muted hover:border-gilt/50"
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  className="sr-only"
                  value={opt.value}
                  checked={on}
                  onChange={() => {
                    update("service", opt.value);
                    update("needs", []);
                  }}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {needs.length > 0 ? (
        <fieldset>
          <legend className="text-xs tracking-[0.14em] text-muted uppercase">
            Specifics
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {needs.map((need) => {
              const on = form.needs.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  onClick={() => toggleNeed(need)}
                  className={`clip-shard-sm px-3 py-2 text-xs tracking-[0.04em] ${
                    on
                      ? "bg-ember text-bone"
                      : "hairline text-muted hover:text-bone"
                  }`}
                >
                  {need}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <label className="block text-xs tracking-[0.14em] text-muted uppercase">
        Brand / project name
        <input
          className={`${field} mt-2`}
          value={form.brand}
          onChange={(e) => update("brand", e.target.value)}
        />
      </label>

      <label className="block text-xs tracking-[0.14em] text-muted uppercase">
        Brief
        <textarea
          required
          rows={6}
          className={`${field} mt-2 min-h-32`}
          placeholder="What you need, who it's for, and any constraints."
          value={form.brief}
          onChange={(e) => update("brief", e.target.value)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs tracking-[0.14em] text-muted uppercase">
          Timeline
          <select
            className={`${field} mt-2`}
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
        <label className="block text-xs tracking-[0.14em] text-muted uppercase">
          Budget <span className="text-faint">(optional)</span>
          <select
            className={`${field} mt-2`}
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

      <label className="block text-xs tracking-[0.14em] text-muted uppercase">
        Links <span className="text-faint">(optional)</span>
        <textarea
          rows={3}
          className={`${field} mt-2`}
          placeholder="Drive folder, references, existing Google Business page…"
          value={form.links}
          onChange={(e) => update("links", e.target.value)}
        />
      </label>

      {status === "error" ? (
        <p className="text-sm text-ember" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="clip-shard bg-ember px-6 py-3 text-[0.72rem] font-medium tracking-[0.18em] text-bone uppercase disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send brief"}
      </button>
    </form>
  );
}
