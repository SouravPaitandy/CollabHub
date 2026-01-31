"use client";

import { motion } from "framer-motion";
import {
  WifiOff,
  Database,
  CloudOff,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const iconMap = {
  network: WifiOff,
  database: Database,
  cloud: CloudOff,
  alert: AlertCircle,
};

/**
 * Beautiful error state component with actions
 * @param {Object} props
 * @param {string} props.icon - Icon type: 'network', 'database', 'cloud', 'alert'
 * @param {string} props.title - Error title
 * @param {string} props.message - Error description
 * @param {Object} props.action - Primary action: { label, onClick }
 * @param {Object} props.secondaryAction - Secondary action: { label, onClick }
 * @param {string} props.variant - 'error', 'warning', 'info'
 */
export default function ErrorState({
  icon = "alert",
  title = "Something went wrong",
  message = "We encountered an error. Please try again.",
  action,
  secondaryAction,
  variant = "error",
}) {
  const Icon = iconMap[icon] || AlertCircle;

  const variantColors = {
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  };

  const variantBgColors = {
    error: "bg-red-500/10 border-red-500/20",
    warning: "bg-yellow-500/10 border-yellow-500/20",
    info: "bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div
          className={`rounded-2xl border ${variantBgColors[variant]} p-8 text-center space-y-6`}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className={`p-4 rounded-full ${variantBgColors[variant]}`}>
              <Icon className={`w-12 h-12 ${variantColors[variant]}`} />
            </div>
          </motion.div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {action && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {action.label}
              </motion.button>
            )}

            {secondaryAction && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={secondaryAction.onClick}
                className="w-full px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
              >
                {secondaryAction.label}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
