import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { WorkspaceMetaBar } from "@/components/layout/workspace-meta-bar";

interface AppShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

/** Shared shell (sidebar + top bar) for every authenticated / app-area page. */
export function AppShell({ title, description, actions, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceMetaBar />
        <header className="flex flex-col gap-4 border-b border-border-subtle bg-surface px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-brand-dark">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 gap-3">{actions}</div> : null}
        </header>
        <main className="flex-1 px-6 py-8 pb-20 lg:px-10 lg:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
