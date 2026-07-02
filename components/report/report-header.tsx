import { formatDate } from "@/lib/format";
import type { Audit } from "@/types/audit";

interface ReportHeaderProps {
  audit: Audit;
}

export function ReportHeader({ audit }: ReportHeaderProps) {
  return (
    <div className="rounded-2xl bg-brand-dark px-8 py-10 text-white sm:px-12 sm:py-14">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-brand-dark">
          S
        </div>
        <span className="text-sm font-medium text-white/80">
          Synkro Audit OS · Automatisierungs-Report
        </span>
      </div>

      <h1 className="mt-8 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        Automatisierungs-Audit für {audit.company.name}
      </h1>

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/70">
        <span>{audit.company.location}</span>
        <span>
          {audit.company.contactName} · {audit.company.contactRole}
        </span>
        <span>Erstellt am {formatDate(audit.createdAt)}</span>
      </div>
    </div>
  );
}
