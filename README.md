# Synkro Audit OS

An internal consultant workspace for Synkro — a company that helps German real estate agencies get more qualified viewings and reduce administrative overhead through automation. This tool is what a Synkro consultant uses to run an automation audit for a client agency: capture the discovery call, score the agency's automation potential, calculate ROI, get a matched service recommendation from Synkro's catalogue, and prepare a client-ready report.

Built as both an internal operations tool and a portfolio demonstration of full-stack product engineering — a public, fictional-data-only build of this same codebase is deployed for that purpose (see [Public Demo vs. Private App](#public-demo-vs-private-app)).

## Problem

Real estate agencies lose qualified leads to slow response times, manual exposé handling, forgotten follow-ups, and CRM tooling that's really just a shared spreadsheet. Synkro sells automation services to fix this, but every sales conversation starts the same way: a consultant needs to quickly assess how bad the problem actually is, put a number on the opportunity, and know which of Synkro's offers actually fits — all in a way that's defensible in front of the client, not a black box.

## Lösung

Synkro Audit OS turns that discovery call into a structured audit: a short intake form captures the agency's lead situation, pain points, and manual processes, which a transparent, rule-based scoring engine turns into a process health score, an automation potential percentage, and a monthly time/cost savings estimate. A second rule-based engine matches the audit against Synkro's real service catalogue and produces a primary recommendation with a fit score, sales-facing reasoning, and an internal-only sales note — so a consultant always knows *why* a number or recommendation came out the way it did.

## Features

- **Audit intake** — company data, lead situation (response time, no-shows, CRM), pain points, and recurring manual processes
- **Transparent scoring** — a rule-based process score and automation potential percentage, not a black box
- **ROI calculation** — estimated monthly time/cost savings, setup investment, and payback period
- **Offer matching** — ranks Synkro's real service catalogue against the audit and returns a primary + secondary recommendation with fit scores and sales-facing reasoning
- **Sales pipeline tracking** — every audit carries an internal status (Draft → In Review → Report Ready → Proposal Sent) and a consultant-only assessment, kept separate from the client-facing report
- **Client report preview** — an executive summary, findings, ROI table, and rollout plan, ready to present
- **Interactive public demo** — `/audits/new` runs the real scoring and offer-matching engines live in the browser against fictional data, with no persistence

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) with a custom Synkro design system (`app/globals.css`)
- Hand-built UI primitives in `components/ui/` (no external component library)
- [Clerk](https://clerk.com) for authentication, gated by deployment mode (see below)
- [Prisma](https://www.prisma.io) schema prepared for PostgreSQL (`prisma/schema.prisma`) — not yet wired up, see [Roadmap](#roadmap)
- [Vitest](https://vitest.dev) for unit tests of the scoring and offer-matching engines
- GitHub Actions CI (`.github/workflows/ci.yml`): install → lint → test → build

## Public Demo vs. Private App

This codebase is deployed two different ways from the same source, switched by a single env var: `NEXT_PUBLIC_APP_ENV`.

**Public Demo** — `NEXT_PUBLIC_APP_ENV=demo` (the default)
- Login is optional. Every route, including the workspace, is reachable without signing in.
- A "Demo ohne Login ansehen" button on `/` leads straight into the workspace; signing in is available but never required.
- All data is the fictional seed dataset in `lib/demo-data.ts`. `/audits/new` runs the real scoring engine live in the browser but never persists anything.
- Intended for GitHub, recruiters, and client-facing product demos. **Never put real customer data in this build.**

**Private App** — `NEXT_PUBLIC_APP_ENV=production`
- Only `/` is public. Every workspace route (`/dashboard`, `/audits`, `/audits/new`, `/audits/[id]`, `/audits/[id]/report`, `/reports`, `/settings`, `/demo`) requires a signed-in Clerk user — enforced in `proxy.ts` (Next.js 16's replacement for the `middleware.ts` convention), not just hidden in the UI.
- The landing page shows only a sign-in action; there is no "skip login" path into the workspace.
- Intended for Synkro's actual internal usage once a private database is wired up (see [Roadmap](#roadmap)).

Without Clerk keys configured, both `ClerkProvider` and the proxy middleware degrade to a no-op instead of crashing the build — the `/settings` page surfaces this state as a calm "Anmeldung nicht konfiguriert" status rather than an error. This makes it possible to run and preview the repo locally without setting up a Clerk project first, but it also means **route protection only actually happens once real keys are configured.**

## Privacy-safe demo

This repository uses fictional demo data only — fictional company names, fictional contacts, no real audits or customer records. There is no real database or persistence in either deployment mode. Real customer usage is only intended for the Private App once it has its own login-gated database; the public build exists purely to demonstrate the product and the engineering behind it.

## Architekturüberblick

```
types/audit.ts        →  single source of truth for the audit domain model
        ↓
lib/audit-scoring.ts  →  pure scoring functions (process score, potential, ROI, recommendations)
lib/offer-matching.ts →  pure offer-matching functions (fit score, reasons, sales note)
        ↓
components/audit/     →  score gauges, offer recommendation panel, report sections
components/audit/form →  the multi-section intake form + live results preview
        ↓
app/                  →  route handlers composing the above into pages
proxy.ts              →  Clerk auth gate, mode-aware (see Public Demo vs. Private App)
```

The scoring and offer-matching layers are plain, dependency-free TypeScript functions — they don't touch React, the database, or each other's internals — which is what makes them straightforward to unit test (`lib/*.test.ts`) and safe to reuse identically from the demo dataset, the live intake form, and (eventually) a server action.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables or database are required to run the app — without Clerk keys, auth simply degrades to a no-op and the workspace runs entirely on the in-memory demo dataset in `lib/demo-data.ts`.

## Environment variables

See `.env.example` for a copy-pasteable template. Never commit real secrets — this file only ever contains placeholders.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | No (defaults to `demo`) | `demo` = public, login optional. `production` = Private App, login required for all workspace routes. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | No | Clerk publishable key. Safe for the client bundle. Without it, auth degrades to a no-op. |
| `CLERK_SECRET_KEY` | No | Clerk secret key. Must never be exposed to the browser or carry a `NEXT_PUBLIC_` prefix. |
| `DATABASE_URL` | No (not yet used) | Reserved for the Phase 2 Prisma/PostgreSQL setup. No database is wired up yet. |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |
| `npm test` | Run the Vitest suite for `lib/audit-scoring.ts` and `lib/offer-matching.ts` |

## Workspace structure

| Route | Purpose |
| --- | --- |
| `/` | Public entry screen / portfolio landing page |
| `/dashboard` | Workspace overview: KPIs, pipeline, high-potential opportunities |
| `/audits` | Full list of client audits |
| `/audits/new` | Interactive demo audit flow — live scoring preview, no persistence |
| `/audits/[id]` | Consultant view of a single audit (internal assessment, scores, recommendations) |
| `/audits/[id]/report` | Client-facing report preview |
| `/reports` | Reports that have reached "Report Ready" or "Proposal Sent" |
| `/demo` | Redirects to the flagship demo audit |
| `/settings` | Workspace mode, privacy, auth, storage, and readiness overview |

## Project structure

```
app/
  page.tsx                  Public entry screen
  dashboard/                Workspace overview
  audits/                   Audit list, creation form, detail view, report
  reports/                  Reports ready for client review
  settings/                 Workspace mode / privacy / auth / storage overview
  demo/                     Redirects to the flagship demo audit

components/
  ui/                       Design-system primitives (Button, Card, Badge, ...)
  layout/                   App shell: sidebar, mobile nav, internal chrome strip
  landing/                  Entry screen sections
  dashboard/                KPI cards, pipeline overview, audit/report lists
  audit/                    Score gauges, pain points, process table, internal assessment
  audit/form/               Multi-section audit intake form + live demo results preview
  report/                   Report sections, ROI table, implementation timeline
  shared/                   Small cross-cutting components (e.g. Demo Data badge)

lib/
  audit-scoring.ts          Core scoring engine (process score, automation potential, ROI, recommendations)
  offer-matching.ts         Matches an audit against Synkro's service catalogue
  audit-scoring.test.ts     Vitest unit tests for the scoring engine
  offer-matching.test.ts    Vitest unit tests for the offer-matching engine
  report-narrative.ts       Rule-based text generation for the report's prose sections
  demo-data.ts              Seed audits with pipeline status + consultant assessments
  synkro-offers.ts          Synkro's real service catalogue
  constants.ts              Pain point catalogue, CRM options, status/priority labels
  app-env.ts                Deployment mode (demo/production) + Clerk-configured flag
  format.ts / utils.ts      Formatting helpers, Tailwind class merging

types/audit.ts              Single source of truth for the audit domain model
prisma/schema.prisma        Phase 2 database schema (mirrors types/audit.ts)
proxy.ts                    Clerk auth gate (Next.js 16's middleware.ts replacement)
```

## The scoring engine

All business logic lives in [`lib/audit-scoring.ts`](lib/audit-scoring.ts) and [`lib/offer-matching.ts`](lib/offer-matching.ts), intentionally simple, transparent, and unit-tested rather than a black box — every number on a report needs to be explainable in a client conversation:

- `calculateProcessScore` — starts at 100 and subtracts penalties for pain points, slow response times, high no-show rates, weak CRM tooling, and manual processes.
- `calculateAutomationPotential` — a baseline plus additive potential from the same signals, expressed as a percentage.
- `calculateMonthlyTimeSavings` / `calculateRoi` — converts process friction into hours and EUR, and derives a payback period.
- `generateRecommendations` — a small rule set that maps confirmed pain points and thresholds to concrete, prioritized automation measures.
- `recommendSynkroOffers` — ranks every Synkro offer against the audit and returns a primary/secondary/not-recommended verdict with a 0–100 fit score and grounded reasoning.

`runAuditScoring()` composes the scoring pipeline into a single entry point used by both the demo dataset and the live audit form, so every audit in the workspace — seeded or user-entered — is scored identically. Run `npm test` to exercise both engines against edge cases (empty data, extreme values, determinism).

## Roadmap

Phase 1 intentionally ships without a backend so the product story and UI quality could be the focus. Phase 2 adds:

- Persistent storage via the prepared Prisma schema + PostgreSQL, scoped to signed-in users in Private App mode
- Saving audits created through `/audits/new` (currently a live, in-browser scoring preview only)
- Role-based access control for multiple consultants
- GDPR-conscious data handling once real customer data is stored (retention, deletion, data processing agreement with Clerk/hosting)
- AI-generated report copy (swapping `lib/report-narrative.ts` for an LLM call, same function signatures)
- PDF export of the report
- Deployment to Vercel

## Screenshots

_No screenshots yet — this section is a placeholder. Add real screenshots of the public demo here once available; do not add real customer screenshots._

## License

Internal Synkro project. Not licensed for reuse.
