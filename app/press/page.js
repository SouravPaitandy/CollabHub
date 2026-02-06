"use client";
import React from "react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { FiDownload, FiImage, FiType } from "react-icons/fi";
import { Button } from "@/components/common/Button";

const AssetCard = ({ icon: Icon, title, format, size }) => (
  <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-black/40 text-gray-300 group-hover:text-white transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-mono text-gray-500">{format}</span>
    </div>
    <h3 className="text-white font-bold mb-1">{title}</h3>
    <p className="text-xs text-gray-400 mb-4">{size}</p>
    <div className="flex items-center gap-2 text-sm text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
      <FiDownload /> Download
    </div>
  </div>
);

export default function PressPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 selection:bg-orange-500/30">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black font-hacker text-white"
          >
            MEDIA KIT
          </motion.h1>
          <p className="text-xl font-geist-sans text-gray-400 max-w-2xl mx-auto">
            Official assets, brand guidelines, and resources for press usage.
          </p>
        </div>

        {/* Brand Colors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-32 rounded-2xl bg-[#000000] border border-white/10 flex items-end p-4">
            <span className="font-mono text-xs text-gray-500">
              Void Black #000000
            </span>
          </div>
          <div className="h-32 rounded-2xl bg-[#ffffff] border border-white/10 flex items-end p-4">
            <span className="font-mono text-xs text-gray-500">
              Pure White #FFFFFF
            </span>
          </div>
          <div className="h-32 rounded-2xl bg-indigo-600 border border-white/10 flex items-end p-4">
            <span className="font-mono text-xs text-white/80">
              Cosmic Indigo #4F46E5
            </span>
          </div>
          <div className="h-32 rounded-2xl bg-purple-600 border border-white/10 flex items-end p-4">
            <span className="font-mono text-xs text-white/80">
              Nebula Purple #9333EA
            </span>
          </div>
        </div>

        {/* Assets Grid */}
        <div>
          <h2 className="text-2xl font-bold font-hacker text-white mb-8 border-b border-white/10 pb-4">
            Brand Assets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AssetCard
              icon={FiImage}
              title="Full Logo (Dark)"
              format="SVG / PNG"
              size="1.2 MB"
            />
            <AssetCard
              icon={FiImage}
              title="Full Logo (Light)"
              format="SVG / PNG"
              size="1.2 MB"
            />
            <AssetCard
              icon={FiType}
              title="Logomark Only"
              format="SVG"
              size="45 KB"
            />
          </div>
        </div>

        {/* Press Contact */}
        <SpotlightCard className="p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Media Enquiries
              </h3>
              <p className="text-gray-400 font-geist-sans">
                Need a quote or specific asset? Reach out strictly for press
                purposes.
              </p>
            </div>
            <Button
              className="bg-white text-black hover:bg-gray-200"
              href="/contact"
            >
              Contact Us
            </Button>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
