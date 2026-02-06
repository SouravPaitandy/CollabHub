"use client";
import React from "react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { FiUsers, FiCoffee, FiCode } from "react-icons/fi";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 selection:bg-pink-500/30">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-black font-hacker text-white mb-4">
            JOIN THE CREW
          </h1>
          <p className="text-xl text-gray-400 font-geist-sans">
            We are building the operating system for the next generation of
            teams.
          </p>
        </motion.div>

        <SpotlightCard className="p-10 md:p-14 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-left relative overflow-hidden">
          {/* Solopreneur Badge */}
          <div className="absolute top-4 right-4 animate-pulse">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              BOOTSTRAPPED
            </span>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-2">
              <FiCode className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Currently Evolving
            </h2>
            <p className="text-gray-300 leading-relaxed font-geist-sans">
              Coordly is currently a{" "}
              <span className="text-white font-bold">solo-founder mission</span>
              . I&apos;m designing, coding, and shipping every pixel you see
              right now to ensure the foundation stays strong and the vision
              remains pure.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm font-geist-sans">
              However, as we expand our user base and scale our infrastructure,
              I will be looking for extraordinary engineers and designers to
              join this journey.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-gray-500">
              Expected Hiring:{" "}
              <span className="text-gray-300">To Be Announced Soon</span>
            </div>
            <Link
              href="/"
              className="px-6 py-2 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </SpotlightCard>

        {/* Culture Teaser */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="p-4 rounded-xl border border-white/5 bg-black/20">
            <FiUsers className="w-6 h-6 mx-auto mb-2 text-white" />
            <div className="text-xs font-mono text-gray-400">Remote First</div>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-black/20">
            <FiCoffee className="w-6 h-6 mx-auto mb-2 text-white" />
            <div className="text-xs font-mono text-gray-400">Async Culture</div>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-black/20 col-span-2 md:col-span-1">
            <FiCode className="w-6 h-6 mx-auto mb-2 text-white" />
            <div className="text-xs font-mono text-gray-400">
              Open Source Values
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
