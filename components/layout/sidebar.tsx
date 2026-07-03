"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-border-subtle bg-surface lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border-subtle px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-sm font-bold text-white">
          S
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-brand-dark">Synkro</p>
          <p className="text-xs text-muted-foreground">Audit OS</p>
        </div>
      </div>

      <nav aria-label="Hauptnavigation" className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.isActive(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-brand-dark",
                isActive && "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/10 hover:text-brand-primary",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-subtle p-3">
        <div className="flex items-start gap-2.5 rounded-lg bg-surface-muted px-3 py-2.5">
          <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <p className="text-xs leading-snug text-muted-foreground">
            Interner Arbeitsbereich von{" "}
            <span className="font-medium text-brand-dark">Synkro</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
