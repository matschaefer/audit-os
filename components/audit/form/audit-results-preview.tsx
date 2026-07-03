import { AlertTriangle, Sparkles } from "lucide-react";

import { OfferRecommendationPanel } from "@/components/audit/offer-recommendation-panel";
import { RecommendationCard } from "@/components/audit/recommendation-card";
import { RoiSummary } from "@/components/audit/roi-summary";
import { ScoreGauge } from "@/components/audit/score-gauge";
import { MeasurePlanSection } from "@/components/report/measure-plan-section";
import { Card, CardContent } from "@/components/ui/card";
import type {
  AuditScores,
  OfferRecommendation,
  PainPoint,
  Recommendation,
  RoiCalculation,
} from "@/types/audit";

interface AuditResultsPreviewProps {
  scores: AuditScores;
  recommendations: Recommendation[];
  roiCalculation: RoiCalculation;
  offerRecommendations: OfferRecommendation[];
  painPoints: PainPoint[];
}

export function AuditResultsPreview({
  scores,
  recommendations,
  roiCalculation,
  offerRecommendations,
  painPoints,
}: AuditResultsPreviewProps) {
  const selectedPainPoints = painPoints.filter((p) => p.selected);
  const primaryOffer = offerRecommendations.find(
    (r) => r.recommendationType === "primary",
  );
  const secondaryOffer = offerRecommendations.find(
    (r) => r.recommendationType === "secondary",
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 rounded-lg bg-brand-primary/10 px-4 py-3 text-sm font-medium text-brand-primary">
        <Sparkles className="h-4 w-4" />
        Demo-Auswertung — wird nur lokal für diese Demo berechnet
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-8 py-8 sm:flex-row">
          <ScoreGauge
            value={scores.processScore}
            label="Prozess-Score"
            sublabel="Aktuelle Prozessgesundheit"
            colorClassName={
              scores.processScore >= 60
                ? "text-success"
                : scores.processScore >= 35
                  ? "text-warning"
                  : "text-danger"
            }
          />
          <ScoreGauge
            value={scores.automationPotentialPercent}
            label="Automatisierungspotenzial"
            sublabel="Realistisch erschließbar"
          />
        </CardContent>
      </Card>

      {selectedPainPoints.length > 0 ? (
        <Card>
          <CardContent className="space-y-3">
            <h3 className="text-sm font-semibold text-brand-dark">
              Erkannte Hauptprobleme
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {selectedPainPoints.map((point) => (
                <li
                  key={point.id}
                  className="flex items-start gap-2 text-sm text-brand-dark"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  {point.label}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <RoiSummary roi={roiCalculation} />

      <OfferRecommendationPanel recommendations={offerRecommendations} />

      {primaryOffer ? (
        <Card>
          <CardContent>
            <h3 className="mb-4 text-sm font-semibold text-brand-dark">
              Vorschau auf Maßnahmenplan
            </h3>
            <MeasurePlanSection primary={primaryOffer} nextStep={secondaryOffer} />
          </CardContent>
        </Card>
      ) : null}

      {recommendations.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-brand-dark">
            Automatisierungshebel & empfohlene Maßnahmen
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={rec.id} recommendation={rec} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            Aus den erfassten Daten ergibt sich aktuell keine priorisierte
            Automatisierungsmaßnahme.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
