import { ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/landing/site-footer";
import { WorkspaceSnapshot } from "@/components/landing/workspace-snapshot";
import { Button } from "@/components/ui/button";

export default function EntryPage() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary text-lg font-bold text-white">
            S
          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Interner Audit-Workspace für Automatisierungspotenziale
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-dark">
            Synkro Audit OS
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Kundenaudits vorbereiten, Automatisierungspotenzial bewerten und
            kundenfähige Reports für die Immobilienkunden von Synkro erstellen.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/dashboard" size="lg">
              Workspace öffnen
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/demo" variant="secondary" size="lg">
              Demo-Audit ansehen
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Der Zugang ist auf das Synkro-Team beschränkt. Kundenreports werden
            separat als schreibgeschützte Exporte geteilt.
          </p>
        </div>

        <div className="mt-16 w-full">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Workspace-Vorschau
          </p>
          <WorkspaceSnapshot />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
