import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AUDIT_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Audit, AuditStatus } from "@/types/audit";

const PIPELINE_STAGES: AuditStatus[] = [
  "draft",
  "in_review",
  "report_ready",
  "proposal_sent",
];

const STAGE_ACCENT: Record<AuditStatus, string> = {
  draft: "border-t-muted-foreground/40",
  in_review: "border-t-warning",
  report_ready: "border-t-success",
  proposal_sent: "border-t-brand-primary",
};

interface PipelineOverviewProps {
  audits: Audit[];
}

/** Kanban-style snapshot of where every client audit sits in the engagement pipeline. */
export function PipelineOverview({ audits }: PipelineOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktuelle Audit-Pipeline</CardTitle>
        <p className="text-sm text-muted-foreground">
          Kundenaudits gruppiert nach Bearbeitungsstatus.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageAudits = audits.filter((a) => a.status === stage);

            return (
              <div
                key={stage}
                className={cn(
                  "rounded-lg border border-border-subtle border-t-2 bg-surface-muted p-4",
                  STAGE_ACCENT[stage],
                )}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {AUDIT_STATUS_LABELS[stage]}
                </p>
                <p className="mt-1 text-2xl font-semibold text-brand-dark">
                  {stageAudits.length}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {stageAudits.map((audit) => (
                    <li key={audit.id}>
                      <Link
                        href={`/audits/${audit.id}`}
                        className="block truncate text-xs text-muted-foreground hover:text-brand-primary hover:underline"
                      >
                        {audit.company.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
