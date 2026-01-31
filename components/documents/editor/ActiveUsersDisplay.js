import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ActiveUsersDisplay({ activeUsers }) {
  if (activeUsers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3"
    >
      <div className="flex items-center -space-x-3 px-2">
        <AnimatePresence mode="popLayout">
          {activeUsers.map((user, index) => (
            <motion.div
              layout
              key={`user-${user.clientId || index}`}
              initial={{ scale: 0, opacity: 0, x: -20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0, opacity: 0, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: index * 0.05,
              }}
              className={`relative z-10 group`}
              style={{ zIndex: 50 - index }}
              title={`${user.name}${!user.active ? " (idle)" : ""}`}
            >
              <div
                className={`relative w-8 h-8 rounded-full ring-2 ring-white/10 dark:ring-black/20 overflow-hidden shadow-lg transition-transform duration-200 group-hover:scale-110 group-hover:z-50 ${user.active ? "ring-offset-2 ring-offset-green-500/30" : ""}`}
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover bg-gray-800"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xs font-bold text-white shadow-inner"
                    style={{
                      backgroundColor: user.color,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Status Dot */}
                <div
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-inherit ${
                    user.active
                      ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                      : "bg-gray-400"
                  }`}
                />
              </div>

              {/* Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm border border-white/10">
                {user.name}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {activeUsers.length > 0 && (
          <div className="ml-4 pl-3 border-l border-white/10 h-6 flex items-center">
            <span className="text-xs font-medium text-white/50">
              {activeUsers.length} online
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
