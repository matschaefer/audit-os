/**
 * Realistic demo dataset for Synkro Audit OS.
 *
 * `DEMO_AUDIT_ID` ("demo-1", Rheinblick Immobilien GmbH) is the flagship
 * example used on `/demo` and in sales conversations — every number on its
 * report is designed to plausibly showcase Synkro's value. The remaining
 * audits exist to make the workspace feel like a real, multi-client
 * consulting pipeline with opportunities at different stages.
 *
 * All derived fields (scores, recommendations, ROI) are produced by the
 * same `runAuditScoring` pipeline used for real audits, so the demo data
 * never drifts out of sync with the scoring rules.
 */

import { runAuditScoring } from "@/lib/audit-scoring";
import { PAIN_POINT_CATALOGUE } from "@/lib/constants";
import { recommendSynkroOffers } from "@/lib/offer-matching";
import type {
  Audit,
  AuditStatus,
  AuditSummary,
  BusinessContext,
  Company,
  ConsultantAssessment,
  LeadSituation,
  ManualProcess,
  PainPointId,
} from "@/types/audit";

let processIdCounter = 0;
function process(
  name: string,
  frequencyPerWeek: number,
  durationMinutes: number,
  automationLevel: ManualProcess["automationLevel"],
): ManualProcess {
  processIdCounter += 1;
  return {
    id: `process-${processIdCounter}`,
    name,
    frequencyPerWeek,
    durationMinutes,
    automationLevel,
  };
}

function painPoints(selectedIds: PainPointId[]) {
  return PAIN_POINT_CATALOGUE.map((entry) => ({
    ...entry,
    selected: selectedIds.includes(entry.id),
  }));
}

function buildAudit(params: {
  id: string;
  status: AuditStatus;
  createdAt: string;
  company: Company;
  leadSituation: LeadSituation;
  selectedPainPointIds: PainPointId[];
  manualProcesses: ManualProcess[];
  consultantAssessment: ConsultantAssessment;
  businessContext: BusinessContext;
}): Audit {
  const input = {
    company: params.company,
    leadSituation: params.leadSituation,
    painPoints: painPoints(params.selectedPainPointIds),
    manualProcesses: params.manualProcesses,
  };
  const { scores, recommendations, roiCalculation } = runAuditScoring(input);

  return {
    id: params.id,
    status: params.status,
    createdAt: params.createdAt,
    company: params.company,
    leadSituation: params.leadSituation,
    painPoints: input.painPoints,
    manualProcesses: params.manualProcesses,
    scores,
    recommendations,
    roiCalculation,
    consultantAssessment: params.consultantAssessment,
    businessContext: params.businessContext,
  };
}

export const DEMO_AUDIT_ID = "demo-1";

