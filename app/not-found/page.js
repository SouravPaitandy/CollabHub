"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { Home, Radio } from "lucide-react";

export default function NotFound() {
  const [glitchActive, setGlitchActive] = useState(false);

  // Random glitch effect trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden font-geist-sans selection:bg-primary/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <SpotlightCard className="relative z-10 max-w-2xl w-full mx-4 p-8 md:p-12 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* System Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-mono text-red-400 tracking-wider">
              SIGNAL_LOST
            </span>
          </div>

          {/* Glitch 404 */}
          <div className="relative mb-6">
            <h1
              className={`text-9xl font-bold font-hacker tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 ${
                glitchActive ? "translate-x-1 opacity-80" : ""
              } transition-transform duration-75`}
            >
              404!
            </h1>
            {glitchActive && (
              <>
                <h1 className="absolute top-0 left-0 text-9xl font-bold font-hacker tracking-tighter text-red-500 opacity-50 translate-x-[-2px] mix-blend-screen">
                  404!
                </h1>
                <h1 className="absolute top-0 left-0 text-9xl font-bold font-hacker tracking-tighter text-blue-500 opacity-50 translate-x-[2px] mix-blend-screen">
                  404!
                </h1>
              </>
            )}
          </div>

          {/* Narrative Text */}
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
            Coordinate Not Found
          </h2>
          <p className="text-muted-foreground mb-10 max-w-md text-lg leading-relaxed">
            The vector you are trying to access does not exist in this sector.
            It may have been moved to a classified directory or deleted from the
            mainframe.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/" passHref>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              >
                <Home size={18} />
                <span>Return to Mission Control</span>
              </motion.button>
            </Link>

            <Link href="/contact" passHref>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium transition-colors"
              >
                <Radio size={18} />
                <span>Report Anomaly</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </SpotlightCard>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-xs font-mono text-white/20 tracking-widest uppercase">
        Error Code: VOID_NULL_POINTER
      </div>
    </div>
  );
}
