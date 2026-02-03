import Link from "next/link";
import { FiArrowDown } from "react-icons/fi";

export default function FeatureHero() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
        <span className="text-xs font-medium text-primary uppercase tracking-widest font-geist-sans">
          Features
        </span>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 font-hacker tracking-tight">
        <span className="text-foreground">Powerful Features for</span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500">
          Seamless Collaboration
        </span>
      </h1>

      <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-light font-geist-sans">
        Discover how our platform can revolutionize your team&apos;s
        productivity and communication with a suite of cosmic-grade tools.
      </p>

      <div className="flex justify-center">
        <Link
          href="#features"
          className="group px-8 py-4 rounded-xl bg-foreground text-background font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          Explore Capabilities
          <FiArrowDown className="transition-transform group-hover:translate-y-1" />
        </Link>
      </div>
    </section>
  );
}
