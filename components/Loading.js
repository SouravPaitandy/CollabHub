"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tips = [
  "Initializing warp drive...",
  "Aligning constellations...",
  "Connecting to the hive mind...",
  "Loading quantum states...",
  "Spinning up collaboration engine...",
];

const Loading = ({ message = "Syncing with the universe..." }) => {
  const [loadingText, setLoadingText] = useState(message);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText(tips[Math.floor(Math.random() * tips.length)]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030014]/90 backdrop-blur-sm overflow-hidden">
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

        {/* Dynamic Loading Text - Fixed Height to prevent jump */}
        <div className="h-8 flex items-center justify-center min-w-[300px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="text-white/70 font-hacker text-xs tracking-widest uppercase"
            >
              {loadingText}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Loading;
