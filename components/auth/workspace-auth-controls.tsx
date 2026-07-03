"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { CLERK_CONFIGURED } from "@/lib/app-env";

/**
 * Auth affordance shown in the workspace chrome (`WorkspaceMetaBar`).
 *
 * Signed-in users see the Clerk `UserButton`; signed-out users see an
 * "Anmelden" action. Degrades to a static hint when Clerk isn't configured
 * (no committed secrets in this repo) so the workspace never crashes for
 * lack of credentials.
 */
export function WorkspaceAuthControls() {
  if (!CLERK_CONFIGURED) {
    return (
      <span className="text-xs text-white/50" title="NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY fehlt">
        Anmeldung nicht konfiguriert
      </span>
    );
  }

  return (
    <>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="secondary" size="sm">
            Anmelden
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
