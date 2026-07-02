import { Building2, Globe, Mail, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatHours, formatNumber, formatPercent } from "@/lib/format";
import type { Company, LeadSituation } from "@/types/audit";

interface CompanyOverviewCardProps {
  company: Company;
  leadSituation: LeadSituation;
}

export function CompanyOverviewCard({
  company,
  leadSituation,
}: CompanyOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kundensituation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-brand-dark">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{company.name}</span>
          </div>
          <p className="text-muted-foreground">{company.location}</p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-primary hover:underline"
            >
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            {company.employeeCount} Mitarbeiter
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {company.contactName} · {company.contactRole}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-4 text-sm sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
          <div>
            <dt className="text-xs text-muted-foreground">Leads / Monat</dt>
            <dd className="font-medium text-brand-dark">
              {formatNumber(leadSituation.leadsPerMonth)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ø Antwortzeit</dt>
            <dd className="font-medium text-brand-dark">
              {formatHours(leadSituation.avgResponseTimeHours)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Besichtigungen / Monat</dt>
            <dd className="font-medium text-brand-dark">
              {formatNumber(leadSituation.viewingsPerMonth)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">No-Show-Rate</dt>
            <dd className="font-medium text-brand-dark">
              {formatPercent(leadSituation.noShowRatePercent)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Aktuelles CRM / Tools</dt>
            <dd className="font-medium text-brand-dark">
              {leadSituation.currentCrm} ({leadSituation.currentTools.join(", ")})
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
