import { PlusCircle } from "lucide-react";

import { AuditList } from "@/components/dashboard/audit-list";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { getAuditSummaries } from "@/lib/demo-data";

export default function AuditsIndexPage() {
  const audits = getAuditSummaries();

  return (
    <AppShell
      title="Audits"
      description="Alle von Synkro vorbereiteten Kundenaudits, über alle Phasen hinweg."
      actions={
        <Button href="/audits/new">
          <PlusCircle className="h-4 w-4" />
          Kundenaudit erstellen
        </Button>
      }
    >
      <AuditList audits={audits} />
    </AppShell>
  );
}
