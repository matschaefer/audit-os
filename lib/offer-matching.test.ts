import { describe, expect, it } from "vitest";

import { recommendSynkroOffers } from "@/lib/offer-matching";
import { buildManualProcess, buildOfferMatchInput, buildPainPoints } from "@/lib/test-fixtures";

describe("offer-matching", () => {
  it("keeps every fit score between 0 and 100", () => {
    const inputs = [
      buildOfferMatchInput(),
      buildOfferMatchInput({
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
        manualProcesses: Array.from({ length: 10 }, (_, i) =>
          buildManualProcess({ id: `p-${i}` }),
        ),
        businessContext: { businessGoal: "full_process_optimization", websiteQuality: "none" },
      }),
    ];

    for (const input of inputs) {
      const recommendations = recommendSynkroOffers(input);
      for (const recommendation of recommendations) {
        expect(recommendation.fitScore).toBeGreaterThanOrEqual(0);
        expect(recommendation.fitScore).toBeLessThanOrEqual(100);
      }
    }
  });

  it("recommends Lead & Terminprozess for many leads and a high response time", () => {
    const input = buildOfferMatchInput({
      leadSituation: {
        leadsPerMonth: 150,
        avgResponseTimeHours: 20,
        viewingsPerMonth: 40,
        noShowRatePercent: 10,
        currentCrm: "OnOffice",
        currentTools: [],
      },
      painPoints: buildPainPoints([
        "manual_appointment_scheduling",
        "manual_expose_requests",
        "forgotten_followups",
      ]),
      businessContext: { businessGoal: "faster_lead_handling", websiteQuality: "solid" },
    });

    const recommendations = recommendSynkroOffers(input);
    const top = recommendations[0];

    expect(top.offer.id).toBe("lead-terminprozess");
    expect(top.recommendationType).toBe("primary");
  });

  it("recommends Verkäufergewinnung for a weak seller/owner pipeline", () => {
    const input = buildOfferMatchInput({
      leadSituation: {
        leadsPerMonth: 40,
        avgResponseTimeHours: 3,
        viewingsPerMonth: 15,
        noShowRatePercent: 8,
        currentCrm: "Kein CRM",
        currentTools: [],
      },
      painPoints: buildPainPoints(),
      businessContext: { businessGoal: "more_seller_leads", websiteQuality: "none" },
    });

    const recommendations = recommendSynkroOffers(input);
    const top = recommendations[0];

    expect(top.offer.id).toBe("verkaeufergewinnung");
    expect(top.recommendationType).toBe("primary");
  });

  it("recommends CRM & Prozessoptimierung for Excel/Outlook with many manual processes", () => {
    const input = buildOfferMatchInput({
      leadSituation: {
        leadsPerMonth: 40,
        avgResponseTimeHours: 3,
        viewingsPerMonth: 15,
        noShowRatePercent: 8,
        currentCrm: "Excel + Outlook",
        currentTools: ["Excel", "Outlook"],
      },
      painPoints: buildPainPoints(["messy_crm"]),
      manualProcesses: Array.from({ length: 8 }, (_, i) =>
        buildManualProcess({ id: `p-${i}`, automationLevel: "manual" }),
      ),
      businessContext: { businessGoal: "reduce_admin_work", websiteQuality: "solid" },
    });

    const recommendations = recommendSynkroOffers(input);
    const top = recommendations[0];

    expect(top.offer.id).toBe("crm-prozessoptimierung");
    expect(top.recommendationType).toBe("primary");
  });

  it("does not crash on empty/weak data", () => {
    const input = buildOfferMatchInput({
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

    expect(() => recommendSynkroOffers(input)).not.toThrow();
    expect(recommendSynkroOffers(input).length).toBeGreaterThan(0);
  });

  it("produces deterministic output for identical inputs", () => {
    const input = buildOfferMatchInput({
      painPoints: buildPainPoints(["slow_lead_response", "messy_crm"]),
      manualProcesses: [buildManualProcess()],
    });

    const first = recommendSynkroOffers(input);
    const second = recommendSynkroOffers(input);

    expect(second).toEqual(first);
  });
});
