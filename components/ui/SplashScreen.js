"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ finishLoading }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timeout = setTimeout(() => {
      finishLoading();
    }, 4000); // Slightly shorter for a punchier feel

    return () => clearTimeout(timeout);
  }, [finishLoading]);

  return (
    <AnimatePresence>
      {isMounted && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030014] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
        >
          {/* Cosmic Background Texture */}
          <div className="absolute inset-0 z-0 opacity-40">
            <div
              className="absolute top-0 left-0 w-full h-full opacity-20 brightness-100 contrast-150"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            ></div>
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-500" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* ----------------- THE COSMIC ORB ----------------- */}
            <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
              {/* Core Glow */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0.8, 1], opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute w-16 h-16 bg-white rounded-full shadow-[0_0_80px_rgba(255,255,255,0.8)] z-20"
              />

              {/* Inner Ring - Fast & Bright */}
              <motion.div
                className="absolute w-24 h-24 rounded-full border-[3px] border-transparent border-t-cyan-400 border-l-cyan-300"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
              />

              {/* Middle Ring - Reverse & Purple */}
              <motion.div
                className="absolute w-32 h-32 rounded-full border-[2px] border-transparent border-b-purple-500 border-r-indigo-500"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, rotate: -360 }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                style={{ boxShadow: "0 0 30px rgba(168, 85, 247, 0.2)" }}
              />

              {/* Outer Ring - Slow & Geometric */}
              <motion.div
                className="absolute w-40 h-40 rounded-full border-[1px] border-white/20"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1, rotate: 180 }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
              </motion.div>

              {/* Satellite Orbit */}
              <motion.div
                className="absolute w-48 h-48 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,1)]" />
              </motion.div>
            </div>

            {/* ----------------- TYPOGRAPHY ----------------- */}
            <div className="overflow-hidden relative">
              <motion.h1
                className="text-7xl md:text-9xl font-black font-hacker tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500"
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }} // Custom cubic bezier for "snap" feel
              >
                COORDLY
              </motion.h1>

              {/* Glitch Overlay (Optional - adds tech feel) */}
              <motion.h1
                className="absolute inset-0 text-7xl md:text-9xl font-black font-hacker tracking-tighter text-white opacity-20 mix-blend-overlay"
                initial={{ x: -2 }}
                animate={{ x: [2, -2, 1, 0] }}
                transition={{ duration: 0.2, repeat: 5, repeatDelay: 2 }}
              >
                COORDLY
              </motion.h1>
            </div>

            <motion.div
              className="mt-6 flex flex-col items-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <p className="text-gray-400 font-mono text-sm tracking-[0.6em] uppercase">
                Sync <span className="text-indigo-500">•</span> Create{" "}
                <span className="text-purple-500">•</span> Succeed
              </p>
            </motion.div>
          </div>

          {/* Progress Line - Cyberpunk style */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500 rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-4 text-[10px] text-white/20 font-mono"
          >
            INITIALIZING WORKSPACE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
