import { WorkspaceAuthControls } from "@/components/auth/workspace-auth-controls";
import { DemoPrivacyNotice } from "@/components/shared/demo-privacy-notice";
import { isDemoMode } from "@/lib/app-env";

/** Persistent chrome strip reinforcing that this is an internal, non-public tool. */
export function WorkspaceMetaBar() {
  return (
    <div className="flex items-center justify-between gap-4 bg-brand-dark px-6 py-2 text-xs text-white/70 lg:px-10">
      <span className="truncate">
        Synkro Intern · Audit-Arbeitsbereich für Automatisierungspotenziale
      </span>
      <div className="flex shrink-0 items-center gap-3">
        {isDemoMode ? (
          <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-medium text-white/80 sm:inline-flex">
            Demo-Modus
          </span>
        ) : null}
        <DemoPrivacyNotice tone="dark" className="items-end" />
        <WorkspaceAuthControls />
      </div>
    </div>
  );
}
