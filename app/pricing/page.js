"use client";

import { FiCheck, FiX, FiZap } from "react-icons/fi";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { Button } from "@/components/common/Button";

const pricingTiers = [
  {
    name: "Starter",
    price: "$0",
    originalPrice: "$0",
    period: "/month",
    description: "Perfect for hobbyists and students.",
    features: [
      "Access to public workspaces",
      "Real-time chat",
      "Basic document editing",
      "1GB Storage",
    ],
    notIncluded: [
      "Private workspaces",
      "Video Conferencing",
      "Advanced Analytics",
    ],
  },
  {
    name: "Pro",
    price: "$0",
    originalPrice: "$12",
    period: "/month",
    description: "For professionals and small teams.",
    recommended: true,
    features: [
      "Everything in Starter",
      "Unlimited private workspaces",
      "HD Video Conferencing",
      "10GB Storage",
      "Priority Support",
      "Advanced Permissions",
    ],
    notIncluded: ["SSO & Audit Logs"],
  },
  {
    name: "Enterprise",
    price: "$0",
    originalPrice: "Custom",
    description: "For large organizations with specific needs.",
    features: [
      "Everything in Pro",
      "Unlimited Storage",
      "SSO & Audit Logs",
      "Dedicated Account Manager",
      "SLA 99.9% Uptime",
      "Custom Contracts",
    ],
    notIncluded: [],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 font-geist-sans">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-1/2 w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px] animate-pulse-slow -translate-x-1/2" />
      </div>

      <main className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6 animate-pulse">
              <FiZap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-primary uppercase tracking-widest font-hacker">
                Limited Time Relaunch Offer
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold font-hacker mb-6 tracking-tight">
              Premium features, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500">
                now completely free.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              To celebrate our rebranding to <strong>Coordly</strong>,
              we&apos;re giving everyone access to all features for free. No
              credit card required.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-start">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative ${tier.recommended ? "md:-mt-8 z-10" : ""}`}
              >
                <SpotlightCard
                  className={`h-full p-8 rounded-[2rem] border ${
                    tier.recommended
                      ? "bg-black/10 dark:bg-white/5 border-primary/50 shadow-[0_0_50px_rgba(124,58,237,0.15)] ring-1 ring-primary/20"
                      : "bg-white/5 dark:bg-white/5 border-black/10 dark:border-white/10"
                  } backdrop-blur-xl flex flex-col`}
                >
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-indigo-500 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold font-hacker mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  </div>

                  <div className="mb-8 flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-hacker text-green-400">
                        {tier.price}
                      </span>
                      {tier.originalPrice !== "$0" && (
                        <span className="text-lg text-muted-foreground line-through decoration-red-500/50 decoration-2">
                          {tier.originalPrice}
                        </span>
                      )}
                      {tier.originalPrice !== "Custom" && tier.period && (
                        <span className="text-muted-foreground">
                          {tier.period}
                        </span>
                      )}
                    </div>
                    {tier.originalPrice !== "$0" && (
                      <p className="text-xs text-primary mt-1 font-medium">
                        100% OFF for Early Adopters
                      </p>
                    )}
                  </div>

                  <div className="flex-1 space-y-4 mb-8">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <FiCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/80">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {tier.notIncluded.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 opacity-50"
                      >
                        <FiX className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    href="/dashboard"
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      tier.recommended
                        ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"
                        : "bg-white/10 text-foreground hover:bg-white/20 border border-white/10"
                    }`}
                  >
                    Claim Free Account
                  </Button>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
