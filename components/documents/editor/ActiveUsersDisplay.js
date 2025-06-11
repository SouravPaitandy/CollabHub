import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ActiveUsersDisplay({ activeUsers }) {
  if (activeUsers.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-2 bg-indigo-50/70 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50 backdrop-blur-sm"
    >
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Collaborating now:
        </span>
        <div className="flex -space-x-2 hover:-space-x-1 transition-all duration-200">
          <AnimatePresence>
            {activeUsers.map((user, index) => (
              <motion.div
                key={`user-${user.clientId || index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden 
                         bg-gray-200 dark:bg-gray-700
                         hover:scale-110 hover:z-50 hover:shadow-md
                         ${!user.active ? "opacity-60" : "opacity-100"}`}
                title={`${user.name}${!user.active ? " (idle)" : ""}`}
                style={{
                  zIndex: activeUsers.length - index,
                  transition: "all 0.2s ease",
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.active ? (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                ) : (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
          {activeUsers.map((u) => u.name).join(", ")}
        </div>
        {activeUsers.length > 1 && (
          <div className="ml-auto text-xs text-indigo-500 dark:text-indigo-400 font-medium">
            {activeUsers.length} people collaborating
          </div>
        )}
      </div>
    </motion.div>
  );
}