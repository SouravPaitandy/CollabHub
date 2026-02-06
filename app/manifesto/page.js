"use client";
import React from "react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { FiWind, FiZap, FiTarget, FiCodesandbox } from "react-icons/fi";

const ManifestoPoint = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    <Icon className="w-8 h-8 text-indigo-400 mb-4" />
    <h3 className="text-xl font-bold text-white mb-2 font-hacker">{title}</h3>
    <p className="text-gray-400 leading-relaxed font-geist-sans text-sm">
      {description}
    </p>
  </motion.div>
);

export default function ManifestoPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 selection:bg-indigo-500/30">
      {/* Background Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black font-hacker text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50"
          >
            THE MANIFESTO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-geist-sans text-gray-400 max-w-2xl mx-auto"
          >
            We believe software should feel like an extension of your thought
            process—fast, invisible, and empowering.
          </motion.p>
        </div>

        {/* Core Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ManifestoPoint
            icon={FiZap}
            title="Speed is a Feature"
            description="Latency is the enemy of flow. We optimize every millisecond because your creative momentum matters more than our server costs."
            delay={0.3}
          />
          <ManifestoPoint
            icon={FiWind}
            title="Invisible Design"
            description="The best UI is the one you don't notice. Tools should recede into the background, leaving only you and your work."
            delay={0.4}
          />
          <ManifestoPoint
            icon={FiCodesandbox}
            title="Collaboration First"
            description="Great things are rarely built alone. We build systems that make working together feel as natural as thinking alone."
            delay={0.5}
          />
          <ManifestoPoint
            icon={FiTarget}
            title="Built for Builders"
            description="We respect your intelligence. No dumbed-down workflows, just powerful primitives that you can compose to solve hard problems."
            delay={0.6}
          />
        </div>

        {/* Closing Statement */}
        <SpotlightCard className="p-8 md:p-12 text-center border-t border-white/10 bg-black/20 backdrop-blur-md rounded-3xl">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 font-hacker">
            Why We Build
          </h2>
          <p className="text-lg font-geist-sans text-gray-400 max-w-3xl mx-auto leading-relaxed">
            In a world of bloated, slow, and distracting software, Coordly
            stands for clarity. We are building the workspace we always
            wanted—one that respects your focus and amplifies your genius.
          </p>
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="font-hacker text-indigo-400">
              Written by the Founder, Sourav Paitandy
            </p>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
