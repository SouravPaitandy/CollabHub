"use client";
import React from "react";
import { motion } from "framer-motion";

const GlowButton = ({ children, onClick, className = "", icon = null }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative group overflow-hidden rounded-full px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/40 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-shimmer" />

      {/* Internal Glow Blob */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/30 to-transparent blur-md" />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
};

export default GlowButton;