const rheinblick = buildAudit({
  id: DEMO_AUDIT_ID,
  status: "proposal_sent",
  createdAt: "2026-06-18T09:00:00.000Z",
  company: {
    name: "Rheinblick Immobilien GmbH",
    location: "Düsseldorf",
    website: "https://rheinblick-immobilien.de",
    employeeCount: 8,
    contactName: "Katharina Vogt",
    contactRole: "Geschäftsführerin",
  },
  leadSituation: {
    leadsPerMonth: 120,
    avgResponseTimeHours: 12,
    viewingsPerMonth: 45,
    noShowRatePercent: 18,
    currentCrm: "Excel + Outlook",
    currentTools: ["Excel", "Outlook", "WhatsApp Business", "ImmoScout24"],
  },
  selectedPainPointIds: [
    "slow_lead_response",
    "forgotten_followups",
    "manual_expose_requests",
    "manual_appointment_scheduling",
    "messy_crm",
  ],
  manualProcesses: [
    process("Lead aus Kontaktformular prüfen", 25, 8, "manual"),
    process("Interessenten zurückrufen", 30, 12, "manual"),
    process("Exposé senden", 28, 15, "manual"),
    process("Besichtigungstermin vereinbaren", 20, 18, "manual"),
    process("Nach Besichtigung nachfassen", 12, 10, "partially_automated"),
    process("Eigentümer informieren", 8, 15, "manual"),
    process("CRM aktualisieren", 15, 10, "manual"),
  ],
  consultantAssessment: {
    discoveryNotes:
      "Erstgespräch mit Katharina Vogt (Geschäftsführerin) am 15. Juni. Team aus 8 Maklern, wachsendes Lead-Aufkommen über Portalanzeigen, aber kein strukturierter Erfassungsprozess. Leads werden in Excel geführt, Termine per Telefon und E-Mail abgestimmt.",
    decisionMakerContext:
      "Katharina Vogt ist alleinige Geschäftsführerin und trifft die Entscheidung allein. Budgethoheit bestätigt — sie erwähnte, dass im Q3-Marketingbudget noch Spielraum für eine Tool-Investition besteht.",
    processMaturity: "low",
    salesPriority: "high",
    salesAngle:
      "Mit der 12-Stunden-Antwortzeit und der 18%-No-Show-Rate einsteigen — beides kostet sie unmittelbar Abschlüsse. Eine Amortisation in unter einem Monat macht die Entscheidung leicht.",
    recommendedNextStep:
      "Beim Angebot nachfassen und einen Termin zur Vertragsprüfung vereinbaren.",
  },
  businessContext: {
    businessGoal: "faster_lead_handling",
    websiteQuality: "solid",
  },
});

const seestadt = buildAudit({
  id: "demo-2",
  status: "report_ready",
  createdAt: "2026-05-04T09:00:00.000Z",
  company: {
    name: "Seestadt Wohnimmobilien",
    location: "Köln",
    website: "https://seestadt-wohnimmobilien.de",
    employeeCount: 14,
    contactName: "Jonas Reimann",
    contactRole: "Vertriebsleiter",
  },
  leadSituation: {
    leadsPerMonth: 210,
    avgResponseTimeHours: 6,
    viewingsPerMonth: 70,
    noShowRatePercent: 11,
    currentCrm: "OnOffice",
    currentTools: ["OnOffice", "Outlook", "Mailchimp"],
  },
  selectedPainPointIds: [
    "no_lead_prioritization",
    "manual_recurring_emails",
    "no_show_followup_missing",
  ],
  manualProcesses: [
    process("Lead aus Kontaktformular prüfen", 40, 5, "automated"),
    process("Interessenten zurückrufen", 35, 10, "partially_automated"),
    process("Exposé senden", 32, 8, "partially_automated"),
    process("Besichtigungstermin vereinbaren", 25, 12, "partially_automated"),
    process("Nach Besichtigung nachfassen", 18, 10, "manual"),
    process("CRM aktualisieren", 20, 6, "automated"),
  ],
  consultantAssessment: {
    discoveryNotes:
      "Gespräch mit Jonas Reimann (Vertriebsleiter). Größeres Team (14 Mitarbeiter), nutzt bereits OnOffice mit ordentlichen Antwortzeiten. Die Schmerzpunkte liegen eher bei Lead-Priorisierung und No-Show-Nachfassung als beim reinen Volumen manueller Arbeit.",
    decisionMakerContext:
      "Jonas ist Vertriebsleiter, benötigt aber die Freigabe der beiden geschäftsführenden Gesellschafter für Ausgaben über 1.000 €/Monat.",
    processMaturity: "medium",
    salesPriority: "medium",
    salesAngle:
      "Als schrittweises Upgrade des bestehenden OnOffice-Setups positionieren statt als kompletten Systemwechsel — senkt das wahrgenommene Risiko für die Gesellschafter.",
    recommendedNextStep:
      "Report versenden und einen 20-minütigen Walkthrough mit den Gesellschaftern anbieten.",
  },
  businessContext: {
    businessGoal: "reduce_admin_work",
    websiteQuality: "solid",
  },
});

