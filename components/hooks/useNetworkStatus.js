import { useState, useEffect } from "react";
import toast from "react-hot-toast";

/**
 * Hook to detect network status and notify users of connectivity changes
 * @returns {Object} { isOnline: boolean, wasOffline: boolean }
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true,
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast.success("Connection restored!", {
          icon: "🌐",
          duration: 3000,
        });
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast.error("No internet connection", {
        icon: "📡",
        duration: 5000,
      });
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}
