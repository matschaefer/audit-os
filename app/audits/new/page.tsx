import { Info } from "lucide-react";

import { AuditForm } from "@/components/audit/form/audit-form";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { isDemoMode } from "@/lib/app-env";

export default function NewAuditPage() {
  return (
    <AppShell
      title="Kundenaudit erstellen"
      description="Erkenntnisse aus dem Erstgespräch, aktuelle Tools und manuelle Workflows erfassen. Diese Angaben dienen zur Berechnung des Automatisierungspotenzials und zur Erstellung eines kundenfähigen Reports."
    >
      <div className="mx-auto max-w-4xl">
        <Card className="mb-6 border-brand-accent/60 bg-brand-accent/10">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
            <div className="space-y-2">
              <Badge variant="primary">
                {isDemoMode ? "Demo-Formular · keine Speicherung" : "Live-Vorschau · keine Speicherung"}
              </Badge>
              <p className="text-sm text-brand-dark">
                {isDemoMode
                  ? "Öffentliche Demo: Bitte keine echten Kunden-, Kontakt- oder Unternehmensdaten eingeben. Die produktive Nutzung ist erst mit geschütztem Login und privater Datenbank vorgesehen."
                  : "Die Speicherung von Audits ist für eine spätere Phase vorgesehen. Diese Eingabe berechnet ausschließlich eine Live-Vorschau von Score, ROI und Angebotsempfehlung — es wird nichts dauerhaft abgelegt."}
              </p>
            </div>
          </CardContent>
        </Card>
        <AuditForm />
      </div>
    </AppShell>
  );
}
