import { AppPreviewMockup } from "@/components/landing/app-preview-mockup";
import { FeatureSection } from "@/components/landing/feature-section";
import { Hero } from "@/components/landing/hero";
import { PrivacySection } from "@/components/landing/privacy-section";
import { ProductFlowSection } from "@/components/landing/product-flow-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import { TechnicalSection } from "@/components/landing/technical-section";
import { isDemoMode } from "@/lib/app-env";

export default function EntryPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />

      <main className="flex-1">
        <Hero />

        <section className="px-6 pb-20">
          <AppPreviewMockup />
        </section>

        <ProductFlowSection />
        <FeatureSection />
        <TechnicalSection />

        {isDemoMode ? <PrivacySection /> : null}
      </main>

      <SiteFooter />
    </div>
  );
}
