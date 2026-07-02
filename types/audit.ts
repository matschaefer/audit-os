/**
 * Core domain types for Synkro Audit OS.
 *
 * These types describe the shape of an "automation audit" performed for a
 * real estate agency: the company being audited, the raw inputs collected
 * during the audit interview, and the derived outputs (score, potential,
 * savings, recommendations) produced by the scoring engine in
 * `lib/audit-scoring.ts`.
 *
 * This file is the single source of truth for the shape of an audit and is
 * intentionally decoupled from persistence. `prisma/schema.prisma` mirrors
 * these types for the Phase 2 database layer.
 */

/** Current CRM / tooling situation of the agency. */
export type CrmTool =
  | "Kein CRM"
  | "Excel"
  | "Excel + Outlook"
  | "OnOffice"
  | "Propstack"
  | "FlowFact"
  | "Salesforce"
  | "Anderes CRM";

/** Snapshot of how leads currently move through the agency. */
export interface LeadSituation {
  /** New inbound leads per month across all channels. */
  leadsPerMonth: number;
  /** Average time until a lead receives a first reply, in hours. */
  avgResponseTimeHours: number;
  /** Viewings (Besichtigungen) scheduled per month. */
  viewingsPerMonth: number;
  /** Share of booked viewings where the prospect doesn't show up, 0-100. */
  noShowRatePercent: number;
  /** Primary CRM in use today. */
  currentCrm: CrmTool;
  /** Additional tools used alongside (or instead of) a CRM. */
  currentTools: string[];
}

/** Stable identifiers for the predefined pain point catalogue. */
export type PainPointId =
  | "slow_lead_response"
  | "manual_expose_requests"
  | "manual_appointment_scheduling"
  | "forgotten_followups"
  | "messy_crm"
  | "no_lead_prioritization"
  | "manual_recurring_emails"
  | "no_show_followup_missing"
  | "website_low_quality_leads";

/** A pain point selected (or available to select) during the audit interview. */
export interface PainPoint {
  id: PainPointId;
  label: string;
  /** Whether the agency confirmed this pain point applies to them. */
  selected: boolean;
}

/** How automated a given manual process is today. */
export type AutomationLevel = "manual" | "partially_automated" | "automated";

/** A single recurring operational process captured during the audit. */
export interface ManualProcess {
  id: string;
  name: string;
  /** How often the process is performed, per week (across the whole team). */
  frequencyPerWeek: number;
  /** Average time a single occurrence takes, in minutes. */
  durationMinutes: number;
  automationLevel: AutomationLevel;
}

/** Priority tier assigned to a generated recommendation. */
export type RecommendationPriority = "high" | "medium" | "low";

/** A prioritized automation recommendation generated from the audit data. */
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  /** Human-readable impact statement, e.g. "~18h/Monat eingespart". */
  impactEstimate: string;
  /** Pain points this recommendation directly addresses. */
  relatedPainPointIds: PainPointId[];
}

/** Financial and time-based ROI projection for an audit. */
export interface RoiCalculation {
  /** Estimated hours saved per month if recommendations are implemented. */
  monthlyTimeSavingsHours: number;
  /** Estimated monetary value of the time saved per month, in EUR. */
  monthlyCostSavingsEur: number;
  /** Fully-loaded hourly cost assumption used for the calculation, in EUR. */
  hourlyRateEur: number;
  /** Rough one-time setup investment estimate for the recommended automations, in EUR. */
  setupCostEstimateEur: number;
  /** Months until the setup cost is paid back by the monthly savings. */
  paybackPeriodMonths: number;
  /** Projected savings over 12 months, in EUR. */
  annualSavingsEur: number;
}

/** Basic company / firmographic data collected at the start of an audit. */
export interface Company {
  name: string;
  location: string;
  website: string;
  employeeCount: number;
  contactName: string;
  contactRole: string;
}

/** Derived scoring output, kept separate from raw inputs. */
export interface AuditScores {
  /** Overall health of current processes, 0 (poor) - 100 (excellent). */
  processScore: number;
  /** Share of operational work that could realistically be automated, 0-100. */
  automationPotentialPercent: number;
}

/**
 * Where a client audit sits in Synkro's internal engagement pipeline —
 * distinct from the scoring/ROI numbers, which describe the client's
 * business rather than Synkro's sales process.
 */
export type AuditStatus =
  | "draft"
  | "in_review"
  | "report_ready"
  | "proposal_sent";

