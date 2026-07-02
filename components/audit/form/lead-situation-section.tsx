import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CRM_TOOL_OPTIONS } from "@/lib/constants";
import type { LeadSituation } from "@/types/audit";

interface LeadSituationSectionProps {
  leadSituation: LeadSituation;
  onChange: (leadSituation: LeadSituation) => void;
}

export function LeadSituationSection({
  leadSituation,
  onChange,
}: LeadSituationSectionProps) {
  function update<K extends keyof LeadSituation>(
    key: K,
    value: LeadSituation[K],
  ) {
    onChange({ ...leadSituation, [key]: value });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead-Situation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="leads-per-month">Leads pro Monat</Label>
          <Input
            id="leads-per-month"
            type="number"
            min={0}
            value={leadSituation.leadsPerMonth}
            onChange={(e) => update("leadsPerMonth", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="response-time">Ø Antwortzeit (Stunden)</Label>
          <Input
            id="response-time"
            type="number"
            min={0}
            step={0.5}
            value={leadSituation.avgResponseTimeHours}
            onChange={(e) =>
              update("avgResponseTimeHours", Number(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="viewings-per-month">Besichtigungen pro Monat</Label>
          <Input
            id="viewings-per-month"
            type="number"
            min={0}
            value={leadSituation.viewingsPerMonth}
            onChange={(e) =>
              update("viewingsPerMonth", Number(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="no-show-rate">Geschätzte No-Show-Rate (%)</Label>
          <Input
            id="no-show-rate"
            type="number"
            min={0}
            max={100}
            value={leadSituation.noShowRatePercent}
            onChange={(e) =>
              update("noShowRatePercent", Number(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-crm">Aktuelles CRM</Label>
          <Select
            id="current-crm"
            value={leadSituation.currentCrm}
            onChange={(e) =>
              update(
                "currentCrm",
                e.target.value as LeadSituation["currentCrm"],
              )
            }
          >
            {CRM_TOOL_OPTIONS.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-tools">Aktuelle Tools (kommagetrennt)</Label>
          <Input
            id="current-tools"
            value={leadSituation.currentTools.join(", ")}
            onChange={(e) =>
              update(
                "currentTools",
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
            placeholder="Outlook, WhatsApp Business, ImmoScout24"
          />
        </div>
      </CardContent>
    </Card>
  );
}
