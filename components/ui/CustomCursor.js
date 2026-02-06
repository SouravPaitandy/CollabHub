"use client";
import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring config for smooth follow
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [cursorVariant, setCursorVariant] = useState("default"); // default, pointer, text
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Check if device is touch-enabled
    const isTouchDevice = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };

    if (isTouchDevice()) {
      return; // Do not mount cursor on touch devices
    }

    setMounted(true);
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;

      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".clickable")
      ) {
        setCursorVariant("pointer");
      } else if (
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("p") ||
        target.closest("h1") ||
        target.closest("h2")
      ) {
        setCursorVariant("text"); // Optional: subtle change for text
      } else {
        setCursorVariant("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "auto";
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  /* 
    High-End "Precision Reticle" Cursor 
    - Core: Diamond Shard (45deg rotated)
    - Ring: Dashed orbit
    - Interaction: Snaps to targets like a sci-fi HUD
  */
  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden mix-blend-difference">
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {/* State: Default (Reticle) */}
        {cursorVariant === "default" && (
          <>
            {/* Rotating Outer Ring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              }}
              className="absolute w-12 h-12 border-[1px] border-dashed border-white/40 rounded-full"
            />
            {/* Core Diamond */}
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-white"
              animate={{ scale: isClicking ? 0.8 : 1 }}
            >
              <path d="M4.5.79v22.42l6.56-6.57h9.29L4.5.79z" />
            </motion.svg>
          </>
        )}

        {/* State: Pointer (Lock-on Brackets) */}
        {cursorVariant === "pointer" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-16 h-16"
          >
            {/* Top Left Bracket */}
            <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
            {/* Top Right Bracket */}
            <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white" />
            {/* Bottom Right Bracket */}
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
            {/* Bottom Left Bracket */}
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white" />

            {/* Pulsing Core */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}

        {/* State: Text (I-Beam) */}
        {cursorVariant === "text" && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 24 }}
            className="w-[2px] bg-white rounded-full"
          />
        )}

        {/* Click Ripple Effect */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 rounded-full border border-white"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
