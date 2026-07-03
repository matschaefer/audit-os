import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  ClipboardList,
  Download,
  FileText,
  Info,
  Lightbulb,
  Sparkles,
  Wallet,
} from "lucide-react";
import { notFound } from "next/navigation";

import { ImplementationTimeline } from "@/components/report/implementation-timeline";
import { MeasurePlanSection } from "@/components/report/measure-plan-section";
import { NextStepsCta } from "@/components/report/next-steps-cta";
import { ReportHeader } from "@/components/report/report-header";
import { ReportSection } from "@/components/report/report-section";
import { RoiTable } from "@/components/report/roi-table";
import { DemoDataBadge } from "@/components/shared/demo-data-badge";
import { DemoPrivacyNotice } from "@/components/shared/demo-privacy-notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_AUDIT_ID, getAuditById } from "@/lib/demo-data";
import { formatHours } from "@/lib/format";
import { recommendSynkroOffers } from "@/lib/offer-matching";
import {
  build14DayPlan,
  buildCurrentStateSummary,
  buildExecutiveSummary,
} from "@/lib/report-narrative";
import type { AuditStatus } from "@/types/audit";

interface AuditReportPageProps {
  params: Promise<{ id: string }>;
}

const PRIORITY_LABEL = {
  high: "Hoch",
  medium: "Mittel",
  low: "Niedrig",
};

const REPORT_READINESS: Record<
  AuditStatus,
  { label: string; variant: "neutral" | "warning" | "success" | "primary" }
> = {
  draft: { label: "Entwurfsvorschau", variant: "neutral" },
  in_review: { label: "Entwurfsvorschau", variant: "warning" },
  report_ready: { label: "Bereit zur Prüfung", variant: "success" },
  proposal_sent: { label: "An Kunden gesendet", variant: "primary" },
};

export default async function AuditReportPage({ params }: AuditReportPageProps) {
  const { id } = await params;
  const audit = getAuditById(id);

  if (!audit) {
    notFound();
  }

  const selectedPainPoints = audit.painPoints.filter((p) => p.selected);
  const implementationPlan = build14DayPlan(audit.recommendations);
  const readiness = REPORT_READINESS[audit.status];

  const offerRecommendations = recommendSynkroOffers(audit);
  const primaryOffer = offerRecommendations.find(
    (r) => r.recommendationType === "primary",
  );
  const nextStepOffer = offerRecommendations.find(
    (r) => r.recommendationType === "secondary",
  );

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-surface/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Button href={`/audits/${audit.id}`} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Zurück zum Audit
          </Button>
          <Button variant="secondary" size="sm" disabled title="PDF-Export folgt in Phase 2">
            <Download className="h-4 w-4" />
            Als PDF exportieren
          </Button>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Vorschau des kundenfähigen Reports · Erstellt von Synkro
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <DemoPrivacyNotice />
            {id === DEMO_AUDIT_ID ? <DemoDataBadge /> : null}
            <Badge variant={readiness.variant}>Status: {readiness.label}</Badge>
          </div>
        </div>

        <ReportHeader audit={audit} />

        {id === DEMO_AUDIT_ID ? (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-brand-accent/60 bg-brand-accent/10 px-5 py-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
            <p className="text-sm text-brand-dark">
              Rheinblick Immobilien GmbH ist ein fiktiver Demo-Kunde. Alle
              Daten, Kennzahlen, Ansprechpartner, Prozesse und Empfehlungen
              dienen ausschließlich der Demonstration.
            </p>
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-border-subtle bg-surface px-8 py-4 sm:px-12">
          <ReportSection icon={Sparkles} number="01" title="Executive Summary">
            <p className="text-base leading-relaxed text-brand-dark">
              {buildExecutiveSummary(audit)}
            </p>
          </ReportSection>

          <ReportSection icon={ClipboardList} number="02" title="Ausgangssituation">
            <p className="leading-relaxed text-muted-foreground">
              {buildCurrentStateSummary(audit)}
            </p>
          </ReportSection>

          <ReportSection
            icon={AlertTriangle}
            number="03"
            title="Erkannte Prozessprobleme"
          >
            {selectedPainPoints.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {selectedPainPoints.map((point) => (
                  <li
                    key={point.id}
                    className="flex items-start gap-2 rounded-lg bg-surface-muted px-4 py-3 text-sm text-brand-dark"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    {point.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Im Audit wurden keine akuten Prozessprobleme markiert.
              </p>
            )}
          </ReportSection>

          <ReportSection
            icon={Sparkles}
            number="04"
            title="Automatisierungspotenziale & empfohlene Maßnahmen"
          >
            {audit.recommendations.length > 0 ? (
              <div className="space-y-4">
                {audit.recommendations.map((rec, index) => (
                  <div
                    key={rec.id}
                    className="rounded-lg border border-border-subtle p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-brand-dark">
                        {index + 1}. {rec.title}
                      </p>
                      <Badge
                        variant={
                          rec.priority === "high"
                            ? "danger"
                            : rec.priority === "medium"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        Priorität: {PRIORITY_LABEL[rec.priority]}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {rec.description}
                    </p>
                    <p className="mt-2 text-sm font-medium text-brand-primary">
                      {rec.impactEstimate}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aus den erfassten Daten ergibt sich aktuell keine priorisierte
                Automatisierungsmaßnahme.
              </p>
            )}
          </ReportSection>

          <ReportSection
            icon={Lightbulb}
            number="05"
            title="Empfohlener Maßnahmenplan"
          >
            {primaryOffer ? (
              <MeasurePlanSection primary={primaryOffer} nextStep={nextStepOffer} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Die erfassten Prozesse sind bereits solide aufgestellt — aktuell
                ergibt sich keine vordringliche Zusatzempfehlung.
              </p>
            )}
          </ReportSection>

          <ReportSection
            icon={Wallet}
            number="06"
            title="Geschätzte Zeitersparnis & ROI-Kalkulation"
          >
            <p className="mb-5 text-sm text-muted-foreground">
              Bei Umsetzung aller Empfehlungen ergibt sich eine geschätzte
              Zeitersparnis von{" "}
              <span className="font-semibold text-brand-dark">
                {formatHours(audit.roiCalculation.monthlyTimeSavingsHours)}
              </span>{" "}
              pro Monat.
            </p>
            <RoiTable roi={audit.roiCalculation} />
          </ReportSection>

          <ReportSection
            icon={CalendarClock}
            number="07"
            title="14-Tage-Umsetzungsplan"
          >
            <ImplementationTimeline phases={implementationPlan} />
          </ReportSection>

          <ReportSection icon={FileText} number="08" title="Nächster Schritt">
            <NextStepsCta />
          </ReportSection>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Erstellt mit Synkro Audit OS · Dieser Report basiert auf den im
          Audit-Interview erfassten Angaben und stellt eine Schätzung dar.
        </p>
      </main>
    </div>
  );
}
