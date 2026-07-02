/**
 * Synkro Audit OS scoring engine.
 *
 * Pure, deterministic functions that turn raw audit inputs (company data,
 * lead situation, pain points, manual processes) into the derived outputs
 * shown throughout the product: a process health score, an automation
 * potential percentage, time/cost savings, a ROI calculation and a
 * prioritized list of recommendations.
 *
 * None of these functions touch the database or UI — they take plain data
 * in and return plain data out, which keeps the rules easy to read, easy to
 * unit test, and safe to reuse from the audit form, the demo data, and
 * (later) a server action.
 *
 * The weights below are intentionally simple and transparent rather than
 * statistically rigorous: this is a sales/consulting tool, so every number
 * on the report needs to be explainable in a client conversation.
 */

import { painPointLabel } from "@/lib/constants";
import { formatHours } from "@/lib/format";
import type {
  AuditScores,
  Company,
  CrmTool,
  LeadSituation,
  ManualProcess,
  PainPoint,
  Recommendation,
  RecommendationPriority,
  RoiCalculation,
} from "@/types/audit";

/** All raw inputs the scoring engine needs. Mirrors the audit form sections. */
export interface AuditScoringInput {
  company: Company;
  leadSituation: LeadSituation;
  painPoints: PainPoint[];
  manualProcesses: ManualProcess[];
}

const AVG_WEEKS_PER_MONTH = 4.33;

/** Fully-loaded assumed cost of one hour of team time, used for EUR conversions. */
export const DEFAULT_HOURLY_RATE_EUR = 35;

/** How much of a CRM-quality penalty/potential each tool represents. Higher = worse. */
const CRM_FRICTION_SCORE: Record<CrmTool, number> = {
  "Kein CRM": 1,
  Excel: 0.85,
  "Excel + Outlook": 0.75,
  "Anderes CRM": 0.4,
  OnOffice: 0.15,
  Propstack: 0.15,
  FlowFact: 0.15,
  Salesforce: 0.1,
};

