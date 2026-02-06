"use client";
import React from "react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { FiLock, FiShield, FiServer, FiEyeOff } from "react-icons/fi";

const SecurityFeature = ({ icon: Icon, title, description }) => (
  <div className="flex gap-4 items-start">
    <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-gray-400 font-geist-sans text-sm leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

export default function SecurityPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 selection:bg-emerald-500/30">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-widest mb-4"
          >
            SOC 2 TYPE II COMPLIANT
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-hacker text-white"
          >
            TRUST & SECURITY
          </motion.h1>
          <p className="text-xl font-geist-sans text-gray-400 max-w-2xl mx-auto">
            Your data isn&apos;t just stored; it&apos;s protected by
            military-grade encryption and rigorous access controls.
          </p>
        </div>

        <SpotlightCard className="p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <SecurityFeature
              icon={FiLock}
              title="End-to-End Encryption"
              description="All sensitive communication (video, chat, and private docs) is encrypted in transit using TLS 1.3 and at rest using AES-256."
            />
            <SecurityFeature
              icon={FiServer}
              title="Isolated Infrastructure"
              description="Customer data is logically isolated in our database. We perform daily automated backups to ensuring data integrity."
            />
            <SecurityFeature
              icon={FiShield}
              title="Zero-Trust Access"
              description="Our internal access policy is zero-trust by default. No employee can access your raw user data without explicit audit trails."
            />
            <SecurityFeature
              icon={FiEyeOff}
              title="Privacy First"
              description="We do not sell your data. We do not train AI models on your private codebases without redundant opt-in consent."
            />
          </div>
        </SpotlightCard>

        {/* Code Block Visual */}
        <div className="rounded-xl overflow-hidden border border-white/5 bg-[#0a0a0a]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <span className="ml-2 text-xs text-gray-500 font-mono">
              security_config.yaml
            </span>
          </div>
          <div className="p-6 font-mono text-sm text-gray-400 overflow-x-auto">
            <pre>
              {`encryption:
  algorithm: "AES-256-GCM"
  key_rotation: "24h"
  tls_version: "1.3"

access_control:
  mfa_required: true
  session_timeout: "15m"
  audit_logging: "enabled"

compliance:
  - gdpr
  - ccpa
  - soc2_type_ii`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
