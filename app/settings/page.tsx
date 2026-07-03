"use client";

import {
  Bell,
  Building2,
  CheckCircle2,
  FileText,
  Info,
  LayoutGrid,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { isDemoMode } from "@/lib/app-env";
import { formatCurrencyEur } from "@/lib/format";
import { cn } from "@/lib/utils";

interface WorkspaceProfile {
  workspaceName: string;
  consultantName: string;
  company: string;
  region: string;
  targetAudience: string;
}

const DEFAULT_WORKSPACE_PROFILE: WorkspaceProfile = {
  workspaceName: "Synkro Audit OS",
  consultantName: "Demo Berater",
  company: "Synkro",
  region: "NRW / DACH",
  targetAudience: "Immobilienmakler mit 3–30 Mitarbeitenden",
};

type PriorityLogic =
  | "time_savings"
  | "more_viewings"
  | "seller_acquisition"
  | "crm_structure";

const PRIORITY_LOGIC_LABELS: Record<PriorityLogic, string> = {
  time_savings: "Zeitersparnis priorisieren",
  more_viewings: "Mehr Besichtigungstermine priorisieren",
  seller_acquisition: "Verkäufergewinnung priorisieren",
  crm_structure: "CRM-Struktur priorisieren",
};

interface AuditDefaults {
  hourlyRateEur: number;
  implementationDays: number;
  auditDurationLabel: string;
  followUpDays: number;
  priorityLogic: PriorityLogic;
}

const DEFAULT_AUDIT_DEFAULTS: AuditDefaults = {
  hourlyRateEur: 45,
  implementationDays: 14,
  auditDurationLabel: "60–90 Minuten",
  followUpDays: 3,
  priorityLogic: "time_savings",
};

type ReportTone = "beratend" | "direkt" | "premium" | "kurz_sachlich";

const REPORT_TONE_LABELS: Record<ReportTone, string> = {
  beratend: "Beratend",
  direkt: "Direkt",
  premium: "Premium",
  kurz_sachlich: "Kurz & sachlich",
};

interface ReportSettings {
  showBranding: boolean;
  showRoi: boolean;
  showRecommendedOffer: boolean;
  showRolloutPlan: boolean;
  hideInternalSalesNotes: boolean;
  tone: ReportTone;
}

const DEFAULT_REPORT_SETTINGS: ReportSettings = {
  showBranding: true,
  showRoi: true,
  showRecommendedOffer: true,
  showRolloutPlan: true,
  hideInternalSalesNotes: true,
  tone: "beratend",
};

interface NotificationSettings {
  followUpReminders: boolean;
  reportReadyAlerts: boolean;
  highPriorityAlerts: boolean;
  weeklySummary: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  followUpReminders: true,
  reportReadyAlerts: true,
  highPriorityAlerts: false,
  weeklySummary: false,
};

interface DisplaySettings {
  compactView: boolean;
  showKpiCards: boolean;
  showDemoBadges: boolean;
  preferTableView: boolean;
  theme: "system" | "light" | "dark";
}

const DEFAULT_DISPLAY: DisplaySettings = {
  compactView: false,
  showKpiCards: true,
  showDemoBadges: true,
  preferTableView: false,
  theme: "system",
};

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">{children}</CardContent>
    </Card>
  );
}

