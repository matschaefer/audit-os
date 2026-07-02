import { AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PainPoint } from "@/types/audit";

interface PainPointListProps {
  painPoints: PainPoint[];
}

export function PainPointList({ painPoints }: PainPointListProps) {
  const selected = painPoints.filter((p) => p.selected);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kundenschmerzpunkte</CardTitle>
      </CardHeader>
      <CardContent>
        {selected.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Keine Schmerzpunkte ausgewählt.
          </p>
        ) : (
          <ul className="space-y-3">
            {selected.map((point) => (
              <li key={point.id} className="flex items-start gap-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <span className="text-brand-dark">{point.label}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
