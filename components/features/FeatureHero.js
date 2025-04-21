import { Button } from "@/components/common/Button";

export default function FeatureHero() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        Powerful Features for Seamless Collaboration
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Discover how our platform can revolutionize your team&apos;s productivity and communication.
      </p>
      <Button href="#features" className="text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
        Explore Features
      </Button>
    </section>
  );
}