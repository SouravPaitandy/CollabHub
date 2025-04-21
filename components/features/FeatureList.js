'use client'
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, VideoCameraIcon, PencilSquareIcon, ClockIcon, LockClosedIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const features = [
  { icon: ChatBubbleLeftRightIcon, title: "Real-time Chat", description: "Instant messaging with threaded conversations and file sharing." },
  { icon: VideoCameraIcon, title: "Video Conferencing", description: "High-quality video calls with screen sharing capabilities." },
  { icon: PencilSquareIcon, title: "Interactive Whiteboard", description: "Collaborative digital canvas for brainstorming and planning." },
  { icon: ClockIcon, title: "Time Tracking", description: "Built-in time tracking for tasks and projects." },
  { icon: LockClosedIcon, title: "Secure File Sharing", description: "End-to-end encrypted file sharing and storage." },
  { icon: ChartBarIcon, title: "Analytics Dashboard", description: "Comprehensive analytics to track team productivity and project progress." },
];

export default function FeatureList() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <feature.icon className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}