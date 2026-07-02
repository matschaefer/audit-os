import type {
  AuditStatus,
  AutomationLevel,
  BusinessGoal,
  CrmTool,
  OfferType,
  PainPointId,
  ProcessMaturity,
  SalesPriority,
  WebsiteQuality,
} from "@/types/audit";

/**
 * Canonical catalogue of pain points an agency can report during the audit
 * interview. Used to render the checklist in the audit form and as the
 * lookup table for labels wherever only a `PainPointId` is available
 * (e.g. inside generated recommendations).
 */
export const PAIN_POINT_CATALOGUE: { id: PainPointId; label: string }[] = [
  { id: "slow_lead_response", label: "Leads werden zu spät beantwortet" },
  {
    id: "manual_expose_requests",
    label: "Exposé-Anfragen werden manuell bearbeitet",
  },
  {
    id: "manual_appointment_scheduling",
    label: "Terminabstimmung kostet viel Zeit",
  },
  { id: "forgotten_followups", label: "Follow-ups werden vergessen" },
  { id: "messy_crm", label: "CRM wird nicht sauber gepflegt" },
  {
    id: "no_lead_prioritization",
    label: "Es gibt keine klare Lead-Priorisierung",
  },
  {
    id: "manual_recurring_emails",
    label: "Wiederkehrende E-Mails werden manuell geschrieben",
  },
  {
    id: "no_show_followup_missing",
    label: "No-Shows werden nicht automatisch nachgefasst",
  },
  {
    id: "website_low_quality_leads",
    label: "Website generiert zu wenige qualifizierte Anfragen",
  },
];

export function painPointLabel(id: PainPointId): string {
  return PAIN_POINT_CATALOGUE.find((p) => p.id === id)?.label ?? id;
}

/** Suggested manual process names shown as quick-add chips in the audit form. */
export const SUGGESTED_MANUAL_PROCESSES = [
  "Lead aus Kontaktformular prüfen",
  "Interessenten zurückrufen",
  "Exposé senden",
  "Besichtigungstermin vereinbaren",
  "Nach Besichtigung nachfassen",
  "Eigentümer informieren",
  "CRM aktualisieren",
] as const;

export const CRM_TOOL_OPTIONS: CrmTool[] = [
  "Kein CRM",
  "Excel",
  "Excel + Outlook",
  "OnOffice",
  "Propstack",
  "FlowFact",
  "Salesforce",
  "Anderes CRM",
];

export const AUTOMATION_LEVEL_LABELS: Record<AutomationLevel, string> = {
  manual: "Manuell",
  partially_automated: "Teilweise automatisiert",
  automated: "Automatisiert",
};

/** Wo sich ein Kundenaudit in der internen Synkro-Pipeline befindet. */
export const AUDIT_STATUS_LABELS: Record<AuditStatus, string> = {
  draft: "Entwurf",
  in_review: "In Prüfung",
  report_ready: "Report bereit",
  proposal_sent: "Angebot versendet",
};

export const PROCESS_MATURITY_LABELS: Record<ProcessMaturity, string> = {
  low: "Geringe Prozessreife",
  medium: "Mittlere Prozessreife",
  high: "Hohe Prozessreife",
};

export const SALES_PRIORITY_LABELS: Record<SalesPriority, string> = {
  high: "Hohe Priorität",
  medium: "Mittlere Priorität",
  low: "Niedrige Priorität",
};

/** What the client is primarily trying to achieve — used to match Synkro offers. */
export const BUSINESS_GOAL_LABELS: Record<BusinessGoal, string> = {
  more_seller_leads: "Mehr Eigentümer-Leads gewinnen",
  faster_lead_handling: "Leads schneller bearbeiten",
  reduce_admin_work: "Verwaltungsaufwand reduzieren",
  full_process_optimization: "Alle Prozesse ganzheitlich optimieren",
};

export const WEBSITE_QUALITY_LABELS: Record<WebsiteQuality, string> = {
  none: "Keine Website vorhanden",
  weak: "Website vorhanden, generiert aber kaum Anfragen",
  solid: "Website funktioniert gut als Lead-Quelle",
};

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  audit: "Kostenloser Audit",
  core: "Kernangebot",
  "add-on": "Zusatzmodul",
  custom: "Individuelles Projekt",
};
