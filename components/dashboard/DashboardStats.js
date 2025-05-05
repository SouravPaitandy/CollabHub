import React from 'react'
import { motion } from 'framer-motion'

const DashboardStats = ({stats, isStatsLoading, taskStats}) => {

    // Helper functions for the enhanced stats UI
const getStatBackgroundColor = (label) => {
    switch (label) {
      case "Projects":
        return "from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30";
      case "Tasks":
        return "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30";
      case "Completed":
        return "from-purple-50 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/30";
      case "High Priority":
        return "from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30";
      case "Due Soon":
        return "from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30";
      case "Collaborations":
        return "from-cyan-50 to-sky-50 dark:from-cyan-900/30 dark:to-sky-900/30";
      default:
        return "from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30";
    }
  };
  
  const getStatIconBackground = (label) => {
    switch (label) {
      case "Projects":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300";
      case "Tasks":
        return "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300";
      case "Completed":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300";
      case "High Priority":
        return "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300";
      case "Due Soon":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300";
      case "Collaborations":
        return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  const getTrendColor = (label) => {
    if (label === "Completed") {
      return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
    }
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
  };
  
  const getTrendIcon = (label) => {
    if (label === "Completed") {
      return <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
    }
    return <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
  };
  
  const getTrendText = (label) => {
    if (label === "Completed") {
      return "Up from last week";
    }
    return "Active development";
  };
  
  // Calculate various task states for the progress card
  const calculateTodoTasks = () => {
    return Math.max(0, taskStats.totalTasks - taskStats.completedTasks - calculateInProgressTasks());
  };
  
  const calculateInProgressTasks = () => {
    // Estimate in-progress tasks (could be replaced with actual data from API)
    return Math.max(0, taskStats.totalTasks - taskStats.completedTasks - Math.floor(taskStats.totalTasks * 0.3));
  };


  return (
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="mb-12"
>
  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
    <span className="mr-3 text-indigo-600 dark:text-indigo-400">📊</span>
    Dashboard Analytics
  </h2>

  {isStatsLoading ? (
    // Enhanced loading skeleton
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, index) => (
        <div key={index} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="ml-4 flex-1">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-16 mt-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    // Enhanced stats display
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.03, y: -5 }}
          className={`bg-gradient-to-br ${getStatBackgroundColor(stat.label)} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden`}
        >
          {/* Decorative background pattern */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-30 dark:opacity-20">
            <div className="text-8xl">{stat.icon}</div>
          </div>
          
          <div className="flex items-center relative z-10">
            <div className={`text-4xl p-3 rounded-lg ${getStatIconBackground(stat.label)} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-sm uppercase tracking-wider font-semibold text-gray-600 dark:text-gray-400">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold mt-1 text-gray-800 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
          
          {/* Show trend indicator for certain metrics */}
          {(stat.label === "Tasks" || stat.label === "Completed") && (
            <div className="mt-4 text-xs font-medium flex items-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded ${getTrendColor(stat.label)}`}>
                {getTrendIcon(stat.label)}
                {getTrendText(stat.label)}
              </span>
            </div>
          )}
        </motion.div>
      ))}

      {/* Enhanced Progress Card */}
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100 dark:border-indigo-800/40 col-span-1 md:col-span-2 lg:col-span-3 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-30 dark:opacity-20">
          <div className="text-9xl">📊</div>
        </div>
      
        <div className="flex items-center justify-between relative z-10 mb-6">
          <div>
            <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
              Project Completion
            </h3>
            <p className="text-indigo-600/80 dark:text-indigo-400/80 text-sm mt-1">
              {taskStats.completedTasks} of {taskStats.totalTasks} tasks completed
            </p>
          </div>
          <div className="text-3xl font-bold text-indigo-800 dark:text-indigo-200">
            {taskStats.totalTasks > 0
              ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100)
              : 0}%
          </div>
        </div>
        
        <div className="h-4 w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-inner"
            style={{
              width: `${
                taskStats.totalTasks > 0
                  ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100)
                  : 0
              }%`,
            }}
          ></div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">To Do</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {calculateTodoTasks()}
            </p>
          </div>
          <div className="text-center p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">In Progress</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {calculateInProgressTasks()}
            </p>
          </div>
          <div className="text-center p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {taskStats.completedTasks}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
      )}
</motion.div>
  )
}
export default DashboardStats;