const maierPartner = buildAudit({
  id: "demo-3",
  status: "in_review",
  createdAt: "2026-04-22T09:00:00.000Z",
  company: {
    name: "Maier & Partner Immobilien",
    location: "Essen",
    website: "https://maier-partner-immobilien.de",
    employeeCount: 5,
    contactName: "Sabine Maier",
    contactRole: "Inhaberin",
  },
  leadSituation: {
    leadsPerMonth: 65,
    avgResponseTimeHours: 26,
    viewingsPerMonth: 22,
    noShowRatePercent: 24,
    currentCrm: "Kein CRM",
    currentTools: ["Excel", "Gmail", "Telefon"],
  },
  selectedPainPointIds: [
    "slow_lead_response",
    "manual_expose_requests",
    "manual_appointment_scheduling",
    "forgotten_followups",
    "messy_crm",
    "no_lead_prioritization",
    "manual_recurring_emails",
    "no_show_followup_missing",
    "website_low_quality_leads",
  ],
  manualProcesses: [
    process("Lead aus Kontaktformular prüfen", 15, 10, "manual"),
    process("Interessenten zurückrufen", 16, 15, "manual"),
    process("Exposé senden", 14, 20, "manual"),
    process("Besichtigungstermin vereinbaren", 10, 20, "manual"),
    process("Nach Besichtigung nachfassen", 6, 12, "manual"),
    process("Eigentümer informieren", 5, 15, "manual"),
    process("CRM aktualisieren", 8, 12, "manual"),
  ],
  consultantAssessment: {
    discoveryNotes:
      "Gespräch mit Sabine Maier (Inhaberin). Sehr manueller Betrieb — kein CRM, Koordination per Telefon, hohe No-Show-Rate. Höchstes Automatisierungspotenzial in der Pipeline, aber auch das kleinste Team und vermutlich das kleinste Budget.",
    decisionMakerContext:
      "Sabine Maier ist alleinige Inhaberin und entscheidet allein, ist jedoch preissensibel — hat die Kosten im Gespräch zweimal als Bedenken angesprochen.",
    processMaturity: "low",
    salesPriority: "medium",
    salesAngle:
      "Das Angebot auf die persönliche Zeitersparnis von Sabine ausrichten, nicht auf Team-Effizienz — sie ist bei den meisten Prozessen noch selbst operativ eingebunden.",
    recommendedNextStep:
      "Interne Prüfung: schlankeres Paket festlegen, bevor ein Preis genannt wird.",
  },
  businessContext: {
    businessGoal: "reduce_admin_work",
    websiteQuality: "weak",
  },
});

const stadtvilla = buildAudit({
  id: "demo-4",
  status: "draft",
  createdAt: "2026-03-11T09:00:00.000Z",
  company: {
    name: "Stadtvilla Makler GmbH",
    location: "Dortmund",
    website: "https://stadtvilla-makler.de",
    employeeCount: 22,
    contactName: "Tobias Krüger",
    contactRole: "Teamleiter Vertrieb",
  },
  leadSituation: {
    leadsPerMonth: 300,
    avgResponseTimeHours: 3,
    viewingsPerMonth: 95,
    noShowRatePercent: 8,
    currentCrm: "Propstack",
    currentTools: ["Propstack", "Outlook", "DocuSign"],
  },
  selectedPainPointIds: ["manual_recurring_emails", "no_lead_prioritization"],
  manualProcesses: [
    process("Lead aus Kontaktformular prüfen", 60, 4, "automated"),
    process("Interessenten zurückrufen", 45, 8, "partially_automated"),
    process("Exposé senden", 50, 5, "automated"),
    process("Besichtigungstermin vereinbaren", 40, 8, "partially_automated"),
    process("Nach Besichtigung nachfassen", 22, 8, "partially_automated"),
    process("CRM aktualisieren", 30, 4, "automated"),
  ],
  consultantAssessment: {
    discoveryNotes:
      "Erstgespräch mit Tobias Krüger (Teamleiter Vertrieb). Größtes Team (22 Mitarbeiter), nutzt bereits Propstack mit solider Automatisierung. Kaum verbleibende Schmerzpunkte — Audit diente vor allem zum Benchmarking des bestehenden Setups.",
    decisionMakerContext:
      "Tobias ist nicht der finale Entscheider — bräuchte bei einem überzeugenden Angebot die Zustimmung der geschäftsführenden Gesellschafter.",
    processMaturity: "high",
    salesPriority: "low",
    salesAngle:
      "Aktuell kein prioritäres Engagement — eher ein kurzer Check-in in 2–3 Monaten sinnvoll als jetzt ein volles Angebot zu forcieren.",
    recommendedNextStep:
      "In die vierteljährliche Nurture-Sequenz aufnehmen; derzeit keine akute Handlung nötig.",
  },
  businessContext: {
    businessGoal: "reduce_admin_work",
    websiteQuality: "solid",
  },
});

