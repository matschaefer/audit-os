/**
 * Small, reusable fixture builders for the business-logic unit tests
 * (audit-scoring.test.ts, offer-matching.test.ts). Not a test file itself.
 */

import type { AuditScoringInput } from "@/lib/audit-scoring";
import { calculateRoi, generateRecommendations } from "@/lib/audit-scoring";
import { PAIN_POINT_CATALOGUE } from "@/lib/constants";
import type { OfferMatchInput } from "@/lib/offer-matching";
import type {
  BusinessContext,
  Company,
  LeadSituation,
  ManualProcess,
  PainPoint,
  PainPointId,
} from "@/types/audit";

const BASE_COMPANY: Company = {
  name: "Rheinblick Immobilien GmbH",
  location: "Musterstadt",
  website: "https://example.com",
  employeeCount: 8,
  contactName: "Max Mustermann",
  contactRole: "Geschäftsführer",
};

const BASE_LEAD_SITUATION: LeadSituation = {
  leadsPerMonth: 40,
  avgResponseTimeHours: 3,
  viewingsPerMonth: 15,
  noShowRatePercent: 8,
  currentCrm: "OnOffice",
  currentTools: [],
};

const BASE_BUSINESS_CONTEXT: BusinessContext = {
  businessGoal: "faster_lead_handling",
  websiteQuality: "solid",
};

export function buildPainPoints(selectedIds: PainPointId[] = []): PainPoint[] {
  return PAIN_POINT_CATALOGUE.map((entry) => ({
    ...entry,
    selected: selectedIds.includes(entry.id),
  }));
}

export function buildScoringInput(
  overrides: Partial<AuditScoringInput> = {},
): AuditScoringInput {
  return {
    company: BASE_COMPANY,
    leadSituation: BASE_LEAD_SITUATION,
    painPoints: buildPainPoints(),
    manualProcesses: [],
    ...overrides,
  };
}

export function buildManualProcess(
  overrides: Partial<ManualProcess> = {},
): ManualProcess {
  return {
    id: overrides.id ?? "process-1",
    name: "Exposé senden",
    frequencyPerWeek: 10,
    durationMinutes: 15,
    automationLevel: "manual",
    ...overrides,
  };
}

export function buildOfferMatchInput(
  overrides: Partial<AuditScoringInput> & { businessContext?: BusinessContext } = {},
): OfferMatchInput {
  const scoring = buildScoringInput(overrides);
  const recommendations = generateRecommendations(scoring);
  const roiCalculation = calculateRoi(scoring, recommendations);

  return {
    ...scoring,
    businessContext: overrides.businessContext ?? BASE_BUSINESS_CONTEXT,
    roiCalculation,
  };
}
