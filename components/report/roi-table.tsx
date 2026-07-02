import { formatCurrencyEur, formatHours } from "@/lib/format";
import type { RoiCalculation } from "@/types/audit";

interface RoiTableProps {
  roi: RoiCalculation;
}

export function RoiTable({ roi }: RoiTableProps) {
  const rows: [string, string][] = [
    ["Geschätzte Zeitersparnis pro Monat", formatHours(roi.monthlyTimeSavingsHours)],
    ["Angenommener Stundensatz", formatCurrencyEur(roi.hourlyRateEur)],
    ["Kosteneinsparung pro Monat", formatCurrencyEur(roi.monthlyCostSavingsEur)],
    ["Kosteneinsparung pro Jahr", formatCurrencyEur(roi.annualSavingsEur)],
    ["Geschätzte Einrichtungskosten", formatCurrencyEur(roi.setupCostEstimateEur)],
    ["Amortisationsdauer", `${roi.paybackPeriodMonths} Monate`],
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle">
      <table className="w-full text-left text-sm">
        <tbody className="divide-y divide-border-subtle">
          {rows.map(([label, value]) => (
            <tr key={label} className="odd:bg-surface-muted/60">
              <td className="px-5 py-3 text-muted-foreground">{label}</td>
              <td className="px-5 py-3 text-right font-semibold text-brand-dark">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
