const CONSULTANT_NAME = "Matthias Schäfer";
const CONSULTANT_INITIALS = "MS";

/** Persistent chrome strip reinforcing that this is an internal, non-public tool. */
export function WorkspaceMetaBar() {
  return (
    <div className="flex items-center justify-between gap-4 bg-brand-dark px-6 py-2 text-xs text-white/70 lg:px-10">
      <span className="truncate">
        Synkro Intern · Audit-Workspace für Automatisierungspotenziale
      </span>
      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-medium text-white/80 sm:inline-flex">
          Demo-Workspace
        </span>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent text-[10px] font-semibold text-brand-dark">
            {CONSULTANT_INITIALS}
          </span>
          <span className="hidden text-white/80 sm:inline">
            {CONSULTANT_NAME}
          </span>
        </div>
      </div>
    </div>
  );
}
