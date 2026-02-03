import Link from "next/link";
import { FiArrowDown } from "react-icons/fi";

export default function FeatureCTA() {
  return (
    <section className="px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-zinc-100/80 dark:bg-black/40 border border-black/5 dark:border-white/10 backdrop-blur-2xl p-12 sm:p-20 text-center overflow-hidden shadow-2xl group">
          {/* Background gradient animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>

          {/* Orb decorations */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl sm:text-5xl font-bold font-hacker tracking-tight text-foreground mb-4">
              Ready to Transform Your Team&apos;s Collaboration?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-geist-sans font-light">
              Join thousands of teams already using Coordly to boost their
              productivity.
            </p>
            <div className="pt-4">
              <Link
                href="/auth"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                Get Started for Free <FiArrowDown className="-rotate-90" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
