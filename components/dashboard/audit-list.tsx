import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AUDIT_STATUS_LABELS, SALES_PRIORITY_LABELS } from "@/lib/constants";
import { formatCurrencyEur, formatDate, formatHours } from "@/lib/format";
import type { AuditSummary, AuditStatus, SalesPriority } from "@/types/audit";

function potentialBadgeVariant(percent: number) {
  if (percent >= 60) return "danger" as const;
  if (percent >= 35) return "warning" as const;
  return "success" as const;
}

function statusBadgeVariant(status: AuditStatus) {
  if (status === "proposal_sent") return "primary" as const;
  if (status === "report_ready") return "success" as const;
  if (status === "in_review") return "warning" as const;
  return "neutral" as const;
}

function priorityBadgeVariant(priority: SalesPriority) {
  if (priority === "high") return "danger" as const;
  if (priority === "medium") return "warning" as const;
  return "neutral" as const;
}

interface AuditListProps {
  audits: AuditSummary[];
}

export function AuditList({ audits }: AuditListProps) {
  if (audits.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <p className="text-sm font-medium text-brand-dark">
          Noch keine Kundenaudits
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Erstelle das erste Kundenaudit, um Prozess-Score, ROI-Prognose und
          Empfehlungen für ein Maklerbüro zu erzeugen.
        </p>
        <Button href="/audits/new" className="mt-2">
          Kundenaudit erstellen
        </Button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      {/* Table layout on md+ screens */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Liste der vorbereiteten Kundenaudits</caption>
          <thead className="border-b border-border-subtle bg-surface-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                Kunde
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Empfehlung
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Priorität
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Automatisierungspotenzial
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Geschätzte Einsparung/Monat
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Erstellt am
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Aktionen</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {audits.map((audit) => (
              <tr
                key={audit.id}
                className="transition-colors hover:bg-surface-muted/60"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-brand-dark">
                    {audit.companyName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {audit.companyLocation}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="primary">{audit.recommendedOfferName}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusBadgeVariant(audit.status)}>
                    {AUDIT_STATUS_LABELS[audit.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={priorityBadgeVariant(audit.salesPriority)}>
                    {SALES_PRIORITY_LABELS[audit.salesPriority]}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={potentialBadgeVariant(
                      audit.scores.automationPotentialPercent,
                    )}
                  >
                    {audit.scores.automationPotentialPercent}%
                  </Badge>
                </td>
                <td className="px-6 py-4 text-brand-dark">
                  {formatHours(audit.roiCalculation.monthlyTimeSavingsHours)} ·{" "}
                  {formatCurrencyEur(audit.roiCalculation.monthlyCostSavingsEur)}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatDate(audit.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button href={`/audits/${audit.id}`} variant="ghost" size="sm">
                    Öffnen
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked cards on small screens */}
      <div className="divide-y divide-border-subtle md:hidden">
        {audits.map((audit) => (
          <div key={audit.id} className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-brand-dark">{audit.companyName}</p>
                <p className="text-xs text-muted-foreground">{audit.companyLocation}</p>
              </div>
              <Badge variant={statusBadgeVariant(audit.status)}>
                {AUDIT_STATUS_LABELS[audit.status]}
              </Badge>
            </div>
            <Badge variant="primary" className="w-fit">
              {audit.recommendedOfferName}
            </Badge>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Automatisierungspotenzial</p>
                <p className="font-medium text-brand-dark">
                  {audit.scores.automationPotentialPercent}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Einsparung/Monat</p>
                <p className="font-medium text-brand-dark">
                  {formatCurrencyEur(audit.roiCalculation.monthlyCostSavingsEur)}
                </p>
              </div>
            </div>
            <Button href={`/audits/${audit.id}`} variant="secondary" size="sm" className="justify-center">
              Audit öffnen
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
