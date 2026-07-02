import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROCESS_MATURITY_LABELS, SALES_PRIORITY_LABELS } from "@/lib/constants";
import type { ProcessMaturity, SalesPriority } from "@/types/audit";

export interface ConsultantContextState {
  discoveryNotes: string;
  decisionMakerContext: string;
  processMaturity: ProcessMaturity;
  salesPriority: SalesPriority;
}

interface ConsultantContextSectionProps {
  value: ConsultantContextState;
  onChange: (value: ConsultantContextState) => void;
}

/** Internal-only fields captured by the consultant, never shown to the client. */
export function ConsultantContextSection({
  value,
  onChange,
}: ConsultantContextSectionProps) {
  function update<K extends keyof ConsultantContextState>(
    key: K,
    next: ConsultantContextState[K],
  ) {
    onChange({ ...value, [key]: next });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beraterkontext</CardTitle>
        <p className="text-sm text-muted-foreground">
          Interne Notizen für Synkro. Werden nie im Kundenreport angezeigt.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="discovery-notes">Notizen zum Erstgespräch</Label>
          <Textarea
            id="discovery-notes"
            value={value.discoveryNotes}
            onChange={(e) => update("discoveryNotes", e.target.value)}
            placeholder="Wichtigste Erkenntnisse aus dem Erstgespräch..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="decision-maker-context">Kontext zum Entscheider</Label>
          <Textarea
            id="decision-maker-context"
            value={value.decisionMakerContext}
            onChange={(e) => update("decisionMakerContext", e.target.value)}
            placeholder="Wer entscheidet, wer muss noch zustimmen, Budgetkontext..."
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="process-maturity">Aktuelle Prozessreife</Label>
            <Select
              id="process-maturity"
              value={value.processMaturity}
              onChange={(e) =>
                update("processMaturity", e.target.value as ProcessMaturity)
              }
            >
              {Object.entries(PROCESS_MATURITY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sales-priority">Vertriebspriorität</Label>
            <Select
              id="sales-priority"
              value={value.salesPriority}
              onChange={(e) =>
                update("salesPriority", e.target.value as SalesPriority)
              }
            >
              {Object.entries(SALES_PRIORITY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