/** How mature the agency's current processes are, as judged by the consultant. */
export type ProcessMaturity = "low" | "medium" | "high";

/** How much sales priority Synkro should give this opportunity. */
export type SalesPriority = "high" | "medium" | "low";

/**
 * Internal, consultant-only notes captured during and after the discovery
 * call. Never shown on the client-facing report — this is Synkro's working
 * context for preparing the engagement and the sales conversation.
 */
export interface ConsultantAssessment {
  /** Freeform notes captured during the discovery call. */
  discoveryNotes: string;
  /** Who the decision maker is and what the buying process looks like. */
  decisionMakerContext: string;
  /** Consultant's judgment of how mature the client's current processes are. */
  processMaturity: ProcessMaturity;
  /** How aggressively Synkro should pursue this opportunity. */
  salesPriority: SalesPriority;
  /** Recommended angle/argument for the sales conversation. */
  salesAngle: string;
  /** The single next action Synkro should take on this account. */
  recommendedNextStep: string;
}

/**
 * What the client is primarily trying to achieve. Drives the Synkro offer
 * recommendation — e.g. wanting more listings (seller leads) points at a
 * fundamentally different offer than wanting faster buyer-lead handling.
 */
export type BusinessGoal =
  | "more_seller_leads"
  | "faster_lead_handling"
  | "reduce_admin_work"
  | "full_process_optimization";

/** Rough judgment of the client's current website/landing page as a lead source. */
export type WebsiteQuality = "none" | "weak" | "solid";

/**
 * Minimal additional context used only for matching the client to a Synkro
 * offer. Kept deliberately small (two fields) so the intake form doesn't
 * grow unnecessarily beyond what the audit itself already captures.
 */
export interface BusinessContext {
  businessGoal: BusinessGoal;
  websiteQuality: WebsiteQuality;
}

/**
 * A complete automation audit: inputs collected during the interview plus
 * the derived scoring, recommendations, ROI calculation, and Synkro's
 * internal assessment of the opportunity.
 */
export interface Audit {
  id: string;
  status: AuditStatus;
  createdAt: string;
  company: Company;
  leadSituation: LeadSituation;
  painPoints: PainPoint[];
  manualProcesses: ManualProcess[];
  scores: AuditScores;
  recommendations: Recommendation[];
  roiCalculation: RoiCalculation;
  consultantAssessment: ConsultantAssessment;
  businessContext: BusinessContext;
}

/** Lightweight projection of an Audit used in workspace list views. */
export type AuditSummary = Pick<
  Audit,
  "id" | "status" | "createdAt" | "scores" | "roiCalculation"
> & {
  companyName: string;
  companyLocation: string;
  salesPriority: SalesPriority;
  /** Name of the top-ranked Synkro offer recommendation, for quick scanning in lists. */
  recommendedOfferName: string;
};

/** Which Synkro product tier an offer belongs to. */
export type OfferType = "audit" | "core" | "add-on" | "custom";

/** A Synkro service/product offering, used internally to match against audits. */
export interface SynkroOffer {
  id: string;
  name: string;
  type: OfferType;
  /** e.g. "ab 1.490 € einmalig" or "Individuelles Angebot". */
  setupPriceLabel: string;
  /** e.g. "ab 490 €/Monat" or "Auf Anfrage". */
  monthlyPriceLabel: string;
  shortDescription: string;
  bestFor: string[];
  includedItems: string[];
  /** High-level workflow the offer automates, e.g. ["Lead", "CRM", "E-Mail", "Termin"]. */
  workflowSteps: string[];
  /** Recommended argument for the sales conversation. */
  salesAngle: string;
  implementationTime: string;
  /** One-line summary of the situation this offer is built for. */
  priorityUseCase: string;
}

/** How strongly Synkro should pursue attaching this offer to the account. */
export type RecommendationType = "primary" | "secondary" | "notRecommended";

/** Result of matching one Synkro offer against a single audit. */
export interface OfferRecommendation {
  offer: SynkroOffer;
  /** How well the offer fits the audited business, 0-100. */
  fitScore: number;
  recommendationType: RecommendationType;
  /** Why this offer was matched, grounded in concrete audit signals. */
  reasons: string[];
  /** Which of the client's reported problems this offer addresses. */
  solvedProblems: string[];
  /** Plain-language description of the expected outcome. */
  expectedImpact: string;
  /** Internal-only framing for how to pitch this in the sales conversation. */
  internalSalesNote: string;
}
