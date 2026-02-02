import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import {
  Users,
  Type,
  Clock,
  CheckCircle2,
  AlignLeft,
  MoreHorizontal,
} from "lucide-react";

export default function EditorStatusHub({
  editor,
  activeUsers = [],
  typingUsers = [],
  lastSaved,
}) {
  const [expanded, setExpanded] = useState(false);

  // Calculate stats
  const text = editor ? editor.getText() : "";
  const words = text.split(/\s+/).filter((w) => w.length > 0).length;
  const chars = text.length;
  const readTime = Math.ceil(words / 200);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 pointer-events-none">
      {/* 1. TYPING INDICATOR (Floats to the left of the main hub) */}
      <AnimatePresence>
        {typingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="pointer-events-auto bg-background/60 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-full shadow-lg flex items-center gap-2 ring-1 ring-black/5"
          >
            <div className="flex gap-0.5">
              <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {typingUsers.length === 1 ? (
                <span className="text-primary font-bold">
                  {typingUsers[0].name}
                </span>
              ) : (
                <span className="text-primary font-bold">
                  {typingUsers.length} people
                </span>
              )}{" "}
              is typing...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN HUB (Mission Control) */}
      <motion.div
        layout
        className="pointer-events-auto bg-background/60 backdrop-blur-2xl border border-white/10 p-1.5 rounded-full shadow-2xl shadow-primary/5 flex items-center gap-1 group/hub transition-all duration-300 hover:scale-105 hover:bg-background/80 hover:border-white/20 ring-1 ring-black/5"
      >
        {/* Active Users Section */}
        <div className="flex items-center pl-1 pr-2 relative">
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 3).map((user, i) => (
              <div
                key={user.clientId || i}
                className="relative w-6 h-6 rounded-full ring-2 ring-white dark:ring-gray-900 overflow-hidden"
                title={user.name}
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-[8px] font-bold text-white bg-indigo-500"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            {activeUsers.length > 3 && (
              <div className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[8px] font-bold text-gray-500">
                +{activeUsers.length - 3}
              </div>
            )}
          </div>
          <div
            className={`w-2 h-2 rounded-full absolute top-0 right-1 border border-white dark:border-gray-900 ${activeUsers.length > 0 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-300"}`}
          />
        </div>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Stats Section (Expandable) */}
        <div
          className="flex items-center gap-3 px-2 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 tabular-nums">
              {words}
            </span>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
              >
                <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center gap-1.5" title="Characters">
                  <Type className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 tabular-nums">
                    {chars}
                  </span>
                </div>
                <div className="flex items-center gap-1.5" title="Read Time">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 tabular-nums">
                    {readTime}m
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Save Status */}
        <div className="pr-3 pl-1 flex items-center gap-1.5 min-w-[80px] justify-end">
          {lastSaved ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                Saved
              </span>
            </>
          ) : (
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
              ...
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
