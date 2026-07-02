import { AuditForm } from "@/components/audit/form/audit-form";
import { AppShell } from "@/components/layout/app-shell";

export default function NewAuditPage() {
  return (
    <AppShell
      title="Kundenaudit erstellen"
      description="Erkenntnisse aus dem Erstgespräch, aktuelle Tools und manuelle Workflows erfassen. Diese Angaben dienen zur Berechnung des Automatisierungspotenzials und zur Erstellung eines kundenfähigen Reports."
    >
      <div className="mx-auto max-w-4xl">
        <AuditForm />
      </div>
    </AppShell>
  );
}
