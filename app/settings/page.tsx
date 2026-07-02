import { Bell, Database, Sparkles, User } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const SETTINGS_SECTIONS = [
  {
    icon: User,
    title: "Beraterprofil",
    description: "Matthias Schäfer · Synkro Berater",
    status: "Aktiv",
  },
  {
    icon: Database,
    title: "CRM & Datenanbindung",
    description: "Echte Datenbank anbinden, um Kundenaudits dauerhaft zu speichern.",
    status: "Phase 2",
  },
  {
    icon: Sparkles,
    title: "KI-Reporterstellung",
    description: "Report-Texte per KI generieren, statt der regelbasierten Vorlagen.",
    status: "Phase 2",
  },
  {
    icon: Bell,
    title: "Benachrichtigungen",
    description: "Hinweise, wenn ein Kundenaudit ein Follow-up benötigt oder ein Report bereit ist.",
    status: "Phase 2",
  },
];

export default function SettingsPage() {
  return (
    <AppShell
      title="Einstellungen"
      description="Workspace-Konfiguration. Die meisten Einstellungen sind in dieser Phase-1-Version Platzhalter."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {SETTINGS_SECTIONS.map((section) => (
          <Card key={section.title}>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <p className="pt-2 text-base font-semibold text-brand-dark">
                    {section.title}
                  </p>
                </div>
                <Badge variant={section.status === "Aktiv" ? "success" : "neutral"}>
                  {section.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
