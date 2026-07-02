import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AUTOMATION_LEVEL_LABELS } from "@/lib/constants";
import type { ManualProcess } from "@/types/audit";

interface ProcessTableProps {
  processes: ManualProcess[];
}

function levelBadgeVariant(level: ManualProcess["automationLevel"]) {
  if (level === "manual") return "danger" as const;
  if (level === "partially_automated") return "warning" as const;
  return "success" as const;
}

export function ProcessTable({ processes }: ProcessTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <CardHeader className="p-6 pb-4">
        <CardTitle>Manuelle Prozesse</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-y border-border-subtle bg-surface-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">Prozess</th>
              <th className="px-6 py-3 font-medium">Häufigkeit / Woche</th>
              <th className="px-6 py-3 font-medium">Dauer / Vorgang</th>
              <th className="px-6 py-3 font-medium">Automatisierungsgrad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {processes.map((process) => (
              <tr key={process.id}>
                <td className="px-6 py-3.5 font-medium text-brand-dark">
                  {process.name}
                </td>
                <td className="px-6 py-3.5 text-muted-foreground">
                  {process.frequencyPerWeek}x
                </td>
                <td className="px-6 py-3.5 text-muted-foreground">
                  {process.durationMinutes} Min.
                </td>
                <td className="px-6 py-3.5">
                  <Badge variant={levelBadgeVariant(process.automationLevel)}>
                    {AUTOMATION_LEVEL_LABELS[process.automationLevel]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
