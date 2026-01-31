"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { useState } from "react";

/**
 * Banner shown when user is offline
 * @param {Object} props
 * @param {boolean} props.isOnline - Network status
 * @param {Function} props.onRetry - Retry callback
 */
export default function OfflineBanner({ isOnline = true, onRetry }) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    await onRetry();
    setTimeout(() => setIsRetrying(false), 1000);
  };

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed top-16 left-0 right-0 z-50 mx-auto max-w-2xl px-4"
        >
          <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">You&apos;re offline</p>
                <p className="text-sm text-white/80">
                  Check your internet connection
                </p>
              </div>
            </div>

            {onRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
                />
                Retry
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
