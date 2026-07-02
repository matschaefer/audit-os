import {
  AlertTriangle,
  Clock3,
  FileCheck2,
  PlusCircle,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { AuditList } from "@/components/dashboard/audit-list";
import { AuditMiniList } from "@/components/dashboard/audit-mini-list";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PipelineOverview } from "@/components/dashboard/pipeline-overview";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SALES_PRIORITY_LABELS } from "@/lib/constants";
import { demoAudits, getAuditSummaries, getDashboardKpis } from "@/lib/demo-data";
import { formatCurrencyEur, formatHours, formatPercent } from "@/lib/format";

export default function WorkspacePage() {
  const auditSummaries = getAuditSummaries();
  const kpis = getDashboardKpis();

  const openOpportunities = demoAudits.filter(
    (a) => a.status !== "proposal_sent",
  ).length;

  const highPotential = [...demoAudits]
    .sort(
      (a, b) =>
        b.scores.automationPotentialPercent - a.scores.automationPotentialPercent,
    )
    .slice(0, 3)
    .map((audit) => ({
      id: audit.id,
      title: audit.company.name,
      subtitle: `${audit.scores.automationPotentialPercent}% Automatisierungspotenzial · ${formatCurrencyEur(audit.roiCalculation.monthlyCostSavingsEur)}/Monat`,
      href: `/audits/${audit.id}`,
    }));

  const reportsReady = demoAudits
    .filter((a) => a.status === "report_ready" || a.status === "proposal_sent")
    .map((audit) => ({
      id: audit.id,
      title: audit.company.name,
      subtitle: `Report erstellt für ${audit.company.contactName}`,
      href: `/audits/${audit.id}/report`,
    }));

  const nextActions = [...demoAudits]
    .sort((a, b) => {
      const weight = { high: 3, medium: 2, low: 1 };
      return (
        weight[b.consultantAssessment.salesPriority] -
        weight[a.consultantAssessment.salesPriority]
      );
    })
    .map((audit) => ({
      id: audit.id,
      title: audit.company.name,
      subtitle: audit.consultantAssessment.recommendedNextStep,
      href: `/audits/${audit.id}`,
      trailing: (
        <Badge
          variant={
            audit.consultantAssessment.salesPriority === "high"
              ? "danger"
              : audit.consultantAssessment.salesPriority === "medium"
                ? "warning"
                : "neutral"
          }
        >
          {SALES_PRIORITY_LABELS[audit.consultantAssessment.salesPriority]}
        </Badge>
      ),
    }));

  return (
    <AppShell
      title="Workspace"
      description="Interner Überblick über Kundenaudits und die Automatisierungs-Pipeline."
      actions={
        <Button href="/audits/new">
          <PlusCircle className="h-4 w-4" />
          Kundenaudit erstellen
        </Button>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          icon={PlusCircle}
          label="Kundenaudits"
          value={String(kpis.totalAudits)}
          hint="Audits gesamt im Workspace"
        />
        <KpiCard
          icon={TrendingUp}
          label="Aktive Potenziale"
          value={String(openOpportunities)}
          hint="Noch nicht im Angebotsstadium"
        />
        <KpiCard
          icon={Wallet}
          label="Automatisierungspotenzial"
          value={formatPercent(kpis.avgAutomationPotentialPercent)}
          hint="Durchschnitt über alle Audits"
        />
        <KpiCard
          icon={Clock3}
          label="Geschätzte monatliche Einsparung"
          value={formatHours(kpis.totalMonthlyTimeSavingsHours)}
          hint={`≈ ${formatCurrencyEur(kpis.totalMonthlyCostSavingsEur)} über alle Kunden`}
          accent="success"
        />
        <KpiCard
          icon={FileCheck2}
          label="Vorbereitete Reports"
          value={String(kpis.reportsPreparedCount)}
          hint="Bereit oder bereits an Kunden versendet"
          accent="warning"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Follow-up erforderlich"
          value={String(kpis.followUpRequiredCount)}
          hint="Entwurf oder in Prüfung"
          accent="danger"
        />
      </div>

      <div className="mt-8">
        <PipelineOverview audits={demoAudits} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <AuditMiniList
          title="Potenziale mit hoher Priorität"
          description="Sortiert nach Automatisierungspotenzial"
          items={highPotential}
          emptyLabel="Noch keine Audits vorhanden."
        />
        <AuditMiniList
          title="Reports bereit zur Kundenprüfung"
          description="Vorbereitete Reports, die auf Versand oder Follow-up warten"
          items={reportsReady}
          emptyLabel="Noch keine Reports bereit."
        />
        <AuditMiniList
          title="Nächste Schritte"
          description="Empfohlener nächster Schritt je Kunde"
          items={nextActions}
          emptyLabel="Derzeit nichts zu tun."
        />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-dark">
            Letzte Kundenaudits
          </h2>
          <Button href="/audits" variant="ghost" size="sm">
            Alle anzeigen
          </Button>
        </div>
        <AuditList audits={auditSummaries} />
      </div>
    </AppShell>
  );
}
