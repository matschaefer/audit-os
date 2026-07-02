"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

/** Bottom tab bar shown below the `lg` breakpoint, where the sidebar is hidden. */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border-subtle bg-surface lg:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = item.isActive(pathname);
        const Icon = item.icon;
        const label = "shortLabel" in item ? item.shortLabel : item.label;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground",
              isActive && "text-brand-primary",
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
