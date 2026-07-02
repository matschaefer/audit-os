/**
 * Synkro's internal service catalogue.
 *
 * This is not public pricing — it's the reference data `lib/offer-matching.ts`
 * uses to recommend which Synkro offer fits a given client audit, and what
 * a consultant should show on the internal audit view and the client report.
 */

import type { SynkroOffer } from "@/types/audit";

export const SYNKRO_OFFERS: SynkroOffer[] = [
  {
    id: "automatisierungs-audit",
    name: "Automatisierungs-Audit",
    type: "audit",
    setupPriceLabel: "Kostenlos",
    monthlyPriceLabel: "0 €",
    shortDescription:
      "60–90 Minuten persönliches Gespräch mit PDF-Report, ROI-Kalkulation und konkreten Maßnahmen — unverbindlich.",
    bestFor: ["Erstkontakt mit einem neuen Maklerbüro", "Einstieg ohne Risiko für den Kunden"],
    includedItems: [
      "60–90 Min. persönliches Gespräch",
      "PDF-Report mit konkreten Maßnahmen",
      "ROI-Kalkulation",
      "Keine Verpflichtung",
    ],
    workflowSteps: ["Gespräch", "Analyse", "Report"],
    salesAngle:
      "Der Audit selbst ist der Türöffner — er liefert bereits einen Report und ROI-Zahlen, bevor überhaupt ein Vertrag im Raum steht.",
    implementationTime: "Sofort verfügbar",
    priorityUseCase: "Ausgangspunkt jedes Engagements, nicht selbst empfehlbar als Folgeangebot.",
  },
  {
    id: "verkaeufergewinnung",
    name: "Verkäufergewinnung",
    type: "core",
    setupPriceLabel: "ab 1.490 € einmalig",
    monthlyPriceLabel: "ab 490 €/Monat",
    shortDescription:
      "Mehr Eigentümer, die aktiv auf den Makler zukommen — vollautomatisch qualifiziert und terminiert. Mehr Alleinaufträge ohne Kaltakquise.",
    bestFor: [
      "Makler, die mehr Eigentümer-Leads wollen",
      "Makler, die mehr Alleinaufträge gewinnen wollen",
      "Makler mit schwacher Verkäuferpipeline",
    ],
    includedItems: [
      "Conversionstarke Landingpage für Eigentümer",
      "Automatisches Bewertungsformular",
      "CRM-Integration & Lead-Qualifizierung",
      "Automatische Terminbuchung",
      "Follow-up bei No-Shows",
    ],
    workflowSteps: ["Landingpage", "Bewertung", "CRM", "Termin"],
    salesAngle:
      "Statt weiter auf eingehende Käuferanfragen zu reagieren, baut der Makler aktiv eine Eigentümer-Pipeline auf — der Hebel für mehr Alleinaufträge.",
    implementationTime: "14 Tage",
    priorityUseCase: "Schwache oder fehlende Eigentümer-Akquise, Wunsch nach mehr Listungen.",
  },
  {
    id: "lead-terminprozess",
    name: "Lead & Terminprozess",
    type: "core",
    setupPriceLabel: "ab 990 € einmalig",
    monthlyPriceLabel: "ab 290 €/Monat",
    shortDescription:
      "Kein Lead geht mehr verloren. Vom Erstkontakt bis zum bestätigten Termin läuft alles automatisch — auch nachts und am Wochenende.",
    bestFor: [
      "Makler mit vielen eingehenden Leads",
      "Langsame Antwortzeiten",
      "Manuelle Terminabstimmung",
      "Unzuverlässige Follow-ups",
      "Exposé-Anfragen",
    ],
    includedItems: [
      "Automatische Lead-Aufnahme ins CRM",
      "Personalisierte E-Mail-Sequenz",
      "Online-Terminbuchung ohne Rückfragen",
      "Automatische Reminder & Follow-ups",
    ],
    workflowSteps: ["Lead", "CRM", "E-Mail", "Termin"],
    salesAngle:
      "Die Antwortzeit ist der größte Hebel für mehr Besichtigungen — jede Stunde Verzögerung kostet nachweislich Termine.",
    implementationTime: "14 Tage",
    priorityUseCase: "Hohes Lead-Volumen mit langsamer oder manueller Bearbeitung.",
  },
  {
    id: "websites-landingpages",
    name: "Websites & Landingpages",
    type: "custom",
    setupPriceLabel: "Individuelles Angebot",
    monthlyPriceLabel: "Auf Anfrage",
    shortDescription:
      "Kein generischer Webauftritt, sondern ein System, das Interessenten aufnimmt, qualifiziert und direkt in die Automatisierung übergibt.",
    bestFor: [
      "Makler mit schwacher Website",
      "Makler ohne klare Leadformulare",
      "Makler mit schlechter Conversion",
      "Website ist nicht an CRM oder Automatisierung angebunden",
    ],
    includedItems: [
      "Individuelles Design",
      "Lead-Formulare mit automatischer Weiterleitung",
      "CRM-Integration",
      "Schnelle Ladezeiten",
      "Mobil optimiert",
    ],
    workflowSteps: ["Konzept", "Design", "Umsetzung", "CRM-Anbindung"],
    salesAngle:
      "Ohne eine an das CRM angebundene Website verpufft jede Automatisierung dahinter — die Website ist die Eingangstür.",
    implementationTime: "Projektbasiert, nach Umfang",
    priorityUseCase: "Fehlende, veraltete oder nicht angebundene Website als Lead-Quelle.",
  },
  {
    id: "email-whatsapp-nurturing",
    name: "E-Mail & WhatsApp Nurturing",
    type: "add-on",
    setupPriceLabel: "Ergänzung zu Kernpaket",
    monthlyPriceLabel: "ab 190 €/Monat",
    shortDescription:
      "Die meisten Leads kaufen nicht sofort — wer systematisch präsent bleibt, gewinnt den Auftrag. Automatisch, persönlich, zur richtigen Zeit.",
    bestFor: [
      "Viele kalte Leads",
      "Viele nicht reagierende Kontakte",
      "Vergessene Follow-ups",
      "Langer Entscheidungsprozess",
      "Reaktivierung alter Kontakte",
    ],
    includedItems: [
      "Automatische E-Mail-Sequenzen",
      "WhatsApp-Nachrichten zur richtigen Zeit",
      "Segmentierung nach Kaufbereitschaft",
      "Reaktivierung kalter Kontakte",
      "CRM-Integration & Tracking",
    ],
    workflowSteps: ["Lead", "Sequenz", "Warm", "Auftrag"],
    salesAngle:
      "Ergänzt Lead & Terminprozess oder Verkäufergewinnung ideal, sobald genug Kontakte im System sind, die sonst kalt verlaufen würden.",
    implementationTime: "14 Tage (als Ergänzung)",
    priorityUseCase: "Vorhandener Lead-Bestand wird nicht systematisch nachverfolgt.",
  },
  {
    id: "crm-prozessoptimierung",
    name: "CRM & Prozessoptimierung",
    type: "custom",
    setupPriceLabel: "Individuelles Angebot",
    monthlyPriceLabel: "Auf Anfrage",
    shortDescription:
      "Für Makler, die das große Bild angehen: Analyse, Optimierung und Automatisierung des gesamten Unternehmens mit Dokumentation für das Team.",
    bestFor: [
      "Mehrere Standorte",
      "Chaotische CRM-Struktur",
      "Viele manuelle Prozesse",
      "Unklare Verantwortlichkeiten",
      "Wunsch nach vollständiger Prozessoptimierung",
    ],
    includedItems: [
      "Vollständige Analyse aller Abläufe",
      "CRM-Optimierung oder Migration",
      "Individuelle Automatisierung je Prozess",
      "Dokumentation & Team-Schulung",
      "Laufende Begleitung nach Go-Live",
    ],
    workflowSteps: ["Analyse", "Optimierung", "Automatisierung", "Schulung"],
    salesAngle:
      "Sinnvoll, sobald die Probleme nicht mehr an einem einzelnen Prozess hängen, sondern strukturell im ganzen Unternehmen liegen.",
    implementationTime: "Projektbasiert, nach Umfang",
    priorityUseCase: "Strukturelle CRM-/Prozessprobleme über mehrere Bereiche hinweg.",
  },
];

export function getSynkroOfferById(id: string): SynkroOffer | undefined {
  return SYNKRO_OFFERS.find((offer) => offer.id === id);
}
