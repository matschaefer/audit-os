"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { CLERK_CONFIGURED, isDemoMode } from "@/lib/app-env";

function DemoLinkButton() {
  return (
    <Button href="/dashboard" variant="secondary" size="sm">
      <span className="hidden sm:inline">Demo ohne Login ansehen</span>
      <span className="sm:hidden">Demo</span>
    </Button>
  );
}

/**
 * Right-hand side of the landing nav. Mirrors the mode split used
 * everywhere else (see `lib/app-env.ts`): demo mode offers a no-login
 * shortcut into the workspace, production mode only ever offers sign-in.
 */
export function NavAuthActions() {
  if (!CLERK_CONFIGURED) {
    return (
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {isDemoMode ? <DemoLinkButton /> : null}
        <Button
          variant="primary"
          size="sm"
          disabled
          title="Clerk ist in dieser Umgebung nicht konfiguriert"
        >
          Anmelden
        </Button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      {isDemoMode ? (
        <SignedOut>
          <DemoLinkButton />
        </SignedOut>
      ) : null}
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="primary" size="sm">
            Anmelden
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
