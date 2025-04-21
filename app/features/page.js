import FeatureHero from '@/components/features/FeatureHero';
import FeatureList from '@/components/features/FeatureList';
import FeatureComparison from '@/components/features/FeatureComparison';
import FeatureCTA from '@/components/features/FeatureCTA';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <FeatureHero />
      <FeatureList />
      <FeatureComparison />
      <FeatureCTA /> 
      {/* Footer is in the FeatureCTA */}
    </div>
  );
}