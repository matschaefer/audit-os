# Audit OS

**Internal automation audit workspace for real estate agencies.**

Audit OS is a fullstack-ready portfolio project that demonstrates how an internal consulting tool can be used to prepare automation audits, evaluate process inefficiencies, calculate ROI potential, recommend suitable service packages and generate client-ready report previews.

The public version of this project is a **privacy-safe demo** using fictional data only.

---

## Overview

Audit OS was designed for **Synkro**, an AI process optimization business focused on real estate agencies in Germany.

The tool helps consultants analyze how a real estate agency handles leads, appointments, follow-ups, CRM workflows and administrative tasks. Based on the collected audit data, the system calculates automation potential, estimates monthly savings and recommends the most suitable Synkro offer.

This is not a generic CRUD dashboard. The focus is on domain-specific business logic, internal workflow design, privacy-aware demo architecture and a clear separation between public demo mode and private production usage.

---

## Problem

Real estate agencies often lose time and revenue through manual processes:

- Slow lead response times
- Manual exposure requests
- Inefficient appointment coordination
- Forgotten follow-ups
- No-show appointments
- Unstructured CRM usage
- Repetitive administrative work
- Weak lead qualification

These issues make it difficult to react quickly, convert leads efficiently and scale operations without increasing manual workload.

---

## Solution

Audit OS provides an internal workspace to:

- Capture client audit information
- Analyze process pain points
- Calculate automation potential
- Estimate time and cost savings
- Recommend matching Synkro offers
- Prepare client-facing report previews
- Demonstrate an audit workflow without exposing real customer data

---

## Key Features

### Audit Workspace

Manage fictional demo audits through an internal consultant-style workspace.

- Audit pipeline overview
- Client audit detail pages
- Report preview pages
- Demo customer profile
- Internal recommendation view

### Interactive Demo Audit Flow

The public demo includes an interactive audit form.

- Multi-section audit input
- Local demo calculation
- No server persistence
- No database write
- No real customer data required
- Simulated audit result preview

### Scoring Engine

A deterministic scoring layer evaluates automation potential based on audit data.

Examples of evaluated factors:

- Monthly lead volume
- Average response time
- No-show rate
- CRM maturity
- Manual process workload
- Selected pain points
- Current tools and process maturity

### ROI Calculation

The system estimates potential business impact.

- Monthly time savings
- Estimated cost savings
- Process efficiency score
- Automation potential percentage

### Offer Matching

Audit OS maps audit findings to suitable Synkro service offers.

Example recommendations:

- Lead & Terminprozess
- Verkäufergewinnung
- E-Mail & WhatsApp Nurturing
- CRM & Prozessoptimierung
- Websites & Landingpages

Each recommendation includes:

- Fit score
- Recommendation type
- Matching reasons
- Solved problems
- Expected impact
- Internal sales note

### Report Preview

The report page shows how a client-facing audit result could be prepared.

Sections include:

- Executive Summary
- Ausgangssituation
- Erkannte Prozessprobleme
- Automatisierungspotenziale
- Empfohlener Maßnahmenplan
- ROI-Kalkulation
- 14-Tage-Umsetzungsplan
- Nächster Schritt

### Public Demo / Private App Modes

The app is designed with two deployment modes:

#### Public Demo

Used for GitHub, portfolio, recruiter review and client demos.

- Login optional
- Demo usable without login
- Fictional data only
- No real persistence
- No real customer data
- Publicly deployable

#### Private App

Prepared for future internal production usage.

- Landing page public
- Workspace routes protected
- Clerk login required
- Private database planned
- Real customer data only after authentication
- GDPR/DSGVO setup required before production use

---

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Component-based UI architecture

### Authentication

- Clerk
- Optional login in public demo mode
- Prepared route protection for private production mode

### Business Logic

- Custom audit scoring engine
- ROI calculation logic
- Offer matching logic
- Demo/production environment handling

### Data Layer

- Fictional demo data for the public version
- Prisma schema prepared for future private database usage
- PostgreSQL planned for private production deployment

### Quality & Tooling

- ESLint
- TypeScript validation through Next.js build
- Vitest tests for business logic
- GitHub Actions CI
- Environment-based deployment modes

---

## Architecture

```txt
app/
├── page.tsx                  # Public landing page
├── dashboard/                # Internal workspace dashboard
├── audits/
│   ├── new/                  # Interactive demo audit flow
│   └── [id]/
│       ├── page.tsx          # Audit detail view
│       └── report/           # Client-facing report preview
├── demo/                     # Demo client redirect/view
└── settings/                 # Workspace settings

components/
├── audit/                    # Audit-specific UI
├── dashboard/                # Dashboard components
├── landing/                  # Landing page sections
├── report/                   # Report preview components
└── ui/                       # Reusable UI primitives

lib/
├── audit-scoring.ts          # Scoring and ROI logic
├── offer-matching.ts         # Synkro offer recommendation logic
├── synkro-offers.ts          # Structured Synkro offer data
├── demo-data.ts              # Fictional demo data
├── app-env.ts                # Demo/production mode helpers
└── utils.ts

types/
└── audit.ts                  # Domain types

prisma/
└── schema.prisma             # Prepared schema for private version

.github/
└── workflows/
    └── ci.yml                # CI workflow
