"use client";

import { FormEvent, useState } from "react";

type State = { status: "idle" | "sending" | "sent" | "error"; note?: string };

const fieldClass =
  "mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-base outline-none focus:border-fern focus:ring-2 focus:ring-fern/20";

export function LeadForm() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState({ status: "sending" });
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    }).catch(() => null);
    const result = await response?.json().catch(() => null);
    if (response?.ok) {
      form.reset();
      setState({ status: "sent", note: result?.reference });
    } else {
      setState({ status: "error", note: result?.error ?? "Something went wrong. Please try again." });
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-white/70 p-5 sm:p-7">
      <h2 className="text-2xl">Ask for a quote</h2>
      <p className="mt-1 text-sm text-ink/70">Demo form. Please use test data, not real personal details. Requests are processed by n8n, Anthropic, Telegram and HubSpot.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Name
          <input name="name" required maxLength={100} autoComplete="name" className={fieldClass} />
        </label>
        <label className="text-sm font-medium">Email
          <input name="email" type="email" required maxLength={150} autoComplete="email" className={fieldClass} />
        </label>
      </div>
      <label className="mt-4 block text-sm font-medium">Phone (optional)
        <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={fieldClass} />
      </label>
      <label className="mt-4 block text-sm font-medium">What do you need painted?
        <textarea name="message" required maxLength={2000} rows={5} className={fieldClass} />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <button
        disabled={state.status === "sending"}
        className="mt-5 w-full rounded bg-fern px-5 py-3 font-medium text-white transition hover:bg-ink disabled:opacity-60"
      >
        {state.status === "sending" ? "Sending…" : "Send request"}
      </button>
      <div aria-live="polite" className="mt-3 text-sm">
        {state.status === "sent" && (
          <p className="text-fern">Thanks, your request arrived.{state.note ? ` Reference: ${state.note}` : ""}</p>
        )}
        {state.status === "error" && <p className="text-clay">{state.note}</p>}
      </div>
    </form>
  );
}
