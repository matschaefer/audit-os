/**
 * Matches a completed audit against Synkro's service catalogue
 * (`lib/synkro-offers.ts`) to produce an internal offer recommendation.
 *
 * Like the audit scoring engine, this is intentionally rule-based and
 * transparent rather than a black box: every point added to a fit score
 * traces back to a concrete signal from the audit, so a consultant can
 * defend the recommendation in a sales conversation.
 *
 * This only recommends the paid/core offers — the free "Automatisierungs-Audit"
 * itself is the entry point that already happened, not a next-step offer.
 */

import { formatCurrencyEur, formatHours } from "@/lib/format";
import { getSynkroOfferById } from "@/lib/synkro-offers";
import type {
  Audit,
  OfferRecommendation,
  PainPointId,
  RecommendationType,
  SynkroOffer,
} from "@/types/audit";

/**
 * Everything the offer matcher actually needs. Deliberately narrower than
 * the full `Audit` type (mirrors `AuditScoringInput` in audit-scoring.ts) so
 * it can also be run against in-progress form state before an audit has an
 * id, status, or consultant assessment.
 */
export type OfferMatchInput = Pick<
  Audit,
  | "company"
  | "leadSituation"
  | "painPoints"
  | "manualProcesses"
  | "businessContext"
  | "roiCalculation"
>;

function hasPainPoint(audit: OfferMatchInput, id: PainPointId): boolean {
  return audit.painPoints.some((p) => p.id === id && p.selected);
}

/** Excel/Outlook/no CRM at all are treated as structurally weak tooling. */
function isWeakCrm(audit: OfferMatchInput): boolean {
  const crm = audit.leadSituation.currentCrm;
  return crm === "Kein CRM" || crm === "Excel" || crm === "Excel + Outlook";
}

