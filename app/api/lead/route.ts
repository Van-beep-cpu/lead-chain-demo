import { NextResponse } from "next/server";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_LENGTH = { name: 100, email: 150, phone: 40, message: 2000 };
const hits = new Map<string, number[]>();

// Best effort per server instance: enough for a public demo, not a hard limit.
function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const url = process.env.N8N_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!url || !secret) {
    return NextResponse.json({ error: "The demo form is not connected yet." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const data = await request.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot: bots fill the hidden field, so answer normally and drop the lead.
  if (data.website) return NextResponse.json({ success: true });

  const lead = {
    name: text(data.name, MAX_LENGTH.name),
    email: text(data.email, MAX_LENGTH.email),
    phone: text(data.phone, MAX_LENGTH.phone),
    message: text(data.message, MAX_LENGTH.message),
  };
  if (!lead.name || !lead.email.includes("@") || !lead.message) {
    return NextResponse.json({ error: "Please add your name, a valid email and a message." }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Webhook-Secret": secret },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
    const result = await response.json();
    return NextResponse.json({ success: true, reference: result.reference_id });
  } catch (error) {
    console.error("Lead delivery failed", error);
    return NextResponse.json({ error: "We could not send your request. Please try again." }, { status: 502 });
  }
}
