"use client";
import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import SpotlightCard from "../ui/SpotlightCard";

const BentoCard = ({
  title,
  description,
  icon: Icon,
  className,
  delay,
  children,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]); // Inverted for "look at" feel
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      viewport={{ once: true }}
      className={`${className} group perspective-1000`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full"
      >
        <SpotlightCard className="h-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden hover:border-sidebar-primary/50 transition-colors duration-500">
          <div className="relative h-full p-6 flex flex-col transform-3d">
            {/* Background Gradient Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-purple-500/10 transition-all duration-700 pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-4 relative z-10 translate-z-10">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold font-hacker text-lg text-foreground">
                {title}
              </h3>
            </div>

            {/* Content */}
            <p className="text-muted-foreground font-geist-sans text-sm leading-relaxed mb-6 relative z-10 flex-grow translate-z-5">
              {description}
            </p>

            {/* Visual Preview Area (The 'Genius' Part) */}
            <div className="relative w-full flex-grow min-h-[100px] rounded-lg bg-black/5 dark:bg-black/20 overflow-hidden border border-black/5 dark:border-white/5 group-hover:border-primary/20 transition-colors translate-z-0">
              {children}
            </div>
          </div>
        </SpotlightCard>
      </motion.div>
    </motion.div>
  );
};

// Preview Components (Visual Placeholders)
const ChatPreview = () => (
  <div className="p-4 space-y-3 font-geist-sans text-[10px]">
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="flex gap-2"
    >
      <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
        A
      </div>
      <div className="bg-white/50 dark:bg-white/10 p-2 rounded-lg rounded-tl-none">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }} // Typewriter feel simulated by fade
        >
          Changes deployed?
        </motion.p>
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 }}
      className="flex gap-2 flex-row-reverse"
    >
      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
        Me
      </div>
      <div className="bg-primary/20 p-2 rounded-lg rounded-tr-none">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          Live now! 🚀
        </motion.p>
      </div>
    </motion.div>
  </div>
);

const VideoPreview = () => (
  <div className="relative w-full h-full bg-black/40 flex items-center justify-center overflow-hidden">
    {/* Simulated waveform */}
    <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ height: ["20%", "80%", "20%"] }}
          transition={{
            duration: 0.5 + Math.random(),
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className="w-2 bg-indigo-500 rounded-full"
        />
      ))}
    </div>

    <div className="relative z-10 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center backdrop-blur-md border border-red-500/50">
      <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-20" />
      <VideoCameraIcon className="w-6 h-6 text-red-500" />
    </div>
  </div>
);

const TaskPreview = () => (
  <div className="p-3 space-y-2">
    {[1, 2].map((i) => (
      <div key={i} className="flex items-center gap-2 opacity-60">
        <div className="w-3 h-3 rounded border border-black/20 dark:border-white/20" />
        <div className="h-1.5 w-full rounded bg-black/10 dark:bg-white/10" />
      </div>
    ))}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-2"
    >
      <motion.div
        initial={{ backgroundColor: "rgba(34, 197, 94, 0)" }}
        whileInView={{
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          borderColor: "rgba(34, 197, 94, 0.5)",
        }}
        transition={{ delay: 1 }}
        className="w-3 h-3 rounded border border-black/20 dark:border-white/20"
      >
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
          className="block text-green-500 text-[8px] text-center leading-3"
        >
          ✓
        </motion.span>
      </motion.div>
      <div className="h-1.5 w-3/4 rounded bg-black/20 dark:bg-white/20 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="h-full bg-green-500"
        />
      </div>
    </motion.div>
  </div>
);

const BentoFeatures = () => {
  return (
    <section className="py-32 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mb-0.5 animate-pulse"></span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest font-geist-sans">
            Power Grid
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold font-hacker text-foreground mb-6">
          Everything you need <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500">
            in one void.
          </span>
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[300px]">
        {/* Item 1: Real-time Chat (Large) */}
        <BentoCard
          title="Encrypted Chat"
          description="Real-time messaging with end-to-end encryption. Channels, DMs, and thread support."
          icon={ChatBubbleLeftRightIcon}
          className="md:col-span-2 md:row-span-1"
          delay={0.1}
        >
          <ChatPreview />
        </BentoCard>

        {/* Item 2: Tasks (Tall) */}
        <BentoCard
          title="Task Boards"
          description="Kanban boards with drag-and-drop to manage your sprint velocity."
          icon={Squares2X2Icon}
          className="md:col-span-1 md:row-span-2"
          delay={0.2}
        >
          <TaskPreview />
        </BentoCard>

        {/* Item 3: Video (Standard) */}
        <BentoCard
          title="HD Video"
          description="Crystal clear video calls with low latency and screen sharing."
          icon={VideoCameraIcon}
          className="md:col-span-1 md:row-span-1"
          delay={0.3}
        >
          <VideoPreview />
        </BentoCard>

        {/* Item 4: Whiteboard (Wide) */}
        <BentoCard
          title="Infinite Canvas"
          description="A collaborative whiteboard for brainstorming ideas and diagrams in real-time."
          icon={PencilSquareIcon}
          className="md:col-span-2 md:row-span-1"
          delay={0.4}
        >
          <div className="w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        </BentoCard>

        {/* Item 5: Docs (Standard) */}
        <BentoCard
          title="Live Docs"
          description="Multi-player markdown editing with collaborative cursors."
          icon={DocumentTextIcon}
          className="md:col-span-2 lg:col-span-1 md:row-span-1"
          delay={0.5}
        >
          <div className="p-4 space-y-2">
            <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded" />
            <div className="h-2 w-3/4 bg-black/10 dark:bg-white/10 rounded" />
            <div className="h-2 w-5/6 bg-black/10 dark:bg-white/10 rounded" />
            <div className="flex gap-2 mt-4">
              <div className="w-4 h-4 rounded-full bg-yellow-500/50 border border-yellow-500" />
              <div className="w-1 h-4 bg-yellow-500/50 rounded-full animate-pulse" />
            </div>
          </div>
        </BentoCard>
      </div>
    </section>
  );
};

export default BentoFeatures;
