"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGlobeAmericas,
  FaBolt,
  FaServer,
  FaCodeBranch,
  FaCheckCircle,
} from "react-icons/fa";
import { FiActivity } from "react-icons/fi";

const ACTIVITY_LOGS = [
  {
    action: "Workspace Created",
    user: "Team Alpha",
    location: "Tokyo, JP",
    time: "Just now",
  },
  {
    action: "Deploy Successful",
    user: "DevOps_Pro",
    location: "San Francisco, US",
    time: "2s ago",
  },
  {
    action: "Task Completed",
    user: "Sarah J.",
    location: "London, UK",
    time: "5s ago",
  },
  {
    action: "New Collaborator",
    user: "DesignStudio",
    location: "Berlin, DE",
    time: "12s ago",
  },
  {
    action: "Document Shared",
    user: "Product Team",
    location: "New York, US",
    time: "18s ago",
  },
];

export default function MissionControl() {
  const [logs, setLogs] = useState(ACTIVITY_LOGS);
  const [activeUsers, setActiveUsers] = useState(1240);
  const [systemLoad, setSystemLoad] = useState(42);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate logs
      setLogs((prev) => {
        const newLog = {
          ...ACTIVITY_LOGS[Math.floor(Math.random() * ACTIVITY_LOGS.length)],
        };
        newLog.time = "Just now";
        return [newLog, ...prev.slice(0, 4)];
      });

      // Fluctuate active users
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 5) - 2);

      // Fluctuate system load
      setSystemLoad((prev) =>
        Math.min(Math.max(prev + Math.floor(Math.random() * 10) - 5, 20), 80),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col md:flex-row bg-white/80 dark:bg-[#030014]/80 backdrop-blur-2xl">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      {/* Left Panel: System Status */}
      <div className="flex-1 p-4 md:p-6 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/10 flex flex-col gap-4 md:gap-6 min-h-0">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-hacker text-primary/80 tracking-widest uppercase">
              System Optimal
            </span>
          </div>
          <span className="text-xs font-geist-sans text-muted-foreground">
            v2.4.0-stable
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0">
          <div className="p-3 md:p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between mb-2">
              <FaGlobeAmericas className="text-blue-400 text-lg" />
              <span className="text-[10px] md:text-xs text-muted-foreground font-geist-sans">
                Active Users
              </span>
            </div>
            <div className="text-xl md:text-2xl font-bold font-hacker text-foreground">
              {activeUsers.toLocaleString()}
            </div>
            <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: "50%" }}
                animate={{ width: "65%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="h-full bg-blue-500 rounded-full"
              ></motion.div>
            </div>
          </div>

          <div className="p-3 md:p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between mb-2">
              <FaBolt className="text-yellow-400 text-lg" />
              <span className="text-[10px] md:text-xs text-muted-foreground font-geist-sans">
                Velocity
              </span>
            </div>
            <div className="text-xl md:text-2xl font-bold font-hacker text-foreground">
              98
              <span className="text-sm text-muted-foreground font-normal">
                %
              </span>
            </div>
            <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
              <motion.div
                animate={{ width: `${systemLoad}%` }}
                className="h-full bg-yellow-400 rounded-full"
              ></motion.div>
            </div>
          </div>
        </div>

        {/* Central Visualizer (Mini-Map / Radar) */}
        <div className="flex-1 bg-black/5 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 relative flex items-center justify-center overflow-hidden min-h-[150px] md:min-h-0">
          {/* Radar Rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
              className="absolute border border-primary/20 rounded-full w-20 h-20"
            ></motion.div>
          ))}
          <div className="relative z-10 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/40 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
              <FiActivity className="text-xl md:text-2xl text-white" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary mt-3 font-hacker">
              Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Activity Stream */}
      <div className="flex-1 p-4 md:p-6 flex flex-col min-h-0">
        <h3 className="text-sm font-hacker text-muted-foreground uppercase tracking-wider mb-4 border-b border-black/10 dark:border-white/10 pb-2">
          Global Activity Stream
        </h3>
        <div className="flex-1 overflow-hidden relative min-h-[200px] md:min-h-0">
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {logs.map((log, i) => (
                <motion.div
                  key={`${log.action}-${i}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      i === 0
                        ? "bg-primary/20 text-primary"
                        : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {i % 2 === 0 ? (
                      <FaCodeBranch size={12} />
                    ) : (
                      <FaCheckCircle size={12} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate font-geist-sans">
                        {log.action}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {log.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {log.user} • {log.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Fade out bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#030014] to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
