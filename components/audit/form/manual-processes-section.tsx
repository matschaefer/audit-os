import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  AUTOMATION_LEVEL_LABELS,
  SUGGESTED_MANUAL_PROCESSES,
} from "@/lib/constants";
import type { AutomationLevel, ManualProcess } from "@/types/audit";

interface ManualProcessesSectionProps {
  processes: ManualProcess[];
  onChange: (processes: ManualProcess[]) => void;
}

function createProcess(name = ""): ManualProcess {
  return {
    id: crypto.randomUUID(),
    name,
    frequencyPerWeek: 5,
    durationMinutes: 10,
    automationLevel: "manual",
  };
}

export function ManualProcessesSection({
  processes,
  onChange,
}: ManualProcessesSectionProps) {
  function update(id: string, patch: Partial<ManualProcess>) {
    onChange(processes.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function remove(id: string) {
    onChange(processes.filter((p) => p.id !== id));
  }

  function addProcess(name = "") {
    onChange([...processes, createProcess(name)]);
  }

  const usedNames = new Set(processes.map((p) => p.name));
  const availableSuggestions = SUGGESTED_MANUAL_PROCESSES.filter(
    (name) => !usedNames.has(name),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manuelle Prozesse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableSuggestions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => addProcess(name)}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border-subtle px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                <Plus className="h-3 w-3" />
                {name}
              </button>
            ))}
          </div>
        ) : null}

        <div className="space-y-3">
          {processes.map((process) => (
            <div
              key={process.id}
              className="grid gap-3 rounded-lg border border-border-subtle p-4 sm:grid-cols-[2fr_1fr_1fr_1.4fr_auto] sm:items-end"
            >
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Prozess</label>
                <Input
                  value={process.name}
                  onChange={(e) => update(process.id, { name: e.target.value })}
                  placeholder="z. B. Exposé senden"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Häufigkeit / Woche
                </label>
                <Input
                  type="number"
                  min={0}
                  value={process.frequencyPerWeek}
                  onChange={(e) =>
                    update(process.id, {
                      frequencyPerWeek: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Dauer (Min.)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={process.durationMinutes}
                  onChange={(e) =>
                    update(process.id, {
                      durationMinutes: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Automatisierungsgrad
                </label>
                <Select
                  value={process.automationLevel}
                  onChange={(e) =>
                    update(process.id, {
                      automationLevel: e.target.value as AutomationLevel,
                    })
                  }
                >
                  {Object.entries(AUTOMATION_LEVEL_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </Select>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(process.id)}
                aria-label="Prozess entfernen"
              >
                <Trash2 className="h-4 w-4 text-danger" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="button" variant="secondary" size="sm" onClick={() => addProcess()}>
          <Plus className="h-4 w-4" />
          Eigenen Prozess hinzufügen
        </Button>
      </CardContent>
    </Card>
  );
}
