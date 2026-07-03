import { Button } from "@/components/ui/button";

/** Closing reassurance block — only rendered in demo mode by the page. */
export function PrivacySection() {
  return (
    <section className="border-y border-border-subtle bg-brand-dark">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Öffentliche Demo, keine echten Kundendaten.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          Diese Version ist für Portfolio- und Demo-Zwecke gedacht. Alle
          sichtbaren Daten sind fiktiv. Für echte Kundennutzung ist eine
          private Version mit verpflichtendem Login, geschützter Datenbank und
          DSGVO-konformer Verarbeitung vorgesehen.
        </p>
        <div className="mt-8">
          <Button
            href="/dashboard"
            variant="secondary"
            size="lg"
            className="bg-white text-brand-dark hover:bg-white/90"
          >
            Demo öffnen
          </Button>
        </div>
      </div>
    </section>
  );
}
