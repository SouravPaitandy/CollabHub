"use client";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";

const updates = [
  {
    version: "v2.0.0",
    date: "February 3, 2026",
    title: "Project Coordly Relaunch",
    type: "Major Release",
    description:
      "Welcome to Coordly! We've completely overhauled the platform with a new 'Cosmic Liquid' design system, enhanced collaboration tools, and improved performance.",
    changes: [
      "Rebranding from CollabHub to Coordly",
      "New 'Void Black' theme with vibrant accents",
      "Redesigned Landing Page & Dashboard",
      "Enhanced Document Editor with mobile support",
      "Improved Task Board fluid animations",
    ],
  },
  {
    version: "v1.5.0",
    date: "January 15, 2026",
    title: "Video Call Stability",
    type: "Feature Update",
    description:
      "Major improvements to the WebRTC video calling engine ensuring crystal clear communication.",
    changes: [
      "Fixed peer connection dropping issues",
      "Added screen sharing support",
      "Optimized bandwidth usage",
    ],
  },
  {
    version: "v1.2.0",
    date: "December 20, 2025",
    title: "Real-time Collaboration",
    type: "Performance",
    description:
      "Enhanced Yjs integration for faster document syncing between team members.",
    changes: [
      "Reduced latency in shared documents",
      "Added cursor presence indicators",
      "New conflict resolution strategies",
    ],
  },
  {
    version: "v1.0.0",
    date: "November 1, 2025",
    title: "Initial Launch",
    type: "Milestone",
    description:
      "The birth of the platform. All essential features for team collaboration included.",
    changes: [
      "Workspaces & Project Management",
      "Basic Task Boards",
      "Direct Messaging",
    ],
  },
];

export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 font-geist-sans">
      {/* <Navbar /> */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[150px] animate-pulse-slow delay-1000" />
      </div>

      <main className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-4xl sm:text-6xl font-bold font-hacker mb-4 tracking-tight">
              Product <span className="text-primary">Timeline</span>
            </h1>
            <p className="text-muted-foreground font-light text-xl">
              The evolution of Coordly.
            </p>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:-translate-x-1/2" />

            <div className="space-y-12">
              {updates.map((update, index) => (
                <motion.div
                  key={update.version}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 top-8 w-4 h-4 rounded-full bg-primary ring-4 ring-background shadow-[0_0_20px_rgba(124,58,237,0.5)] md:-translate-x-1/2 z-10">
                    <div className="absolute inset-0 rounded-full animate-ping bg-primary/50" />
                  </div>

                  {/* Content Card */}
                  <div className="ml-12 md:ml-0 md:w-1/2">
                    <SpotlightCard
                      className={`p-8 rounded-3xl bg-white/5 dark:bg-black/20 border border-black/5 dark:border-white/10 backdrop-blur-xl relative group hover:border-primary/30 transition-colors ${
                        index % 2 === 0 ? "md:mr-12" : "md:ml-12"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                          {update.type}
                        </span>
                        <span className="text-sm font-mono text-muted-foreground">
                          {update.date}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold font-hacker text-foreground mb-2 flex items-center gap-3">
                        {update.title}
                        <span className="text-lg text-muted-foreground font-thin opacity-50">
                          {update.version}
                        </span>
                      </h2>

                      <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                        {update.description}
                      </p>

                      <div className="space-y-3">
                        {update.changes.map((change, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 text-sm text-foreground/80 group/item"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0 group-hover/item:bg-primary transition-colors" />
                            {change}
                          </div>
                        ))}
                      </div>
                    </SpotlightCard>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
