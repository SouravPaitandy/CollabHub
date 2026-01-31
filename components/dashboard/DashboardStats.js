import React from "react";
import { motion } from "framer-motion";
import SpotlightCard from "../ui/SpotlightCard";
import { useCountUp } from "../hooks/useCountUp";

const AnimatedNumber = ({ value }) => {
  const animatedValue = useCountUp(value);
  return <>{animatedValue}</>;
};

const DashboardStats = ({ stats, isStatsLoading, taskStats }) => {
  const getStatIconBackground = (label) => {
    switch (label) {
      case "Projects":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "Tasks":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "Completed":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "High Priority":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "Due Soon":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "Collaborations":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Calculate various task states for the progress card
  const calculateTodoTasks = () => {
    return Math.max(
      0,
      taskStats.totalTasks -
        taskStats.completedTasks -
        calculateInProgressTasks(),
    );
  };

  const calculateInProgressTasks = () => {
    // Estimate in-progress tasks (could be replaced with actual data from API)
    return Math.max(
      0,
      taskStats.totalTasks -
        taskStats.completedTasks -
        Math.floor(taskStats.totalTasks * 0.3),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center">
        <span className="mr-3 text-primary">✨</span>
        Dashboard Analytics
      </h2>

      {isStatsLoading ? (
        // Enhanced loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`bg-card rounded-xl p-6 shadow-sm border border-border animate-pulse ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                } ${index === 1 ? "md:col-span-2" : ""}`}
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="h-10 w-10 bg-muted rounded-lg mb-4"></div>
                  <div>
                    <div className="h-4 w-20 bg-muted rounded mb-2"></div>
                    <div className="h-8 w-32 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        /* Bento Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}
                ${index === 1 ? "md:col-span-2" : ""} 
                `}
            >
              <SpotlightCard className="h-full">
                <div className="p-6 h-full flex flex-col justify-between relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-2xl ${getStatIconBackground(
                        stat.label,
                      )} bg-opacity-10 backdrop-blur-sm`}
                    >
                      {stat.icon}
                    </div>
                    {index === 0 && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        Primary Focus
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      {stat.label}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`font-bold tracking-tight text-foreground ${
                          index === 0 ? "text-5xl" : "text-3xl"
                        }`}
                      >
                        <AnimatedNumber value={stat.value} />
                      </span>
                      {index === 0 && (
                        <span className="text-sm text-green-500 font-medium flex items-center">
                          +12%{" "}
                          <span className="ml-1 text-muted-foreground font-normal">
                            this week
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Decorative Elements for larger tiles */}
                  {index === 0 && (
                    <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                      <span className="text-9xl">{stat.icon}</span>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}

          {/* Enhanced Progress Card - Bento Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 lg:col-span-4"
          >
            <SpotlightCard className="h-full">
              <div className="p-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          Project Velocity
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          Overall completion rate across all active projects
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-bold text-primary">
                          {taskStats.totalTasks > 0
                            ? Math.round(
                                (taskStats.completedTasks /
                                  taskStats.totalTasks) *
                                  100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </div>

                    {/* Custom Progress Bar */}
                    <div className="h-4 w-full bg-muted rounded-full overflow-hidden mb-8 relative">
                      <div className="absolute inset-0 bg-primary/5"></div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            taskStats.totalTasks > 0
                              ? (taskStats.completedTasks /
                                  taskStats.totalTasks) *
                                100
                              : 0
                          }%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-indigo-400 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)] relative"
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50"></div>
                      </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                          Pending
                        </div>
                        <div className="text-xl font-bold text-foreground">
                          {calculateTodoTasks()}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                          Active
                        </div>
                        <div className="text-xl font-bold text-yellow-500">
                          {calculateInProgressTasks()}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                          Done
                        </div>
                        <div className="text-xl font-bold text-green-500">
                          {taskStats.completedTasks}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Circular Progress Visual */}
                  <div className="hidden md:flex items-center justify-center relative w-48 h-48 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-muted/20"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-primary drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          88 *
                          (1 -
                            (taskStats.totalTasks > 0
                              ? taskStats.completedTasks / taskStats.totalTasks
                              : 0))
                        }
                        initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                        animate={{
                          strokeDashoffset:
                            2 *
                            Math.PI *
                            88 *
                            (1 -
                              (taskStats.totalTasks > 0
                                ? taskStats.completedTasks /
                                  taskStats.totalTasks
                                : 0)),
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">
                          Efficiency
                        </div>
                        <div className="text-xl font-bold text-foreground">
                          High
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
export default DashboardStats;
