import { ReportCard } from "@/components/dashboard/report-card";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { demoAudits } from "@/lib/demo-data";

export default function ReportsPage() {
  const reports = demoAudits.filter(
    (audit) => audit.status === "report_ready" || audit.status === "proposal_sent",
  );

  return (
    <AppShell
      title="Reports"
      description="Kundenfähige Reports aus abgeschlossenen Audits, bereit zum Versand oder Follow-up."
    >
      {reports.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-2 p-12 text-center">
          <p className="text-sm font-medium text-brand-dark">
            Noch keine Reports bereit
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Reports erscheinen hier, sobald ein Audit den Status
            &bdquo;Report bereit&ldquo; erreicht.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((audit) => (
            <ReportCard key={audit.id} audit={audit} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
