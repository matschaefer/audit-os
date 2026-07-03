import { FileText, Info } from "lucide-react";
import { notFound } from "next/navigation";

import { CompanyOverviewCard } from "@/components/audit/company-overview-card";
import { InternalAssessmentCard } from "@/components/audit/internal-assessment-card";
import { OfferRecommendationPanel } from "@/components/audit/offer-recommendation-panel";
import { PainPointList } from "@/components/audit/pain-point-list";
import { ProcessTable } from "@/components/audit/process-table";
import { RecommendationCard } from "@/components/audit/recommendation-card";
import { RoiSummary } from "@/components/audit/roi-summary";
import { ScoreGauge } from "@/components/audit/score-gauge";
import { AppShell } from "@/components/layout/app-shell";
import { DemoDataBadge } from "@/components/shared/demo-data-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AUDIT_STATUS_LABELS } from "@/lib/constants";
import { DEMO_AUDIT_ID, getAuditById } from "@/lib/demo-data";
import { formatCurrencyEur, formatHours } from "@/lib/format";
import { recommendSynkroOffers } from "@/lib/offer-matching";

interface AuditDetailPageProps {
  params: Promise<{ id: string }>;
}

function statusBadgeVariant(status: string) {
  if (status === "proposal_sent") return "primary" as const;
  if (status === "report_ready") return "success" as const;
  if (status === "in_review") return "warning" as const;
  return "neutral" as const;
}

export default async function AuditDetailPage({ params }: AuditDetailPageProps) {
  const { id } = await params;
  const audit = getAuditById(id);

  if (!audit) {
    notFound();
  }

  const offerRecommendations = recommendSynkroOffers(audit);

  return (
    <AppShell
      title={audit.company.name}
      description={`Interne Auditansicht · erstellt für ${audit.company.contactName}`}
      actions={
        <Button href={`/audits/${audit.id}/report`}>
          <FileText className="h-4 w-4" />
          Report ansehen
        </Button>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant={statusBadgeVariant(audit.status)}>
          {AUDIT_STATUS_LABELS[audit.status]}
        </Badge>
        <DemoDataBadge />
      </div>

      {id === DEMO_AUDIT_ID ? (
        <Card className="mb-6 border-brand-accent/60 bg-brand-accent/10">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
            <p className="text-sm text-brand-dark">
              Rheinblick Immobilien GmbH ist ein fiktiver Demo-Kunde. Alle
              Daten, Kennzahlen, Ansprechpartner, Prozesse und Empfehlungen
              dienen ausschließlich der Demonstration.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CompanyOverviewCard
            company={audit.company}
            leadSituation={audit.leadSituation}
          />
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-6 py-8 sm:flex-row lg:flex-col">
            <ScoreGauge
              value={audit.scores.processScore}
              label="Prozess-Score"
              sublabel="Aktuelle Prozessgesundheit"
              colorClassName={
                audit.scores.processScore >= 60
                  ? "text-success"
                  : audit.scores.processScore >= 35
                    ? "text-warning"
                    : "text-danger"
              }
            />
            <ScoreGauge
              value={audit.scores.automationPotentialPercent}
              label="Automatisierungspotenzial"
              sublabel="Realistisch erschließbar"
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <InternalAssessmentCard assessment={audit.consultantAssessment} />
      </div>

      <div className="mt-6">
        <OfferRecommendationPanel recommendations={offerRecommendations} />
      </div>

      <div className="mt-6">
        <RoiSummary roi={audit.roiCalculation} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PainPointList painPoints={audit.painPoints} />
        </div>
        <div className="lg:col-span-2">
          <ProcessTable processes={audit.manualProcesses} />
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-dark">
            Automatisierungshebel & empfohlene Maßnahmen
          </h2>
          <p className="text-sm text-muted-foreground">
            {formatHours(audit.roiCalculation.monthlyTimeSavingsHours)} /
            Monat · {formatCurrencyEur(audit.roiCalculation.monthlyCostSavingsEur)} / Monat
          </p>
        </div>
        {audit.recommendations.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {audit.recommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                index={index}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-sm text-muted-foreground">
              Aus den erfassten Daten ergibt sich aktuell keine priorisierte
              Automatisierungsmaßnahme.
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