/** Share of time considered realistically automatable, per current automation level. */
const AUTOMATABLE_SHARE: Record<ManualProcess["automationLevel"], number> = {
  manual: 0.7,
  partially_automated: 0.35,
  automated: 0.05,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function selectedPainPoints(painPoints: PainPoint[]): PainPoint[] {
  return painPoints.filter((p) => p.selected);
}

/**
 * Overall health of the agency's current processes, 0 (chaotic) - 100
 * (excellent). Starts at a perfect score and subtracts penalties for each
 * signal of friction. This is the inverse framing of automation potential:
 * a business can score low here (bad process hygiene) while still having
 * high automation potential (a lot to gain from fixing it).
 */
export function calculateProcessScore(input: AuditScoringInput): number {
  const { leadSituation, painPoints, manualProcesses } = input;
  let score = 100;

  // Every confirmed pain point is a concrete symptom of a broken process.
  score -= selectedPainPoints(painPoints).length * 3;

  // Slow first response is one of the strongest predictors of lost leads.
  if (leadSituation.avgResponseTimeHours > 24) score -= 20;
  else if (leadSituation.avgResponseTimeHours > 12) score -= 14;
  else if (leadSituation.avgResponseTimeHours > 6) score -= 8;
  else if (leadSituation.avgResponseTimeHours > 2) score -= 4;

  // High no-show rates indicate weak confirmation/reminder processes.
  if (leadSituation.noShowRatePercent >= 20) score -= 12;
  else if (leadSituation.noShowRatePercent >= 10) score -= 6;

  // Spreadsheets-as-CRM is a strong structural signal of manual overhead.
  score -= CRM_FRICTION_SCORE[leadSituation.currentCrm] * 15;

  // Processes still run fully manually drag the score down further.
  const manualCount = manualProcesses.filter(
    (p) => p.automationLevel === "manual",
  ).length;
  score -= Math.min(20, manualCount * 2);

  return Math.round(clamp(score, 0, 100));
}

/**
 * Share of the agency's operational workload that could realistically be
 * automated with Synkro-style workflows, 0-100. Every business has *some*
 * baseline potential (nobody is perfectly optimized), which grows with the
 * concrete friction signals collected during the audit.
 */
export function calculateAutomationPotential(
  input: AuditScoringInput,
): number {
  const { leadSituation, painPoints, manualProcesses } = input;
  let potential = 20; // baseline: every agency has some automatable surface area

  // Slower response times mean more of the reply/routing workflow is manual.
  potential += clamp(leadSituation.avgResponseTimeHours * 1.2, 0, 25);

  // No-shows point directly at missing automated reminders/re-engagement.
  potential += clamp(leadSituation.noShowRatePercent * 0.6, 0, 15);

  // Weak CRM tooling means more manual data entry and follow-up tracking.
  potential += CRM_FRICTION_SCORE[leadSituation.currentCrm] * 15;

  // Each confirmed pain point adds concrete, addressable potential.
  potential += Math.min(20, selectedPainPoints(painPoints).length * 3);

  // A workflow that's mostly still manual has more room to automate.
  if (manualProcesses.length > 0) {
    const manualShare =
      manualProcesses.filter((p) => p.automationLevel === "manual").length /
      manualProcesses.length;
    potential += manualShare * 20;
  }

  return Math.round(clamp(potential, 0, 100));
}

export function buildAuditScores(input: AuditScoringInput): AuditScores {
  return {
    processScore: calculateProcessScore(input),
    automationPotentialPercent: calculateAutomationPotential(input),
  };
}

/**
 * Estimated hours per month the agency could get back by automating.
 * Combines three independent sources of time drain:
 *  1. Manual/partially-automated recurring processes (the bulk of the estimate).
 *  2. Manual chasing/context-switching caused by a slow first response.
 *  3. Manual re-engagement calls for no-show viewings.
 */
export function calculateMonthlyTimeSavings(
  input: AuditScoringInput,
): number {
  const { leadSituation, manualProcesses } = input;

  const processSavingsHours = manualProcesses.reduce((total, process) => {
    const weeklyMinutes = process.frequencyPerWeek * process.durationMinutes;
    const automatableMinutes =
      weeklyMinutes * AUTOMATABLE_SHARE[process.automationLevel];
    return total + (automatableMinutes * AVG_WEEKS_PER_MONTH) / 60;
  }, 0);

  // Minutes of avoidable manual chasing per lead, capped at 15 min/lead,
  // scaling with how far the response time is from a healthy <1h baseline.
  const responsePenaltyMinutesPerLead = clamp(
    leadSituation.avgResponseTimeHours * 0.5,
    0,
    15,
  );
  const leadResponseSavingsHours =
    (leadSituation.leadsPerMonth * responsePenaltyMinutesPerLead) / 60;

  // Assume 10 minutes of manual re-engagement work saved per automated no-show follow-up.
  const noShowCount =
    leadSituation.viewingsPerMonth * (leadSituation.noShowRatePercent / 100);
  const noShowSavingsHours = (noShowCount * 10) / 60;

  const totalHours =
    processSavingsHours + leadResponseSavingsHours + noShowSavingsHours;

  return Math.round(totalHours * 10) / 10;
}

/** Converts hours saved per month into an EUR value using a fully-loaded hourly rate. */
export function calculateMonthlyCostSavings(
  monthlyTimeSavingsHours: number,
  hourlyRateEur: number = DEFAULT_HOURLY_RATE_EUR,
): number {
  return Math.round(monthlyTimeSavingsHours * hourlyRateEur);
}

/**
 * Rough one-time setup investment estimate for implementing the generated
 * recommendations, used to calculate a payback period. Priced per
 * recommendation tier rather than as a single flat fee, so the estimate
 * scales sensibly with how much automation work is actually recommended.
 */
function estimateSetupCost(recommendations: Recommendation[]): number {
  const baseCost = 490; // discovery, workflow design, integration setup
  const perRecommendationCost: Record<RecommendationPriority, number> = {
    high: 350,
    medium: 220,
    low: 120,
  };
  return recommendations.reduce(
    (total, rec) => total + perRecommendationCost[rec.priority],
    baseCost,
  );
}

/** Builds the full ROI calculation shown on the audit detail page and report. */
export function calculateRoi(
  input: AuditScoringInput,
  recommendations: Recommendation[],
  hourlyRateEur: number = DEFAULT_HOURLY_RATE_EUR,
): RoiCalculation {
  const monthlyTimeSavingsHours = calculateMonthlyTimeSavings(input);
  const monthlyCostSavingsEur = calculateMonthlyCostSavings(
    monthlyTimeSavingsHours,
    hourlyRateEur,
  );
  const setupCostEstimateEur = estimateSetupCost(recommendations);
  const paybackPeriodMonths =
    monthlyCostSavingsEur > 0
      ? Math.round((setupCostEstimateEur / monthlyCostSavingsEur) * 10) / 10
      : 0;

  return {
    monthlyTimeSavingsHours,
    monthlyCostSavingsEur,
    hourlyRateEur,
    setupCostEstimateEur,
    paybackPeriodMonths,
    annualSavingsEur: monthlyCostSavingsEur * 12,
  };
}

interface RecommendationRule {
  condition: (input: AuditScoringInput) => boolean;
  build: (input: AuditScoringInput) => Omit<Recommendation, "id">;
}

const RECOMMENDATION_RULES: RecommendationRule[] = [
  {
    condition: (i) => i.leadSituation.avgResponseTimeHours > 4,
    build: (i) => ({
      title: "Automatisierte Erstantwort & Lead-Routing",
      description:
        "Neue Leads erhalten innerhalb von Minuten eine persönliche Erstantwort und werden automatisch an den zuständigen Makler weitergeleitet, statt Stunden auf eine manuelle Sichtung zu warten.",
      priority: i.leadSituation.avgResponseTimeHours > 12 ? "high" : "medium",
      impactEstimate: `Antwortzeit von ${formatHours(
        i.leadSituation.avgResponseTimeHours,
      )} auf unter 1 Std. senkbar`,
      relatedPainPointIds: ["slow_lead_response"],
    }),
  },
  {
    condition: (i) =>
      selectedPainPoints(i.painPoints).some(
        (p) => p.id === "manual_expose_requests",
      ),
    build: () => ({
      title: "Automatisierter Exposé-Versand",
      description:
        "Exposé-Anfragen werden automatisch erkannt, qualifiziert und mit dem passenden Exposé beantwortet, statt jede Anfrage einzeln manuell zu bearbeiten.",
      priority: "high",
      impactEstimate: "Bearbeitungszeit pro Anfrage um bis zu 80 % reduzierbar",
      relatedPainPointIds: ["manual_expose_requests"],
    }),
  },
  {
    condition: (i) =>
      selectedPainPoints(i.painPoints).some(
        (p) => p.id === "manual_appointment_scheduling",
      ),
    build: () => ({
      title: "Selbstbuchung für Besichtigungstermine",
      description:
        "Interessenten buchen Besichtigungstermine eigenständig über einen Online-Kalender, statt dass eine manuelle Abstimmung per Telefon und E-Mail nötig ist.",
      priority: "high",
      impactEstimate: "Manuelle Terminabstimmung entfällt für die meisten Anfragen",
      relatedPainPointIds: ["manual_appointment_scheduling"],
    }),
  },
  {
    condition: (i) =>
      selectedPainPoints(i.painPoints).some(
        (p) => p.id === "forgotten_followups",
      ),
    build: () => ({
      title: "Automatisierte Follow-up-Sequenzen",
      description:
        "Nach jeder Besichtigung und jedem Erstkontakt läuft automatisch eine Follow-up-Sequenz, damit kein Interessent mehr durchs Raster fällt.",
      priority: "medium",
      impactEstimate: "Follow-up-Quote auf nahezu 100 % steigerbar",
      relatedPainPointIds: ["forgotten_followups"],
    }),
  },
  {
    condition: (i) =>
      i.leadSituation.noShowRatePercent >= 15 ||
      selectedPainPoints(i.painPoints).some(
        (p) => p.id === "no_show_followup_missing",
      ),
    build: (i) => ({
      title: "No-Show-Recovery-Workflow",
      description:
        "Kurzfristige Absagen und No-Shows lösen automatisch eine Nachfass-Sequenz mit einem neuen Terminvorschlag aus, statt manuell nachtelefoniert zu werden.",
      priority: i.leadSituation.noShowRatePercent >= 20 ? "high" : "medium",
      impactEstimate: `No-Show-Rate von ${i.leadSituation.noShowRatePercent} % spürbar senkbar`,
      relatedPainPointIds: ["no_show_followup_missing"],
    }),
  },
  {
    condition: (i) =>
      selectedPainPoints(i.painPoints).some((p) => p.id === "messy_crm") ||
      i.leadSituation.currentCrm === "Kein CRM" ||
      i.leadSituation.currentCrm === "Excel" ||
      i.leadSituation.currentCrm === "Excel + Outlook",
    build: (i) => ({
      title: "CRM-Konsolidierung & Datenhygiene",
      description: `Alle Leads, Kontakte und Objekte werden aus ${i.leadSituation.currentCrm} in ein zentrales, sauber gepflegtes CRM überführt, das automatisch aktuell gehalten wird.`,
      priority: "medium",
      impactEstimate: "Einheitliche Datenbasis statt verstreuter Tabellen",
      relatedPainPointIds: ["messy_crm"],
    }),
  },
  {
    condition: (i) =>
      selectedPainPoints(i.painPoints).some(
        (p) => p.id === "no_lead_prioritization",
      ),
    build: () => ({
      title: "Automatisches Lead-Scoring",
      description:
        "Eingehende Leads werden automatisch nach Kaufbereitschaft und Qualität priorisiert, damit das Team zuerst die vielversprechendsten Kontakte bearbeitet.",
      priority: "medium",
      impactEstimate: "Fokus auf die 20 % der Leads mit der höchsten Abschlusswahrscheinlichkeit",
      relatedPainPointIds: ["no_lead_prioritization"],
    }),
  },
  {
    condition: (i) =>
      selectedPainPoints(i.painPoints).some(
        (p) => p.id === "manual_recurring_emails",
      ),
    build: () => ({
      title: "KI-Textbausteine für wiederkehrende E-Mails",
      description:
        "Wiederkehrende E-Mails wie Exposé-Versand, Terminbestätigungen und Nachfragen werden per KI-Textgenerierung vorformuliert, statt jedes Mal neu getippt zu werden.",
      priority: "low",
      impactEstimate: "Mehrere Minuten Schreibzeit pro Standard-E-Mail einsparbar",
      relatedPainPointIds: ["manual_recurring_emails"],
    }),
  },
  {
    condition: (i) =>
      selectedPainPoints(i.painPoints).some(
        (p) => p.id === "website_low_quality_leads",
      ),
    build: () => ({
      title: "Conversion-Optimierung des Website-Formulars",
      description:
        "Das Kontaktformular wird um Qualifizierungsfragen und ein sofortiges automatisiertes Feedback ergänzt, um mehr ernsthafte Anfragen statt Streuverlust zu erzeugen.",
      priority: "low",
      impactEstimate: "Höherer Anteil qualifizierter Anfragen über die Website",
      relatedPainPointIds: ["website_low_quality_leads"],
    }),
  },
];

const PRIORITY_WEIGHT: Record<RecommendationPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Generates a prioritized list of automation recommendations by evaluating
 * a small rule set against the audit inputs. Each rule fires independently
 * based on pain points and lead-situation thresholds, so the output always
 * traces back to something the agency actually reported — useful for
 * defending the report in a client conversation.
 */
export function generateRecommendations(
  input: AuditScoringInput,
): Recommendation[] {
  const recommendations = RECOMMENDATION_RULES.filter((rule) =>
    rule.condition(input),
  ).map((rule, index) => ({
    id: `rec-${index + 1}`,
    ...rule.build(input),
  }));

  return recommendations.sort(
    (a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority],
  );
}

/** Human-readable label for a pain point, re-exported for report/UI convenience. */
export { painPointLabel };

/**
 * Runs the full scoring pipeline for a set of audit inputs. This is the
 * single entry point demo data and the (future) audit creation flow should
 * use, so every audit in the product is scored identically.
 */
export function runAuditScoring(input: AuditScoringInput): {
  scores: AuditScores;
  recommendations: Recommendation[];
  roiCalculation: RoiCalculation;
} {
  const scores = buildAuditScores(input);
  const recommendations = generateRecommendations(input);
  const roiCalculation = calculateRoi(input, recommendations);

  return { scores, recommendations, roiCalculation };
}
