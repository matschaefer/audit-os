import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { PainPoint } from "@/types/audit";

interface PainPointsSectionProps {
  painPoints: PainPoint[];
  onChange: (painPoints: PainPoint[]) => void;
}

export function PainPointsSection({
  painPoints,
  onChange,
}: PainPointsSectionProps) {
  function toggle(id: PainPoint["id"]) {
    onChange(
      painPoints.map((p) =>
        p.id === id ? { ...p, selected: !p.selected } : p,
      ),
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schmerzpunkte</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {painPoints.map((point) => (
          <label
            key={point.id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-border-subtle p-3 text-sm transition-colors hover:bg-surface-muted"
          >
            <Checkbox
              checked={point.selected}
              onChange={() => toggle(point.id)}
            />
            <span className="text-brand-dark">{point.label}</span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
