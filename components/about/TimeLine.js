'use client'
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Timeline() {
    const milestones = [
        { year: 2024, event: "CollabHub founded", icon: "🚀", description: "Started with a vision to revolutionize collaboration." },
        { year: 2024, event: "Launch of our first product", icon: "🎉", description: "A milestone that marked our entry into the market." },
        { year: 2024, event: "Reached 100,000 users", icon: "🏆", description: "Growing community of passionate collaborators." },
        { year: 2024, event: "Expanded to international markets", icon: "🌍", description: "Taking our solution to teams worldwide." },
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Our Journey</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Follow our path from idea to revolution
                    </p>
                </motion.div>
                
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-300 to-indigo-600 dark:from-indigo-700 dark:to-indigo-400 rounded-full"></div>
                    
                    {milestones.map((milestone, index) => (
                        <TimelineItem 
                            key={index} 
                            milestone={milestone} 
                            index={index} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TimelineItem({ milestone, index }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className="mb-20 relative">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-center"
            >
                {/* Year indicator */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-10">
                    <div className="bg-indigo-100 dark:bg-indigo-900 px-4 py-1 rounded-full shadow-sm">
                        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{milestone.year}</p>
                    </div>
                </div>
                
                {/* Content card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'mr-auto pr-12' : 'ml-auto pl-12'}`}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center mb-3">
                            <span className="text-2xl mr-3">{milestone.icon}</span>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{milestone.event}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                    </div>
                </div>
                
                {/* Timeline node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="w-5 h-5 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-md z-10"></div>
                    <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900 rounded-full absolute animate-ping-slow opacity-75"></div>
                </div>
            </motion.div>
        </div>
    );
}