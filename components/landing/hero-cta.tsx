"use client";

import { SignInButton } from "@clerk/nextjs";
import { ArrowRight, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CLERK_CONFIGURED, isDemoMode } from "@/lib/app-env";

const TRUST_CHIPS = [
  "Login optional",
  "Nur Demo-Daten",
  "Keine Speicherung",
  "Clerk vorbereitet",
];

function ProductionSignIn() {
  if (!CLERK_CONFIGURED) {
    return (
      <Button
        size="lg"
        disabled
        title="Clerk ist in dieser Umgebung nicht konfiguriert"
      >
        Anmelden
      </Button>
    );
  }

  return (
    <SignInButton mode="modal">
      <Button size="lg">Anmelden</Button>
    </SignInButton>
  );
}

/**
 * Hero call-to-action, mode-aware per `lib/app-env.ts`. Demo mode leads
 * straight into the workspace and a real report preview; production mode
 * only ever offers sign-in — there is no "skip login" path once real
 * credentials are involved.
 */
export function HeroCta() {
  if (!isDemoMode) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ProductionSignIn />
        <p className="max-w-sm text-center text-xs text-muted-foreground">
          Der Zugang ist auf das Synkro-Team beschränkt. Kundenreports werden
          separat als schreibgeschützte Exporte geteilt.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/dashboard" size="lg">
          Demo-Workspace öffnen
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button href="/audits/demo-1/report" variant="secondary" size="lg">
          <FileText className="h-4 w-4" />
          Report-Vorschau ansehen
        </Button>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-2">
        {TRUST_CHIPS.map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-border-subtle bg-surface px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            {chip}
          </li>
        ))}
      </ul>
    </div>
  );
}
