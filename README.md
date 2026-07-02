# Synkro Audit OS

Synkro Audit OS is Synkro's **internal consultant workspace** for preparing, running, and evaluating automation audits for real estate agency clients. It's not a public self-service SaaS product — it's the tool a Synkro consultant uses to capture a discovery call, score a client's automation potential, track the opportunity through the sales pipeline, and generate a client-ready report.

Built as both an internal operations tool and a demonstration of full-stack product engineering.

## What it does

1. **Capture** — company data, lead situation (response time, no-show rate, CRM), pain points, recurring manual processes, and internal discovery-call notes for a client.
2. **Score** — a transparent, rule-based scoring engine calculates a process health score and an automation potential percentage.
3. **Calculate ROI** — estimated monthly time savings, cost savings, setup investment, and payback period.
4. **Recommend** — a prioritized, pain-point-driven list of concrete automation measures.
5. **Track** — every audit carries an internal pipeline status (Draft → In Review → Report Ready → Proposal Sent) and a consultant-only assessment (sales priority, sales angle, recommended next step) that never appears on the client report.
6. **Report** — a professional, client-facing report with an executive summary, findings, ROI table, and a 14-day rollout plan, clearly framed as an internal export preview.

Try it live: `/demo` opens the flagship worked example (a fictional Düsseldorf agency), or open `/audits/new` to run the scoring engine against your own numbers.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) with a custom Synkro design system (`app/globals.css`)
- Hand-built UI primitives in `components/ui/` (no external component library dependency)
- [Prisma](https://www.prisma.io) schema prepared for PostgreSQL (`prisma/schema.prisma`) — not yet wired up, see [Roadmap](#roadmap)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables or database are required — Phase 1 runs entirely on the in-memory demo dataset in `lib/demo-data.ts`.

## Workspace structure

| Route | Purpose |
| --- | --- |
| `/` | Internal entry screen (not a marketing page) |
| `/dashboard` | Workspace overview: KPIs, pipeline, high-potential opportunities, next actions |
| `/audits` | Full list of client audits |
| `/audits/new` | Create a client audit — discovery-call intake form with a live scoring preview |
| `/audits/[id]` | Consultant view of a single audit (internal assessment, scores, recommendations) |
| `/audits/[id]/report` | Client-facing report preview, ready for export |
| `/reports` | Reports that have reached "Report Ready" or "Proposal Sent" |
| `/demo` | Redirects to the flagship demo client |
| `/settings` | Workspace settings placeholders (Phase 2) |

## Project structure

```
app/
  page.tsx                  Internal entry screen
  dashboard/                Workspace overview
  audits/                   Audit list, creation form, detail view, report
  reports/                  Reports ready for client review
  settings/                 Settings placeholders
  demo/                     Redirects to the flagship demo audit

components/
  ui/                       Design-system primitives (Button, Card, Badge, ...)
  layout/                   App shell: sidebar, mobile nav, internal chrome strip
  landing/                  Entry screen sections
  dashboard/                KPI cards, pipeline overview, audit/report lists
  audit/                    Score gauges, pain points, process table, internal assessment
  audit/form/               Multi-section audit intake form incl. consultant context
  report/                   Report sections, ROI table, implementation timeline
  shared/                   Small cross-cutting components (e.g. Demo Data badge)

lib/
  audit-scoring.ts          Core scoring engine (process score, automation potential, ROI, recommendations)
  report-narrative.ts       Rule-based text generation for the report's prose sections
  demo-data.ts              Seed audits with pipeline status + consultant assessments
  constants.ts              Pain point catalogue, CRM options, status/priority labels
  format.ts / utils.ts      Formatting helpers, Tailwind class merging

types/audit.ts              Single source of truth for the audit domain model
prisma/schema.prisma        Phase 2 database schema (mirrors types/audit.ts)
```

## The scoring engine

All business logic lives in [`lib/audit-scoring.ts`](lib/audit-scoring.ts) and is intentionally simple, transparent, and unit-testable rather than a black box — every number on a report needs to be explainable in a client conversation:

- `calculateProcessScore` — starts at 100 and subtracts penalties for pain points, slow response times, high no-show rates, weak CRM tooling, and manual processes.
- `calculateAutomationPotential` — a baseline plus additive potential from the same signals, expressed as a percentage.
- `calculateMonthlyTimeSavings` — combines automatable time across recurring manual processes, lead-response friction, and no-show follow-up overhead.
- `calculateRoi` — converts time savings into EUR, estimates setup cost from the generated recommendations, and derives a payback period.
- `generateRecommendations` — a small rule set that maps confirmed pain points and thresholds to concrete, prioritized automation measures.

`runAuditScoring()` composes all of the above into a single entry point used by both the demo dataset and the live audit form, so every audit in the workspace — seeded or user-entered — is scored identically. Pipeline status and the consultant assessment (sales priority, sales angle, next step) are tracked separately from this scoring output, since they describe Synkro's sales process rather than the client's business.

## Roadmap (Phase 2)

Phase 1 intentionally ships without a backend so the product story and UI quality could be the focus. Phase 2 adds:

- Persistent storage via the prepared Prisma schema + PostgreSQL
- Saving audits created through `/audits/new` (currently a live, in-browser scoring preview only)
- AI-generated report copy (swapping `lib/report-narrative.ts` for an LLM call, same function signatures)
- PDF export of the report
- Authentication (Clerk or Better Auth) and a read-only view for invited clients
- Deployment to Vercel

## License

Internal Synkro project. Not licensed for reuse.
