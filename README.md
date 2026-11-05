# Lead Chain Demo

A portfolio demo for a fictional painting company, **Fern & Finch Painting**.
A website form sends each inquiry through an automation: Claude classifies it, a human approves it in Telegram, and only then the contact is saved in HubSpot.

Live demo: https://lead-chain-demo.vercel.app

## Flow

1. **Form** (`components/LeadForm.tsx`): visitor sends name, email, phone and message. A hidden honeypot field catches bots.
2. **API route** (`app/api/lead/route.ts`): validates input, rate-limits per instance and forwards the lead to an n8n webhook with a shared secret.
3. **n8n workflow** (`workflow/lead-chain.json`):
   - validates required fields
   - classifies the inquiry with Claude (category, urgency, summary, missing information)
   - falls back to manual review if the AI call fails
   - stores the lead in a data table
   - asks for approval in Telegram
   - on approval, upserts the contact in HubSpot
4. **Response**: the visitor gets a reference ID.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in N8N_WEBHOOK_URL and N8N_WEBHOOK_SECRET
npm run dev
```

Without both variables, the API answers with "not connected yet" (HTTP 503).

## Environment variables

| Name | Purpose |
| --- | --- |
| `N8N_WEBHOOK_URL` | Production URL of the n8n webhook |
| `N8N_WEBHOOK_SECRET` | Sent as `X-Webhook-Secret`; must match the webhook's header auth |

## Notes

- The company is fictional. Please use test data only.
- The rate limit is per server instance and is a best-effort demo guard, not a hard limit.
- Stack: Next.js, Tailwind CSS, n8n, Claude (Anthropic), Telegram, HubSpot, Vercel.
