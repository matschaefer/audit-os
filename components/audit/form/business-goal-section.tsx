import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { BUSINESS_GOAL_LABELS, WEBSITE_QUALITY_LABELS } from "@/lib/constants";
import type { BusinessContext, BusinessGoal, WebsiteQuality } from "@/types/audit";

interface BusinessGoalSectionProps {
  value: BusinessContext;
  onChange: (value: BusinessContext) => void;
}

/**
 * Two-field section used only to match the client against a Synkro offer
 * (see lib/offer-matching.ts). Kept minimal on purpose — everything else
 * the matching needs is already captured by the lead situation and pain
 * points above.
 */
export function BusinessGoalSection({ value, onChange }: BusinessGoalSectionProps) {
  function update<K extends keyof BusinessContext>(
    key: K,
    next: BusinessContext[K],
  ) {
    onChange({ ...value, [key]: next });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zielsetzung</CardTitle>
        <p className="text-sm text-muted-foreground">
          Wird genutzt, um ein passendes Synkro-Angebot vorzuschlagen.
        </p>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="business-goal">Wichtigstes Ziel des Kunden</Label>
          <Select
            id="business-goal"
            value={value.businessGoal}
            onChange={(e) => update("businessGoal", e.target.value as BusinessGoal)}
          >
            {Object.entries(BUSINESS_GOAL_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website-quality">Website als Lead-Quelle</Label>
          <Select
            id="website-quality"
            value={value.websiteQuality}
            onChange={(e) => update("websiteQuality", e.target.value as WebsiteQuality)}
          >
            {Object.entries(WEBSITE_QUALITY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
