import { Badge } from "@/components/ui/badge";
import { NavAuthActions } from "@/components/landing/nav-auth-actions";
import { isDemoMode } from "@/lib/app-env";

/** Top navigation for the public landing page only — not the workspace chrome. */
export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle/70 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 shrink items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-sm font-bold text-white">
            S
          </div>
          <span className="hidden truncate text-sm font-semibold text-brand-dark sm:inline">
            Synkro Audit OS
          </span>
          {isDemoMode ? (
            <Badge variant="primary" className="hidden md:inline-flex">
              Portfolio-Demo
            </Badge>
          ) : null}
        </div>

        <NavAuthActions />
      </div>
    </header>
  );
}
