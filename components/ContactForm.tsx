"use client";

import { track } from "@vercel/analytics";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { findCover } from "@/lib/hero-covers";
import {
  BUDGET_OPTIONS,
  COVER_COUNT_OPTIONS,
  SERVICE_NEEDS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  isServiceValue,
  type ServiceValue,
} from "@/lib/offerings";
import { SITE, isPlaceholder } from "@/lib/site";

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: ServiceValue | "";
  needs: string[];
  coverCount: string;
  brand: string;
  brief: string;
  timeline: string;
  budget: string;
  links: string;
  ref: string;
  company_website: string;
};

const empty: FormState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  needs: [],
  coverCount: "",
  brand: "",
  brief: "",
  timeline: "",
  budget: "",
  links: "",
  ref: "",
  company_website: "",
};

/** UTM tags from the landing URL, forwarded with the brief so outreach source shows up in the email. */
function readUtm(params: URLSearchParams) {
  const out: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const v = params.get(key);
    if (v) out[key] = v.slice(0, 80);
  }
  return out;
}

export function ContactForm() {
  const params = useSearchParams();
  const refCover = findCover(params.get("ref"));

  const initial = useMemo<FormState>(() => {
    const service = params.get("service");
    return {
      ...empty,
      service: isServiceValue(service) ? service : refCover ? "covers" : "",
      ref: refCover?.slug ?? "",
      brief: refCover ? `I'd like something like ${refCover.title}. ` : "",
    };
    // Initial values only: read the URL once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  const needs = form.service ? SERVICE_NEEDS[form.service] : [];
  const isCovers = form.service === "covers";
  const referenced = findCover(form.ref);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
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
        body: JSON.stringify({
          ...form,
          coverCount: isCovers ? form.coverCount : "",
          utm: readUtm(new URLSearchParams(window.location.search)),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not send.");
        return;
      }
      track("Contact submitted", { service: form.service || "unknown" });
      setStatus("sent");
      setForm(empty);
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setStatus("error");
      setError("Could not send.");
    }
  }

  if (status === "sent") {
    const promise = isPlaceholder(SITE.replyTime)
      ? "I'll read the brief and reply to the email you left."
      : `I'll reply within ${SITE.replyTime}.`;
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="clip-shard hairline bg-bg-elev p-8 outline-none"
      >
        <p className="label-kicker">Sent</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold">Got it.</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          {promise} If it&apos;s urgent, email{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="text-bone underline decoration-gilt/50 underline-offset-4 hover:text-volt"
          >
            {SITE.email}
          </a>
          .
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
    <form
      onSubmit={onSubmit}
      className="relative space-y-6"
      noValidate
      method="post"
      action="#"
    >
      {/* Spam honeypot: off-screen, hidden from assistive tech and the tab order. Bots fill it; people never see it. */}
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="company_website">Leave this empty</label>
        <input
          id="company_website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => update("company_website", e.target.value)}
        />
      </div>

      {referenced ? (
        <div className="clip-shard-sm hairline flex items-center gap-4 bg-bg-elev p-3">
          <Image
            src={referenced.src}
            alt=""
            width={48}
            height={68}
            sizes="48px"
            className="h-[68px] w-12 object-contain"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[0.62rem] tracking-[0.18em] text-muted uppercase">
              Reference
            </p>
            <p className="truncate text-sm text-bone">{referenced.title}</p>
          </div>
          <button
            type="button"
            onClick={() => update("ref", "")}
            className="text-[0.62rem] tracking-[0.16em] text-muted uppercase hover:text-volt"
            aria-label={`Remove reference to ${referenced.title}`}
          >
            Remove
          </button>
        </div>
      ) : null}

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
              <button
                key={opt.value}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setForm((prev) => ({ ...prev, service: opt.value, needs: [] }))
                }
                className={`cursor-pointer border px-4 py-3 text-left text-sm ${
                  on
                    ? "border-volt bg-volt/10 text-bone"
                    : "border-gilt/25 text-muted hover:border-gilt/50"
                }`}
              >
                {opt.label}
              </button>
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
                  aria-pressed={on}
                  onClick={() => toggleNeed(need)}
                  className={`cursor-pointer px-3 py-2 text-xs tracking-[0.04em] ${
                    on
                      ? "bg-ember text-bone"
                      : "border border-gilt/25 text-muted hover:text-bone"
                  }`}
                >
                  {need}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {isCovers ? (
        <fieldset>
          <legend className="text-xs tracking-[0.14em] text-muted uppercase">
            How many covers? <span className="text-faint">(optional)</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {COVER_COUNT_OPTIONS.map((opt) => {
              const on = form.coverCount === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={on}
                  onClick={() => update("coverCount", on ? "" : opt)}
                  className={`cursor-pointer px-3 py-2 text-xs tracking-[0.04em] ${
                    on
                      ? "bg-ember text-bone"
                      : "border border-gilt/25 text-muted hover:text-bone"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <label className="block text-xs tracking-[0.14em] text-muted uppercase">
        {isCovers ? "Pack / brand name" : "Brand / project name"}
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
          placeholder={
            isCovers
              ? "Genre, mood, where it'll sell, sizes you need, and any covers you like."
              : "What you need, who it's for, and any constraints."
          }
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
          placeholder={
            isCovers
              ? "Store page, previous volumes, mood boards…"
              : "Drive folder, references, existing Google Business page…"
          }
          value={form.links}
          onChange={(e) => update("links", e.target.value)}
        />
      </label>

      {status === "error" ? (
        <div
          className="clip-shard-sm border border-ember/50 bg-ember/10 p-4 text-sm"
          role="alert"
        >
          <p className="text-bone">{error}</p>
          <p className="mt-1 text-muted">
            Your brief is still here. Try again, or email it to{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-bone underline decoration-gilt/50 underline-offset-4 hover:text-volt"
            >
              {SITE.email}
            </a>
            .
          </p>
        </div>
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