export const demoAudits: Audit[] = [
  rheinblick,
  seestadt,
  maierPartner,
  stadtvilla,
];

export function getAuditById(id: string): Audit | undefined {
  return demoAudits.find((audit) => audit.id === id);
}

/** Name of the offer a consultant should lead with, for quick scanning in list views. */
export function getRecommendedOfferName(audit: Audit): string {
  const recommendations = recommendSynkroOffers(audit);
  const primary = recommendations.find((r) => r.recommendationType === "primary");
  if (primary) return primary.offer.name;

  const topSecondary = recommendations.find(
    (r) => r.recommendationType === "secondary",
  );
  return topSecondary ? topSecondary.offer.name : "Kein klares Angebot";
}

export function getAuditSummaries(): AuditSummary[] {
  return demoAudits.map((audit) => ({
    id: audit.id,
    status: audit.status,
    createdAt: audit.createdAt,
    scores: audit.scores,
    roiCalculation: audit.roiCalculation,
    companyName: audit.company.name,
    companyLocation: audit.company.location,
    salesPriority: audit.consultantAssessment.salesPriority,
    recommendedOfferName: getRecommendedOfferName(audit),
  }));
}

const REPORT_STAGE_STATUSES: AuditStatus[] = ["report_ready", "proposal_sent"];
const FOLLOW_UP_STATUSES: AuditStatus[] = ["draft", "in_review"];

export interface DashboardKpis {
  totalAudits: number;
  avgAutomationPotentialPercent: number;
  totalMonthlyTimeSavingsHours: number;
  totalMonthlyCostSavingsEur: number;
  reportsPreparedCount: number;
  followUpRequiredCount: number;
}

export function getDashboardKpis(): DashboardKpis {
  const audits = demoAudits;
  const totalAudits = audits.length;
  const avgAutomationPotentialPercent = Math.round(
    audits.reduce((sum, a) => sum + a.scores.automationPotentialPercent, 0) /
      totalAudits,
  );
  const totalMonthlyTimeSavingsHours = Math.round(
    audits.reduce(
      (sum, a) => sum + a.roiCalculation.monthlyTimeSavingsHours,
      0,
    ),
  );
  const totalMonthlyCostSavingsEur = audits.reduce(
    (sum, a) => sum + a.roiCalculation.monthlyCostSavingsEur,
    0,
  );
  const reportsPreparedCount = audits.filter((a) =>
    REPORT_STAGE_STATUSES.includes(a.status),
  ).length;
  const followUpRequiredCount = audits.filter((a) =>
    FOLLOW_UP_STATUSES.includes(a.status),
  ).length;

  return {
    totalAudits,
    avgAutomationPotentialPercent,
    totalMonthlyTimeSavingsHours,
    totalMonthlyCostSavingsEur,
    reportsPreparedCount,
    followUpRequiredCount,
  };
}
