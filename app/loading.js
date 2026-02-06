"use client";
import { motion } from "framer-motion";

// Lightweight version of the Splash Screen for route transitions
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-[#030014]/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center">
        {/* Cosmic Orb Loader */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          {/* Core */}
          <motion.div
            animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
            className="absolute w-8 h-8 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.8)] z-20"
          />

          {/* Inner Ring */}
          <motion.div
            className="absolute w-12 h-12 rounded-full border-[2px] border-transparent border-t-cyan-400 border-l-cyan-300"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "linear", repeat: Infinity }}
          />

          {/* Middle Ring */}
          <motion.div
            className="absolute w-16 h-16 rounded-full border-[2px] border-transparent border-b-purple-500 border-r-indigo-500"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
          />

          {/* Outer Ring */}
          <motion.div
            className="absolute w-20 h-20 rounded-full border-[1px] border-white/20"
            animate={{ rotate: 180 }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
        </div>

        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase"
        >
          Loading Workspace...
        </motion.p>
      </div>
    </div>
  );
}
