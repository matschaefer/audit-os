import { describe, expect, it } from "vitest";

import {
  calculateAutomationPotential,
  calculateProcessScore,
  runAuditScoring,
} from "@/lib/audit-scoring";
import { buildManualProcess, buildPainPoints, buildScoringInput } from "@/lib/test-fixtures";

describe("audit-scoring", () => {
  it("keeps processScore and automationPotential within 0-100 for a healthy business", () => {
    const input = buildScoringInput({
      leadSituation: {
        leadsPerMonth: 20,
        avgResponseTimeHours: 0.5,
        viewingsPerMonth: 10,
        noShowRatePercent: 2,
        currentCrm: "Salesforce",
        currentTools: [],
      },
      painPoints: buildPainPoints(),
      manualProcesses: [],
    });

    const processScore = calculateProcessScore(input);
    const potential = calculateAutomationPotential(input);

    expect(processScore).toBeGreaterThanOrEqual(0);
    expect(processScore).toBeLessThanOrEqual(100);
    expect(potential).toBeGreaterThanOrEqual(0);
    expect(potential).toBeLessThanOrEqual(100);
  });

  it("keeps processScore and automationPotential within 0-100 for a very chaotic business", () => {
    const input = buildScoringInput({
      leadSituation: {
        leadsPerMonth: 500,
        avgResponseTimeHours: 96,
        viewingsPerMonth: 200,
        noShowRatePercent: 90,
        currentCrm: "Kein CRM",
        currentTools: [],
      },
      painPoints: buildPainPoints([
        "slow_lead_response",
        "manual_expose_requests",
        "manual_appointment_scheduling",
        "forgotten_followups",
        "messy_crm",
        "no_lead_prioritization",
        "manual_recurring_emails",
        "no_show_followup_missing",
        "website_low_quality_leads",
      ]),
      manualProcesses: Array.from({ length: 20 }, (_, i) =>
        buildManualProcess({ id: `p-${i}`, automationLevel: "manual" }),
      ),
    });

    const processScore = calculateProcessScore(input);
    const potential = calculateAutomationPotential(input);

    expect(processScore).toBeGreaterThanOrEqual(0);
    expect(processScore).toBeLessThanOrEqual(100);
    expect(potential).toBeGreaterThanOrEqual(0);
    expect(potential).toBeLessThanOrEqual(100);
  });

  it("does not crash on empty/weak data", () => {
    const input = buildScoringInput({
      leadSituation: {
        leadsPerMonth: 0,
        avgResponseTimeHours: 0,
        viewingsPerMonth: 0,
        noShowRatePercent: 0,
        currentCrm: "Kein CRM",
        currentTools: [],
      },
      painPoints: [],
      manualProcesses: [],
    });

    expect(() => runAuditScoring(input)).not.toThrow();

    const result = runAuditScoring(input);
    expect(result.scores.processScore).toBeGreaterThanOrEqual(0);
    expect(result.scores.automationPotentialPercent).toBeGreaterThanOrEqual(0);
    expect(result.roiCalculation.monthlyTimeSavingsHours).toBeGreaterThanOrEqual(0);
  });

  it("produces deterministic output for identical inputs", () => {
    const input = buildScoringInput({
      painPoints: buildPainPoints(["slow_lead_response", "messy_crm"]),
      manualProcesses: [buildManualProcess()],
    });

    const first = runAuditScoring(input);
    const second = runAuditScoring(input);

    expect(second).toEqual(first);
  });
});
