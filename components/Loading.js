"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background text-foreground overflow-hidden z-[9999]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>

      {/* Main Loader */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Cosmic Spinner */}
        <div className="relative w-24 h-24 mb-8">
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary/50 border-r-primary/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner Ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-indigo-500/70 border-l-indigo-500/70"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          {/* Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_currentColor]"
            />
          </div>
        </div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-purple-500 aura-text-glow"
        >
          CollabHub
        </motion.h1>

        {/* Dynamic Loading Text */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-muted-foreground font-medium"
            >
              {loadingText}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;
