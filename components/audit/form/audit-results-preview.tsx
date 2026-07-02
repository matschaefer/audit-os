import { Sparkles } from "lucide-react";

import { OfferRecommendationPanel } from "@/components/audit/offer-recommendation-panel";
import { RecommendationCard } from "@/components/audit/recommendation-card";
import { RoiSummary } from "@/components/audit/roi-summary";
import { ScoreGauge } from "@/components/audit/score-gauge";
import { Card, CardContent } from "@/components/ui/card";
import type {
  AuditScores,
  OfferRecommendation,
  Recommendation,
  RoiCalculation,
} from "@/types/audit";

interface AuditResultsPreviewProps {
  scores: AuditScores;
  recommendations: Recommendation[];
  roiCalculation: RoiCalculation;
  offerRecommendations: OfferRecommendation[];
}

export function AuditResultsPreview({
  scores,
  recommendations,
  roiCalculation,
  offerRecommendations,
}: AuditResultsPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 rounded-lg bg-brand-primary/10 px-4 py-3 text-sm font-medium text-brand-primary">
        <Sparkles className="h-4 w-4" />
        Live-Auswertung auf Basis der eingegebenen Daten
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

      <RoiSummary roi={roiCalculation} />

      <OfferRecommendationPanel recommendations={offerRecommendations} />

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
      ) : null}
    </div>
  );
}