function manualProcessShare(audit: OfferMatchInput): number {
  if (audit.manualProcesses.length === 0) return 0;
  const manualCount = audit.manualProcesses.filter(
    (p) => p.automationLevel === "manual",
  ).length;
  return manualCount / audit.manualProcesses.length;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

interface OfferMatch {
  offerId: string;
  score: number;
  reasons: string[];
  solvedProblems: string[];
}

function matchVerkaeufergewinnung(audit: OfferMatchInput): OfferMatch {
  let score = 10;
  const reasons: string[] = [];
  const solvedProblems: string[] = [];

  if (audit.businessContext.businessGoal === "more_seller_leads") {
    score += 40;
    reasons.push("Erklärtes Ziel ist, mehr Eigentümer-Leads zu gewinnen.");
    solvedProblems.push("Fehlende aktive Eigentümeransprache");
  }
  if (audit.businessContext.websiteQuality === "none") {
    score += 20;
    reasons.push("Es gibt keine Website, die Eigentümeranfragen aufnehmen könnte.");
  } else if (audit.businessContext.websiteQuality === "weak") {
    score += 12;
    reasons.push("Die bestehende Website generiert kaum Eigentümeranfragen.");
  }
  if (hasPainPoint(audit, "website_low_quality_leads")) {
    score += 15;
    reasons.push("Die Website liefert laut Audit zu wenige qualifizierte Anfragen.");
    solvedProblems.push("Website generiert zu wenige qualifizierte Anfragen");
  }
  if (isWeakCrm(audit)) {
    score += 8;
    reasons.push("Ohne strukturiertes CRM ist unklar, woher bestehende Eigentümerkontakte kommen.");
  }

  return { offerId: "verkaeufergewinnung", score: clamp(score, 0, 100), reasons, solvedProblems };
}

function matchLeadTerminprozess(audit: OfferMatchInput): OfferMatch {
  let score = 5;
  const reasons: string[] = [];
  const solvedProblems: string[] = [];
  const { leadsPerMonth, avgResponseTimeHours, noShowRatePercent } = audit.leadSituation;

  if (leadsPerMonth >= 100) {
    score += 20;
    reasons.push(`Mit ${leadsPerMonth} Leads pro Monat lohnt sich eine vollautomatische Erstbearbeitung besonders.`);
  } else if (leadsPerMonth >= 50) {
    score += 12;
    reasons.push(`${leadsPerMonth} Leads pro Monat sind manuell kaum zuverlässig zu bearbeiten.`);
  }

  if (avgResponseTimeHours > 12) {
    score += 25;
    reasons.push(`Die Antwortzeit von ${formatHours(avgResponseTimeHours)} kostet nachweislich Besichtigungstermine.`);
    solvedProblems.push("Leads werden zu spät beantwortet");
  } else if (avgResponseTimeHours > 4) {
    score += 15;
    reasons.push(`Eine Antwortzeit von ${formatHours(avgResponseTimeHours)} lässt sich klar automatisieren.`);
    solvedProblems.push("Leads werden zu spät beantwortet");
  }

  if (hasPainPoint(audit, "manual_appointment_scheduling")) {
    score += 15;
    reasons.push("Terminabstimmung läuft aktuell manuell per Telefon und E-Mail.");
    solvedProblems.push("Terminabstimmung kostet viel Zeit");
  }
  if (hasPainPoint(audit, "manual_expose_requests")) {
    score += 10;
    reasons.push("Exposé-Anfragen werden noch einzeln von Hand bearbeitet.");
    solvedProblems.push("Exposé-Anfragen werden manuell bearbeitet");
  }
  if (hasPainPoint(audit, "forgotten_followups")) {
    score += 12;
    reasons.push("Follow-ups nach dem Erstkontakt werden laut Audit vergessen.");
    solvedProblems.push("Follow-ups werden vergessen");
  }
  if (noShowRatePercent >= 15 || hasPainPoint(audit, "no_show_followup_missing")) {
    score += 10;
    reasons.push(`Eine No-Show-Rate von ${noShowRatePercent}% zeigt fehlende automatisierte Nachfassprozesse.`);
    solvedProblems.push("No-Shows werden nicht automatisch nachgefasst");
  }

  return { offerId: "lead-terminprozess", score: clamp(score, 0, 100), reasons, solvedProblems };
}

function matchWebsitesLandingpages(audit: OfferMatchInput): OfferMatch {
  let score = 0;
  const reasons: string[] = [];
  const solvedProblems: string[] = [];

  if (audit.businessContext.websiteQuality === "none") {
    score += 55;
    reasons.push("Es existiert aktuell keine Website als eigene Lead-Quelle.");
  } else if (audit.businessContext.websiteQuality === "weak") {
    score += 32;
    reasons.push("Die bestehende Website ist als Lead-Quelle schwach.");
  } else {
    score += 5;
  }

  if (hasPainPoint(audit, "website_low_quality_leads")) {
    score += 22;
    reasons.push("Die Website generiert laut Audit zu wenige qualifizierte Anfragen.");
    solvedProblems.push("Website generiert zu wenige qualifizierte Anfragen");
  }
  if (isWeakCrm(audit) && audit.businessContext.websiteQuality !== "solid") {
    score += 8;
    reasons.push("Ohne CRM-Anbindung verpuffen Anfragen, die über die Website hereinkommen.");
  }

  return { offerId: "websites-landingpages", score: clamp(score, 0, 100), reasons, solvedProblems };
}

function matchEmailWhatsappNurturing(audit: OfferMatchInput): OfferMatch {
  let score = 5;
  const reasons: string[] = [];
  const solvedProblems: string[] = [];

  if (hasPainPoint(audit, "forgotten_followups")) {
    score += 25;
    reasons.push("Follow-ups werden aktuell nicht systematisch nachverfolgt.");
    solvedProblems.push("Follow-ups werden vergessen");
  }
  if (hasPainPoint(audit, "no_show_followup_missing")) {
    score += 18;
    reasons.push("No-Shows erhalten aktuell keine automatische Nachfass-Sequenz.");
    solvedProblems.push("No-Shows werden nicht automatisch nachgefasst");
  }
  if (hasPainPoint(audit, "no_lead_prioritization")) {
    score += 12;
    reasons.push("Ohne Priorisierung bleiben viele Leads unbearbeitet liegen.");
    solvedProblems.push("Es gibt keine klare Lead-Priorisierung");
  }
  if (hasPainPoint(audit, "manual_recurring_emails")) {
    score += 10;
    reasons.push("Wiederkehrende E-Mails werden noch manuell geschrieben.");
    solvedProblems.push("Wiederkehrende E-Mails werden manuell geschrieben");
  }
  if (audit.leadSituation.leadsPerMonth >= 100) {
    score += 10;
    reasons.push("Bei diesem Lead-Volumen bleiben ohne Nurturing viele Kontakte kalt liegen.");
  }

  return { offerId: "email-whatsapp-nurturing", score: clamp(score, 0, 100), reasons, solvedProblems };
}

function matchCrmProzessoptimierung(audit: OfferMatchInput): OfferMatch {
  let score = 0;
  const reasons: string[] = [];
  const solvedProblems: string[] = [];

  if (isWeakCrm(audit)) {
    score += 28;
    reasons.push(`${audit.leadSituation.currentCrm} statt eines echten CRMs erschwert eine saubere Datenbasis.`);
  }
  if (hasPainPoint(audit, "messy_crm")) {
    score += 22;
    reasons.push("Das CRM wird laut Audit nicht sauber gepflegt.");
    solvedProblems.push("CRM wird nicht sauber gepflegt");
  }

  const manualShare = manualProcessShare(audit);
  if (manualShare >= 0.7) {
    score += 25;
    reasons.push("Der Großteil der erfassten Prozesse läuft noch vollständig manuell.");
  } else if (manualShare >= 0.4) {
    score += 15;
    reasons.push("Ein erheblicher Teil der Prozesse läuft noch manuell.");
  }

  if (audit.businessContext.businessGoal === "full_process_optimization") {
    score += 25;
    reasons.push("Erklärtes Ziel ist eine vollständige Prozessoptimierung, nicht nur ein Einzelprozess.");
  }
  if (audit.company.employeeCount >= 15) {
    score += 8;
    reasons.push("Bei dieser Teamgröße lohnt sich eine unternehmensweite statt punktuelle Automatisierung.");
  }

  return { offerId: "crm-prozessoptimierung", score: clamp(score, 0, 100), reasons, solvedProblems };
}

const MATCHERS = [
  matchVerkaeufergewinnung,
  matchLeadTerminprozess,
  matchWebsitesLandingpages,
  matchEmailWhatsappNurturing,
  matchCrmProzessoptimierung,
];

/** Minimum fit score for an offer to be crowned the single primary recommendation. */
const PRIMARY_THRESHOLD = 45;
/** Minimum fit score for an offer to be worth mentioning as a secondary add-on. */
const SECONDARY_THRESHOLD = 25;

function buildExpectedImpact(offer: SynkroOffer, audit: OfferMatchInput): string {
  const hours = formatHours(audit.roiCalculation.monthlyTimeSavingsHours);
  const cost = formatCurrencyEur(audit.roiCalculation.monthlyCostSavingsEur);

  switch (offer.id) {
    case "verkaeufergewinnung":
      return "Mehr eingehende Eigentümeranfragen und eine planbare Akquise-Pipeline statt Kaltakquise.";
    case "lead-terminprozess":
      return `Weniger verlorene Leads und schnellere Terminbuchung — Teil der geschätzten ${hours} (${cost}) Zeitersparnis pro Monat.`;
    case "websites-landingpages":
      return "Eine Website, die Anfragen direkt qualifiziert und ins CRM übergibt, statt Anfragen zu verlieren.";
    case "email-whatsapp-nurturing":
      return "Mehr zurückgewonnene kalte Kontakte, da Leads automatisch zur richtigen Zeit nachgefasst werden.";
    case "crm-prozessoptimierung":
      return "Eine einheitliche, saubere Datenbasis und dokumentierte Prozesse für das gesamte Team.";
    default:
      return offer.shortDescription;
  }
}

function buildInternalSalesNote(
  offer: SynkroOffer,
  recommendationType: RecommendationType,
): string {
  if (recommendationType === "notRecommended") {
    return `Aktuell wenige Signale für ${offer.name} im Audit — nicht aktiv anbieten, außer der Kunde fragt gezielt danach.`;
  }
  const tier = recommendationType === "primary" ? "Hauptangebot" : "Zusatzangebot";
  return `${tier}: ${offer.salesAngle}`;
}

/**
 * Ranks every non-audit Synkro offer against the given audit. The single
 * highest-scoring offer becomes "primary" if it clears `PRIMARY_THRESHOLD`;
 * everything else above `SECONDARY_THRESHOLD` is a worthwhile "secondary"
 * add-on; the rest is returned as "notRecommended" so a consultant can see
 * the full picture rather than just the winners.
 */
export function recommendSynkroOffers(audit: OfferMatchInput): OfferRecommendation[] {
  const matches = MATCHERS.map((matcher) => matcher(audit)).sort(
    (a, b) => b.score - a.score,
  );

  return matches.map((match, index) => {
    const offer = getSynkroOfferById(match.offerId);
    if (!offer) {
      throw new Error(`Unknown Synkro offer id: ${match.offerId}`);
    }

    const recommendationType: RecommendationType =
      index === 0 && match.score >= PRIMARY_THRESHOLD
        ? "primary"
        : match.score >= SECONDARY_THRESHOLD
          ? "secondary"
          : "notRecommended";

    return {
      offer,
      fitScore: Math.round(match.score),
      recommendationType,
      reasons:
        match.reasons.length > 0
          ? match.reasons
          : ["Keine starken Signale aus dem Audit für dieses Angebot."],
      solvedProblems: match.solvedProblems,
      expectedImpact: buildExpectedImpact(offer, audit),
      internalSalesNote: buildInternalSalesNote(offer, recommendationType),
    };
  });
}
