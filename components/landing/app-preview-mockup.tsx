import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AUDIT_STATUS_LABELS } from "@/lib/constants";
import { demoAudits, getRecommendedOfferName } from "@/lib/demo-data";
import { formatHours } from "@/lib/format";
import { buildExecutiveSummary } from "@/lib/report-narrative";

const PIPELINE_STAGES = [
  { label: "Entwurf", status: "draft" as const },
  { label: "In Prüfung", status: "in_review" as const },
  { label: "Report bereit", status: "report_ready" as const },
  { label: "Angebot versendet", status: "proposal_sent" as const },
];

const SIDEBAR_ICONS = [LayoutDashboard, ClipboardList, FileText, Settings];

/**
 * Composed, component-built illustration of the workspace — not a static
 * screenshot. Every number shown here comes from the real scoring and
 * offer-matching engines run against the flagship demo audit
 * (`demoAudits[0]`, Rheinblick), the same record `/audits/demo-1/report`
 * links to from the hero CTA.
 */
export function AppPreviewMockup() {
  const audit = demoAudits[0];
  const topRecommendation = audit.recommendations[0];
  const recommendedOffer = getRecommendedOfferName(audit);
  const summary = buildExecutiveSummary(audit);

  return (
    <div className="relative mx-auto max-w-4xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-primary/10 via-brand-accent/15 to-transparent blur-2xl"
      />

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-2xl shadow-brand-dark/10 ring-1 ring-brand-dark/5">
        {/* Fake browser chrome */}
        <div className="flex items-center gap-2 border-b border-border-subtle bg-surface-muted px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/40" />
          <span className="ml-3 truncate text-xs text-muted-foreground">
            audit-os.synkro.app/dashboard
          </span>
        </div>

        <div className="flex">
          {/* Mini sidebar hint */}
          <div className="hidden w-14 shrink-0 flex-col items-center gap-5 border-r border-border-subtle bg-surface py-5 sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-primary text-xs font-bold text-white">
              S
            </div>
            {SIDEBAR_ICONS.map((Icon, index) => (
              <div
                key={index}
                className={
                  index === 0
                    ? "flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary"
                    : "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/50"
                }
              >
                <Icon className="h-4 w-4" />
              </div>
            ))}
          </div>

          <div className="min-w-0 flex-1 p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-dark">
                  {audit.company.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {audit.company.location} · Kundenaudit
                </p>
              </div>
              <Badge variant="primary">
                {AUDIT_STATUS_LABELS[audit.status]}
              </Badge>
            </div>

            {/* KPI cards */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border-subtle bg-surface-muted p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Automatisierungspotenzial
                </p>
                <p className="mt-1.5 text-xl font-semibold text-brand-dark">
                  {audit.scores.automationPotentialPercent}%
                </p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-muted p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Zeitersparnis
                </p>
                <p className="mt-1.5 text-xl font-semibold text-brand-dark">
                  {formatHours(audit.roiCalculation.monthlyTimeSavingsHours)}/Monat
                </p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-muted p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Empfohlenes Angebot
                </p>
                <p className="mt-1.5 truncate text-sm font-semibold text-brand-dark">
                  {recommendedOffer}
                </p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-muted p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Reportstatus
                </p>
                <p className="mt-1.5 truncate text-sm font-semibold text-brand-dark">
                  {AUDIT_STATUS_LABELS[audit.status]}
                </p>
              </div>
            </div>

            {/* Mini pipeline — hidden on the smallest screens to keep the mockup uncluttered */}
            <div className="mt-4 hidden grid-cols-4 gap-2 sm:grid">
              {PIPELINE_STAGES.map((stage) => (
                <div
                  key={stage.status}
                  className={
                    stage.status === audit.status
                      ? "rounded-lg border border-brand-primary/30 bg-brand-primary/5 px-2 py-2 text-center"
                      : "rounded-lg border border-border-subtle px-2 py-2 text-center"
                  }
                >
                  <p
                    className={
                      stage.status === audit.status
                        ? "truncate text-[10px] font-medium text-brand-primary"
                        : "truncate text-[10px] font-medium text-muted-foreground"
                    }
                  >
                    {stage.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Recommendation + report preview */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border-subtle p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Empfehlung
                  </p>
                </div>
                <p className="mt-2 text-sm font-semibold text-brand-dark">
                  {topRecommendation?.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {topRecommendation?.impactEstimate}
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-brand-primary" />
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Report-Vorschau
                  </p>
                </div>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
