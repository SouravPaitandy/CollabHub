"use client";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/ui/SplashScreen";

export default function SplashWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false); // To prevent hydration mismatch

  useEffect(() => {
    setShouldRender(true);
    // Show splash screen on every refresh/initial load
    // We intentionally do NOT check login status or session storage here
    // based on user request to show it on "every hard refresh"
    setIsLoading(true);
  }, []);

  const finishLoading = () => {
    setIsLoading(false);
  };

  if (!shouldRender) return null; // Or return children with opacity 0 to prevent flash

  return (
    <>
      <div className="fixed inset-0 z-[10000] pointer-events-none">
        {/* Ensure Splash is always on top logic via z-index, logic handled inside */}
        {isLoading && <SplashScreen finishLoading={finishLoading} />}
      </div>

      {/* 
        Delay rendering the app until the splash screen is done. 
        This ensures "initial" animations (like Hero text) trigger 
        EXACTLY when the user can see them, not 4 seconds early.
      */}
      {!isLoading && children}
    </>
  );
}
