import { Banknote, Clock3, PiggyBank, TimerReset } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyEur, formatHours } from "@/lib/format";
import type { RoiCalculation } from "@/types/audit";

interface RoiSummaryProps {
  roi: RoiCalculation;
}

export function RoiSummary({ roi }: RoiSummaryProps) {
  const items = [
    {
      icon: Clock3,
      label: "Zeitersparnis / Monat",
      value: formatHours(roi.monthlyTimeSavingsHours),
    },
    {
      icon: Banknote,
      label: "Kosteneinsparung / Monat",
      value: formatCurrencyEur(roi.monthlyCostSavingsEur),
    },
    {
      icon: PiggyBank,
      label: "Einsparung / Jahr",
      value: formatCurrencyEur(roi.annualSavingsEur),
    },
    {
      icon: TimerReset,
      label: "Amortisation",
      value: `${roi.paybackPeriodMonths} Monate`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI-Kalkulation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-semibold text-brand-dark">{item.value}</p>
            </div>
          </div>
        ))}
        <p className="col-span-full mt-1 border-t border-border-subtle pt-4 text-xs text-muted-foreground">
          Kalkuliert mit einem angenommenen Stundensatz von{" "}
          {formatCurrencyEur(roi.hourlyRateEur)} sowie geschätzten
          Einrichtungskosten von {formatCurrencyEur(roi.setupCostEstimateEur)}.
        </p>
      </CardContent>
    </Card>
  );
}
