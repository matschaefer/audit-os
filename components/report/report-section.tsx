import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ReportSectionProps {
  icon: LucideIcon;
  number: string;
  title: string;
  children: ReactNode;
}

export function ReportSection({
  icon: Icon,
  number,
  title,
  children,
}: ReportSectionProps) {
  return (
    <section className="border-t border-border-subtle py-10 first:border-t-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {number}
        </span>
        <h2 className="text-xl font-semibold text-brand-dark">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
