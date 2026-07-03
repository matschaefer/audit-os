import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Company } from "@/types/audit";

interface CompanySectionProps {
  company: Company;
  onChange: (company: Company) => void;
}

export function CompanySection({ company, onChange }: CompanySectionProps) {
  function update<K extends keyof Company>(key: K, value: Company[K]) {
    onChange({ ...company, [key]: value });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unternehmensdaten</CardTitle>
        <p className="text-sm text-muted-foreground">
          Bitte nur fiktive Beispieldaten eingeben — keine echten Kunden- oder
          Unternehmensdaten.
        </p>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company-name">Firmenname</Label>
          <Input
            id="company-name"
            value={company.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Rheinblick Immobilien GmbH"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-location">Standort</Label>
          <Input
            id="company-location"
            value={company.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Musterstadt"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-website">Website</Label>
          <Input
            id="company-website"
            type="url"
            value={company.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-employees">Anzahl Mitarbeiter</Label>
          <Input
            id="company-employees"
            type="number"
            min={1}
            value={company.employeeCount}
            onChange={(e) => update("employeeCount", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-contact-name">Hauptansprechpartner</Label>
          <Input
            id="company-contact-name"
            value={company.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            placeholder="Max Mustermann"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-contact-role">Rolle des Ansprechpartners</Label>
          <Input
            id="company-contact-role"
            value={company.contactRole}
            onChange={(e) => update("contactRole", e.target.value)}
            placeholder="Geschäftsführerin"
          />
        </div>
      </CardContent>
    </Card>
  );
}
