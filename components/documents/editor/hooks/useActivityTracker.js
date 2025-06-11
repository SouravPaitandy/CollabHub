import { useEffect } from "react";

export function useActivityTracker({ wsProviderRef, userData }) {
  useEffect(() => {
    if (!wsProviderRef.current || !userData) return;

    let lastActiveTime = Date.now();
    let isUserActive = true;
    const wsProvider = wsProviderRef.current;

    // Update user activity state
    const updateActivity = () => {
      lastActiveTime = Date.now();

      if (!isUserActive) {
        isUserActive = true;
        wsProvider.awareness.setLocalStateField("user", {
          ...userData,
          active: true,
        });
      }
    };

    // Check if user is inactive (30 seconds threshold)
    const checkInactivity = () => {
      if (Date.now() - lastActiveTime > 30000 && isUserActive) {
        isUserActive = false;
        wsProvider.awareness.setLocalStateField("user", {
          ...userData,
          active: false,
        });
      }
    };

    // Set up event listeners for user activity
    const events = ["mousemove", "keydown", "click", "touchstart", "touchmove"];
    events.forEach((event) => {
      document.addEventListener(event, updateActivity);
    });

    // Create interval to check inactivity
    const inactivityInterval = setInterval(checkInactivity, 10000);

    // Initial activity state
    wsProvider.awareness.setLocalStateField("user", {
      ...userData,
      active: true,
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(inactivityInterval);
    };
  }, [userData, wsProviderRef.current]);
}