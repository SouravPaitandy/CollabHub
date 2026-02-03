"use client";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  PencilSquareIcon,
  ClockIcon,
  LockClosedIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import SpotlightCard from "@/components/ui/SpotlightCard";

const features = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Real-time Chat",
    description:
      "Instant messaging with threaded conversations and file sharing.",
  },
  {
    icon: VideoCameraIcon,
    title: "Video Conferencing",
    description: "High-quality video calls with screen sharing capabilities.",
  },
  {
    icon: PencilSquareIcon,
    title: "Interactive Whiteboard",
    description: "Collaborative digital canvas for brainstorming and planning.",
  },
  {
    icon: ClockIcon,
    title: "Time Tracking",
    description: "Built-in time tracking for tasks and projects.",
  },
  {
    icon: LockClosedIcon,
    title: "Secure File Sharing",
    description: "End-to-end encrypted file sharing and storage.",
  },
  {
    icon: ChartBarIcon,
    title: "Analytics Dashboard",
    description:
      "Comprehensive analytics to track team productivity and project progress.",
  },
];

export default function FeatureList() {
  return (
    <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <SpotlightCard className="h-full bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 rounded-3xl hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-hacker text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-geist-sans bg-transparent">
                {feature.description}
              </p>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
