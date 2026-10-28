"use client";

import { track } from "@vercel/analytics";
import { useId, useState } from "react";
import { TOPIC_KEYS, TOPICS, type TopicKey } from "@/lib/email/topics";

/**
 * Sign-up for the newsletter and the work-updates list. `tone` matches the
 * ground it sits on: ink in the footer, paper on reading pages.
 */
export function SubscribeForm({ tone = "paper" }: { tone?: "ink" | "paper" }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [topics, setTopics] = useState<TopicKey[]>([...TOPIC_KEYS]);
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const onInk = tone === "ink";
  const muted = onInk ? "text-stone" : "text-slate";

  function toggle(key: TopicKey) {
    setTopics((prev) => (prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setError("Please add a valid email.");
      return;
    }
    if (!topics.length) {
      setStatus("error");
      setError("Pick at least one thing to hear about.");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topics, company_website: trap }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not sign you up. Try again later.");
        return;
      }
      track("Subscribed", { topics: topics.join("+") });
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Could not sign you up. Try again later.");
    }
  }

  if (status === "sent") {
    return (
      <div role="status">
        <p className="text-xl font-bold">You&apos;re on the list.</p>
        <p className={`mt-2 ${muted}`}>A welcome email is on its way to {email}.</p>
      </div>
    );
  }

  const field = onInk
    ? "border-line bg-ink-2 text-paper placeholder:text-stone focus:border-paper"
    : "border-field bg-card text-ink placeholder:text-slate focus:border-ink";

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-4">
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Company website</label>
        <input
          id={`${id}-website`}
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">What to send you</legend>
        {TOPIC_KEYS.map((key) => (
          <label key={key} className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={topics.includes(key)}
              onChange={() => toggle(key)}
              className="mt-1 size-4.5 shrink-0 cursor-pointer accent-signal"
            />
            <span>
              <span className="font-semibold">{TOPICS[key].label}</span>
              <span className={`block text-[0.9375rem] ${muted}`}>{TOPICS[key].hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email
        </label>
        <input
          id={`${id}-email`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`min-h-13 w-full min-w-0 flex-1 border px-4 py-3 text-[1.0625rem] ${field}`}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-signal min-h-13 shrink-0 disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? "Signing up…" : "Sign up"}
        </button>
      </div>

      {status === "error" ? (
        <p className={`font-medium ${onInk ? "text-signal" : "text-signal-ink"}`} role="alert">
          {error}
        </p>
      ) : (
        <p className={`text-sm ${muted}`}>No spam. Unsubscribe from either list in one click.</p>
      )}
    </form>
  );
}
