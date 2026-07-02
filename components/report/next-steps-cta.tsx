import { CalendarCheck, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";

export function NextStepsCta() {
  return (
    <div className="grid gap-4 rounded-2xl bg-brand-dark p-8 text-white sm:grid-cols-2 sm:p-10">
      <div className="flex flex-col justify-between gap-4 rounded-xl bg-white/5 p-6">
        <div>
          <CalendarCheck className="h-6 w-6 text-brand-accent" />
          <h3 className="mt-3 font-semibold">Kostenloses Strategiegespräch</h3>
          <p className="mt-2 text-sm text-white/70">
            30 Minuten, um die Empfehlungen aus diesem Report gemeinsam
            durchzugehen und Prioritäten festzulegen.
          </p>
        </div>
        <Button
          variant="secondary"
          className="justify-center bg-white text-brand-dark hover:bg-white/90"
        >
          Termin vereinbaren
        </Button>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-xl bg-white/5 p-6">
        <div>
          <Rocket className="h-6 w-6 text-brand-accent" />
          <h3 className="mt-3 font-semibold">Umsetzungspaket starten</h3>
          <p className="mt-2 text-sm text-white/70">
            Wir setzen die priorisierten Automatisierungen entlang des
            14-Tage-Plans für Sie um.
          </p>
        </div>
        <Button className="justify-center bg-brand-primary hover:bg-brand-primary-hover">
          Umsetzung anfragen
        </Button>
      </div>
    </div>
  );
}
