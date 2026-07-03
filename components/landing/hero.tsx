import { HeroCta } from "@/components/landing/hero-cta";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex justify-center"
      >
        <div className="h-[28rem] w-[56rem] rounded-full bg-gradient-to-br from-brand-primary/15 via-brand-accent/20 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-20 text-center sm:pt-24">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-primary">
          Interner Audit-Workspace für Synkro
        </p>
        <h1 className="mx-auto mt-5 max-w-2xl text-balance break-words text-3xl font-semibold tracking-tight text-brand-dark sm:text-4xl lg:text-5xl">
          Automatisierungspotenziale erkennen, bewerten und als kundenfähigen
          Report vorbereiten.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Diese öffentliche Demo zeigt, wie Synkro Kundenaudits für
          Immobilienmakler vorbereitet: Prozesse erfassen, Zeitfresser
          bewerten, ROI berechnen, passende Angebote empfehlen und Reports für
          Kundengespräche erstellen — ausschließlich mit fiktiven Demo-Daten.
        </p>

        <div className="mt-10">
          <HeroCta />
        </div>
      </div>
    </section>
  );
}