function FieldRow({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border-subtle px-3.5 py-3">
      <div>
        <p className="text-sm font-medium text-brand-dark">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState(DEFAULT_WORKSPACE_PROFILE);
  const [auditDefaults, setAuditDefaults] = useState(DEFAULT_AUDIT_DEFAULTS);
  const [reportSettings, setReportSettings] = useState(DEFAULT_REPORT_SETTINGS);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [display, setDisplay] = useState(DEFAULT_DISPLAY);
  const [simulated, setSimulated] = useState(false);

  function updateProfile<K extends keyof WorkspaceProfile>(key: K, value: WorkspaceProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSimulated(false);
  }

  function updateAuditDefaults<K extends keyof AuditDefaults>(key: K, value: AuditDefaults[K]) {
    setAuditDefaults((prev) => ({ ...prev, [key]: value }));
    setSimulated(false);
  }

  function updateReportSettings<K extends keyof ReportSettings>(key: K, value: ReportSettings[K]) {
    setReportSettings((prev) => ({ ...prev, [key]: value }));
    setSimulated(false);
  }

  function updateNotifications<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    setSimulated(false);
  }

  function updateDisplay<K extends keyof DisplaySettings>(key: K, value: DisplaySettings[K]) {
    setDisplay((prev) => ({ ...prev, [key]: value }));
    setSimulated(false);
  }

  function handleReset() {
    setProfile(DEFAULT_WORKSPACE_PROFILE);
    setAuditDefaults(DEFAULT_AUDIT_DEFAULTS);
    setReportSettings(DEFAULT_REPORT_SETTINGS);
    setNotifications(DEFAULT_NOTIFICATIONS);
    setDisplay(DEFAULT_DISPLAY);
    setSimulated(false);
  }

  const previewHours = 40;
  const previewSavings = previewHours * auditDefaults.hourlyRateEur;

  return (
    <AppShell
      title="Einstellungen"
      description="Workspace, Audit-Standards und Report-Ausgabe für Synkro Audit OS konfigurieren."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">{isDemoMode ? "Demo-Modus" : "Private App"}</Badge>
          <Badge variant="neutral">Lokale Einstellungen</Badge>
          <Badge variant="neutral">Keine Speicherung</Badge>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-brand-primary/40 bg-brand-primary/5 px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <p className="text-sm text-brand-dark">
            In dieser öffentlichen Demo werden Änderungen nur lokal dargestellt und nicht
            dauerhaft gespeichert.
          </p>
        </div>

        <SectionCard
          icon={Building2}
          title="Workspace-Profil"
          description="Grunddaten des Workspace, z. B. für Report-Header und interne Ansprache."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldRow label="Workspace-Name">
              <Input
                value={profile.workspaceName}
                onChange={(e) => updateProfile("workspaceName", e.target.value)}
              />
            </FieldRow>
            <FieldRow label="Beratername">
              <Input
                value={profile.consultantName}
                onChange={(e) => updateProfile("consultantName", e.target.value)}
              />
            </FieldRow>
            <FieldRow label="Unternehmen">
              <Input
                value={profile.company}
                onChange={(e) => updateProfile("company", e.target.value)}
              />
            </FieldRow>
            <FieldRow label="Region / Fokusmarkt">
              <Input
                value={profile.region}
                onChange={(e) => updateProfile("region", e.target.value)}
              />
            </FieldRow>
            <FieldRow label="Zielgruppe" className="sm:col-span-2">
              <Input
                value={profile.targetAudience}
                onChange={(e) => updateProfile("targetAudience", e.target.value)}
              />
            </FieldRow>
          </div>
        </SectionCard>

        <SectionCard
          icon={SlidersHorizontal}
          title="Audit-Standardwerte"
          description="Vorbelegte Werte für neue Audits und die ROI-Berechnung."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldRow
              label="Standard-Stundensatz (ROI-Berechnung)"
              hint={`Beispiel: ${previewHours} Std./Monat × ${auditDefaults.hourlyRateEur} € ≈ ${formatCurrencyEur(previewSavings)} geschätzte Einsparung`}
            >
              <Input
                type="number"
                min={0}
                value={auditDefaults.hourlyRateEur}
                onChange={(e) => updateAuditDefaults("hourlyRateEur", Number(e.target.value))}
              />
            </FieldRow>
            <FieldRow label="Standard-Implementierungszeit (Tage)">
              <Input
                type="number"
                min={1}
                value={auditDefaults.implementationDays}
                onChange={(e) =>
                  updateAuditDefaults("implementationDays", Number(e.target.value))
                }
              />
            </FieldRow>
            <FieldRow label="Standard-Audit-Dauer">
              <Select
                value={auditDefaults.auditDurationLabel}
                onChange={(e) => updateAuditDefaults("auditDurationLabel", e.target.value)}
              >
                <option value="45–60 Minuten">45–60 Minuten</option>
                <option value="60–90 Minuten">60–90 Minuten</option>
                <option value="90–120 Minuten">90–120 Minuten</option>
              </Select>
            </FieldRow>
            <FieldRow label="Standard-Follow-up nach Audit (Tage)">
              <Input
                type="number"
                min={1}
                value={auditDefaults.followUpDays}
                onChange={(e) => updateAuditDefaults("followUpDays", Number(e.target.value))}
              />
            </FieldRow>
            <FieldRow label="Prioritätslogik" className="sm:col-span-2">
              <Select
                value={auditDefaults.priorityLogic}
                onChange={(e) =>
                  updateAuditDefaults("priorityLogic", e.target.value as PriorityLogic)
                }
              >
                {Object.entries(PRIORITY_LOGIC_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FieldRow>
          </div>
        </SectionCard>

        <SectionCard
          icon={FileText}
          title="Report-Einstellungen"
          description="Steuert, welche Bausteine ein Kundenreport standardmäßig enthält."
        >
          <div className="space-y-2.5">
            <ToggleRow
              label="Synkro-Branding im Report anzeigen"
              checked={reportSettings.showBranding}
              onChange={(v) => updateReportSettings("showBranding", v)}
            />
            <ToggleRow
              label="ROI-Kalkulation im Report anzeigen"
              checked={reportSettings.showRoi}
              onChange={(v) => updateReportSettings("showRoi", v)}
            />
            <ToggleRow
              label="Empfohlenes Angebot im Report anzeigen"
              checked={reportSettings.showRecommendedOffer}
              onChange={(v) => updateReportSettings("showRecommendedOffer", v)}
            />
            <ToggleRow
              label="14-Tage-Umsetzungsplan anzeigen"
              checked={reportSettings.showRolloutPlan}
              onChange={(v) => updateReportSettings("showRolloutPlan", v)}
            />
            <ToggleRow
              label="Interne Vertriebsnotizen im Kundenreport ausblenden"
              description="Standardmäßig aktiv — interne Notizen sind nie für den Kunden bestimmt."
              checked={reportSettings.hideInternalSalesNotes}
              onChange={(v) => updateReportSettings("hideInternalSalesNotes", v)}
            />
          </div>
          <FieldRow label="Tonalität des Reports">
            <Select
              value={reportSettings.tone}
              onChange={(e) => updateReportSettings("tone", e.target.value as ReportTone)}
            >
              {Object.entries(REPORT_TONE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FieldRow>
        </SectionCard>

        <SectionCard
          icon={Bell}
          title="Benachrichtigungen"
          description="Demo: keine echten Benachrichtigungen — Einstellungen wirken nur lokal."
        >
          <div className="space-y-2.5">
            <ToggleRow
              label="Follow-up-Erinnerungen aktivieren"
              checked={notifications.followUpReminders}
              onChange={(v) => updateNotifications("followUpReminders", v)}
            />
            <ToggleRow
              label="Hinweis bei reportbereiten Audits"
              checked={notifications.reportReadyAlerts}
              onChange={(v) => updateNotifications("reportReadyAlerts", v)}
            />
            <ToggleRow
              label="Hinweis bei hoher Priorität"
              checked={notifications.highPriorityAlerts}
              onChange={(v) => updateNotifications("highPriorityAlerts", v)}
            />
            <ToggleRow
              label="Wöchentliche Audit-Zusammenfassung"
              checked={notifications.weeklySummary}
              onChange={(v) => updateNotifications("weeklySummary", v)}
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={LayoutGrid}
          title="Darstellung"
          description="Persönliche Ansicht-Präferenzen für den Workspace."
        >
          <div className="space-y-2.5">
            <ToggleRow
              label="Kompakte Ansicht"
              checked={display.compactView}
              onChange={(v) => updateDisplay("compactView", v)}
            />
            <ToggleRow
              label="KPI-Cards im Dashboard anzeigen"
              checked={display.showKpiCards}
              onChange={(v) => updateDisplay("showKpiCards", v)}
            />
            <ToggleRow
              label="Demo-Badges anzeigen"
              checked={display.showDemoBadges}
              onChange={(v) => updateDisplay("showDemoBadges", v)}
            />
            <ToggleRow
              label="Tabellenansicht statt Kartenansicht bevorzugen"
              checked={display.preferTableView}
              onChange={(v) => updateDisplay("preferTableView", v)}
            />
          </div>
          <FieldRow label="Theme" hint="Vorbereitet — Theme-Wechsel ist noch nicht aktiv.">
            <div className="flex items-center gap-2">
              <Select
                className="max-w-xs"
                value={display.theme}
                onChange={(e) => updateDisplay("theme", e.target.value as DisplaySettings["theme"])}
              >
                <option value="system">System</option>
                <option value="light">Hell</option>
                <option value="dark">Dunkel</option>
              </Select>
              <Badge variant="neutral">Vorbereitet</Badge>
            </div>
          </FieldRow>
        </SectionCard>

        <Card>
          <CardHeader className="flex-row items-start gap-3 space-y-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <CardTitle>Demo & Datenschutz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              Diese öffentliche Demo enthält nur fiktive Daten. Bitte keine echten
              Kundendaten eingeben — Änderungen auf dieser Seite werden nicht dauerhaft
              gespeichert. Die private Version benötigt Login, geschützte Datenbank und
              Zugriffskontrolle.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "Nur Demo-Daten",
                "Keine Server-Speicherung",
                "Keine echten Kundendaten",
                "Login optional in Public Demo",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-brand-dark">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2.5">
            <Button type="button" onClick={() => setSimulated(true)}>
              Änderungen simulieren
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              Zurücksetzen
            </Button>
            <Button type="button" variant="outline" href="/dashboard">
              Demo-Workspace öffnen
            </Button>
          </div>
          {simulated ? (
            <p className="flex items-center gap-2 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Demo-Einstellungen übernommen. In der öffentlichen Demo werden sie nicht
              dauerhaft gespeichert.
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
