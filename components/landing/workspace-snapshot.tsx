import { AUDIT_STATUS_LABELS } from "@/lib/constants";
import { DemoDataBadge } from "@/components/shared/demo-data-badge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrencyEur, formatHours } from "@/lib/format";
import { demoAudits } from "@/lib/demo-data";

const PRIORITY_LABEL: Record<string, string> = {
  high: "Hoch",
  medium: "Mittel",
  low: "Niedrig",
};

/** Compact, static preview of a client audit as it appears inside the workspace. */
export function WorkspaceSnapshot() {
  const audit = demoAudits[0];

  return (
    <Card className="mx-auto max-w-3xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-subtle bg-surface-muted px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-brand-dark">
            {audit.company.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {audit.company.location} · Kundenaudit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary">{AUDIT_STATUS_LABELS[audit.status]}</Badge>
          <DemoDataBadge />
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Prozess-Score
          </p>
          <p className="mt-2 text-2xl font-semibold text-brand-dark">
            {audit.scores.processScore}/100
          </p>
          <Progress value={audit.scores.processScore} className="mt-3" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Geschätzte Einsparung/Monat
          </p>
          <p className="mt-2 text-2xl font-semibold text-brand-dark">
            {formatHours(audit.roiCalculation.monthlyTimeSavingsHours)}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            ≈ {formatCurrencyEur(audit.roiCalculation.monthlyCostSavingsEur)} / Monat
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Automatisierungspotenzial
          </p>
          <p className="mt-2 text-2xl font-semibold text-brand-dark">
            {audit.scores.automationPotentialPercent}%
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Amortisation in {audit.roiCalculation.paybackPeriodMonths} Monaten
          </p>
        </div>
      </div>

      <div className="space-y-3 border-t border-border-subtle p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Top-Empfehlungen
        </p>
        {audit.recommendations.slice(0, 3).map((rec) => (
          <div
            key={rec.id}
            className="flex items-center justify-between rounded-lg bg-surface-muted px-4 py-3"
          >
            <span className="text-sm font-medium text-brand-dark">
              {rec.title}
            </span>
            <Badge
              variant={
                rec.priority === "high"
                  ? "danger"
                  : rec.priority === "medium"
                    ? "warning"
                    : "neutral"
              }
            >
              {PRIORITY_LABEL[rec.priority]}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
