import { ArrowUpRight, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AUDIT_STATUS_LABELS } from "@/lib/constants";
import { formatCurrencyEur, formatDate } from "@/lib/format";
import type { Audit } from "@/types/audit";

interface ReportCardProps {
  audit: Audit;
}

export function ReportCard({ audit }: ReportCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-brand-dark">{audit.company.name}</p>
              <p className="text-xs text-muted-foreground">
                {audit.company.location} · Erstellt am {formatDate(audit.createdAt)}
              </p>
            </div>
          </div>
          <Badge
            variant={audit.status === "proposal_sent" ? "primary" : "success"}
          >
            {AUDIT_STATUS_LABELS[audit.status]}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Automatisierungspotenzial</p>
            <p className="font-medium text-brand-dark">
              {audit.scores.automationPotentialPercent}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Geschätzte monatliche Einsparung</p>
            <p className="font-medium text-brand-dark">
              {formatCurrencyEur(audit.roiCalculation.monthlyCostSavingsEur)}
            </p>
          </div>
        </div>

        <Button href={`/audits/${audit.id}/report`} variant="secondary" size="sm" className="justify-center">
          Report ansehen
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
