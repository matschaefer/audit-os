/**
 * Generates the narrative text sections of the client-facing audit report
 * (executive summary, current-state description, implementation plan) from
 * structured audit data.
 *
 * This is intentionally rule-based text templating rather than an AI call —
 * it keeps Phase 1 fully offline while producing report copy that already
 * reads naturally. Phase 2 can swap `buildExecutiveSummary` for an LLM call
 * without touching any callers, since the function signature only depends
 * on the `Audit` shape.
 */

import { formatCurrencyEur, formatNumber, formatPercent } from "@/lib/format";
import type { Audit, Recommendation } from "@/types/audit";

/** Renders hours without a trailing period, for mid-sentence use. */
function hoursInline(hours: number): string {
  return `${formatNumber(hours, hours < 10 ? 1 : 0)} Std`;
}

export function buildExecutiveSummary(audit: Audit): string {
  const { company, scores, roiCalculation, leadSituation } = audit;

  return (
    `${company.name} bearbeitet aktuell ${leadSituation.leadsPerMonth} Leads pro Monat bei einer ` +
    `durchschnittlichen Erstantwortzeit von ${hoursInline(leadSituation.avgResponseTimeHours)}. ` +
    `Unsere Analyse zeigt ein Automatisierungspotenzial von ${formatPercent(scores.automationPotentialPercent)} ` +
    `bei einem aktuellen Prozess-Score von ${scores.processScore}/100. Durch die Umsetzung der nachfolgenden ` +
    `Empfehlungen lassen sich schätzungsweise ${hoursInline(roiCalculation.monthlyTimeSavingsHours)} pro Monat ` +
    `einsparen — das entspricht einer monatlichen Kosteneinsparung von ${formatCurrencyEur(
      roiCalculation.monthlyCostSavingsEur,
    )} bzw. ${formatCurrencyEur(roiCalculation.annualSavingsEur)} pro Jahr.`
  );
}

export function buildCurrentStateSummary(audit: Audit): string {
  const { leadSituation, manualProcesses } = audit;
  const manualCount = manualProcesses.filter(
    (p) => p.automationLevel === "manual",
  ).length;

  return (
    `Leads werden aktuell über ${leadSituation.currentCrm} verwaltet. Von ${manualProcesses.length} ` +
    `erfassten wiederkehrenden Prozessen laufen ${manualCount} vollständig manuell. Bei ` +
    `${leadSituation.viewingsPerMonth} Besichtigungen pro Monat liegt die No-Show-Rate bei ` +
    `${formatPercent(leadSituation.noShowRatePercent)} — ein deutliches Signal für fehlende automatisierte ` +
    `Erinnerungs- und Bestätigungsprozesse.`
  );
}

export interface ImplementationPhase {
  range: string;
  title: string;
  description: string;
}

/**
 * Builds a simple, always-4-phase 14-day rollout plan. The two "quick win"
 * slots are filled with the highest-priority recommendations so the plan
 * reflects what was actually found during the audit, while the structure
 * itself (kickoff → quick wins → rollout → handover) stays consistent
 * across every report.
 */
export function build14DayPlan(
  recommendations: Recommendation[],
): ImplementationPhase[] {
  const [firstQuickWin, secondQuickWin] = recommendations;

  return [
    {
      range: "Tag 1–3",
      title: "Kickoff & Systemzugänge",
      description:
        "Gemeinsames Kickoff-Gespräch, Einrichtung der Zugriffe auf CRM/Tools und finale Abstimmung der Prioritäten aus dem Audit.",
    },
    {
      range: "Tag 4–7",
      title: "Quick Wins umsetzen",
      description: firstQuickWin
        ? `Umsetzung von "${firstQuickWin.title}"${
            secondQuickWin ? ` und "${secondQuickWin.title}"` : ""
          } als erste sichtbare Verbesserungen.`
        : "Umsetzung der ersten priorisierten Automatisierung.",
    },
    {
      range: "Tag 8–11",
      title: "Rollout weiterer Automatisierungen",
      description:
        "Schrittweise Aktivierung der verbleibenden Empfehlungen inklusive Einweisung des Teams.",
    },
    {
      range: "Tag 12–14",
      title: "Test, Feinschliff & Übergabe",
      description:
        "Gemeinsamer Test aller Workflows, letzte Anpassungen und Übergabe an das Team des Kunden.",
    },
  ];
}
