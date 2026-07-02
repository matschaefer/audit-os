"use client";

import { Sparkles } from "lucide-react";
import { type FormEvent, useState } from "react";

import { AuditResultsPreview } from "@/components/audit/form/audit-results-preview";
import { BusinessGoalSection } from "@/components/audit/form/business-goal-section";
import { CompanySection } from "@/components/audit/form/company-section";
import {
  ConsultantContextSection,
  type ConsultantContextState,
} from "@/components/audit/form/consultant-context-section";
import { LeadSituationSection } from "@/components/audit/form/lead-situation-section";
import { ManualProcessesSection } from "@/components/audit/form/manual-processes-section";
import { PainPointsSection } from "@/components/audit/form/pain-points-section";
import { Button } from "@/components/ui/button";
import { runAuditScoring } from "@/lib/audit-scoring";
import { PAIN_POINT_CATALOGUE, SUGGESTED_MANUAL_PROCESSES } from "@/lib/constants";
import { recommendSynkroOffers } from "@/lib/offer-matching";
import type {
  AuditScores,
  BusinessContext,
  Company,
  LeadSituation,
  ManualProcess,
  OfferRecommendation,
  PainPoint,
  Recommendation,
  RoiCalculation,
} from "@/types/audit";

const INITIAL_COMPANY: Company = {
  name: "",
  location: "",
  website: "",
  employeeCount: 5,
  contactName: "",
  contactRole: "",
};

const INITIAL_LEAD_SITUATION: LeadSituation = {
  leadsPerMonth: 80,
  avgResponseTimeHours: 8,
  viewingsPerMonth: 25,
  noShowRatePercent: 15,
  currentCrm: "Excel + Outlook",
  currentTools: ["Excel", "Outlook"],
};

const INITIAL_PAIN_POINTS: PainPoint[] = PAIN_POINT_CATALOGUE.map((entry) => ({
  ...entry,
  selected: false,
}));

function initialProcesses(): ManualProcess[] {
  return SUGGESTED_MANUAL_PROCESSES.map((name) => ({
    id: crypto.randomUUID(),
    name,
    frequencyPerWeek: 10,
    durationMinutes: 10,
    automationLevel: "manual" as const,
  }));
}

const INITIAL_CONSULTANT_CONTEXT: ConsultantContextState = {
  discoveryNotes: "",
  decisionMakerContext: "",
  processMaturity: "low",
  salesPriority: "medium",
};

const INITIAL_BUSINESS_CONTEXT: BusinessContext = {
  businessGoal: "faster_lead_handling",
  websiteQuality: "weak",
};

interface AuditResult {
  scores: AuditScores;
  recommendations: Recommendation[];
  roiCalculation: RoiCalculation;
  offerRecommendations: OfferRecommendation[];
}

export function AuditForm() {
  const [company, setCompany] = useState<Company>(INITIAL_COMPANY);
  const [leadSituation, setLeadSituation] = useState<LeadSituation>(
    INITIAL_LEAD_SITUATION,
  );
  const [painPoints, setPainPoints] = useState<PainPoint[]>(INITIAL_PAIN_POINTS);
  const [processes, setProcesses] = useState<ManualProcess[]>(initialProcesses);
  const [consultantContext, setConsultantContext] = useState<ConsultantContextState>(
    INITIAL_CONSULTANT_CONTEXT,
  );
  const [businessContext, setBusinessContext] = useState<BusinessContext>(
    INITIAL_BUSINESS_CONTEXT,
  );
  const [result, setResult] = useState<AuditResult | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const scoringResult = runAuditScoring({
      company,
      leadSituation,
      painPoints,
      manualProcesses: processes,
    });
    const offerRecommendations = recommendSynkroOffers({
      company,
      leadSituation,
      painPoints,
      manualProcesses: processes,
      businessContext,
      roiCalculation: scoringResult.roiCalculation,
    });
    setResult({ ...scoringResult, offerRecommendations });

    requestAnimationFrame(() => {
      document
        .getElementById("audit-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <CompanySection company={company} onChange={setCompany} />
        <LeadSituationSection
          leadSituation={leadSituation}
          onChange={setLeadSituation}
        />
        <PainPointsSection painPoints={painPoints} onChange={setPainPoints} />
        <ManualProcessesSection processes={processes} onChange={setProcesses} />
        <BusinessGoalSection value={businessContext} onChange={setBusinessContext} />
        <ConsultantContextSection
          value={consultantContext}
          onChange={setConsultantContext}
        />

        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-brand-primary/40 bg-brand-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Die Auswertung läuft vollständig über die lokale Synkro
            Scoring-Engine — in dieser Phase-1-Version wird nichts gespeichert
            oder extern gesendet.
          </p>
          <Button type="submit" size="lg" className="shrink-0">
            <Sparkles className="h-4 w-4" />
            Audit berechnen
          </Button>
        </div>
      </form>

      {result ? (
        <div id="audit-results" className="scroll-mt-8">
          <AuditResultsPreview
            scores={result.scores}
            recommendations={result.recommendations}
            roiCalculation={result.roiCalculation}
            offerRecommendations={result.offerRecommendations}
          />
        </div>
      ) : null}
    </div>
  );
}
