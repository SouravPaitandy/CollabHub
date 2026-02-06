import FeatureHero from "@/components/features/FeatureHero";
import FeatureList from "@/components/features/FeatureList";
import FeatureComparison from "@/components/features/FeatureComparison";
import FeatureCTA from "@/components/features/FeatureCTA";

export const metadata = {
  title: "Features | Coordly",
  description:
    "Explore the powerful suite of collaboration tools: Real-time Editing, HD Video Calls, Kanban Tasks, and more.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen text-foreground overflow-x-hidden selection:bg-primary/20 font-geist-sans">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <main className="relative py-24 space-y-24">
        <FeatureHero />
        <FeatureList />
        <FeatureComparison />
        <FeatureCTA />
      </main>
    </div>
  );
}
