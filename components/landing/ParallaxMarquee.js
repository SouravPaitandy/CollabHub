"use client";
import React, { useRef } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useInView,
  useScroll,
  useVelocity,
  useSpring,
} from "framer-motion";
import { wrap } from "@motionone/utils";

const features = [
  "Real-time Sync",
  "End-to-End Encrypted",
  "4K Video Calls",
  "Infinite Whiteboard",
  "Markdown Support",
  "Kanban Boards",
  "Collaborative Cursors",
  "Team Permissions",
  "Version History",
  "Dark Mode",
  "Offline Support",
  "Export to PDF",
  "Smart Notifications",
  "Slash Commands",
  "Keyboard First",
];

function ParallaxText({
  children,
  baseVelocity = 100,
  isHovered = false,
  isInView = true,
}) {
  const { scrollY } = useScroll();

  // Smooth out the scroll value to remove "roughness" / jitters
  // physics: lighter mass for responsiveness, but enough damping to be smooth
  const smoothScrollY = useSpring(scrollY, {
    mass: 0.5,
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Direct Scroll Mapping: Movement happens ONLY when scrolling
  // We map smoothScrollY directly to the offset.

  const moveDirection = baseVelocity > 0 ? 1 : -1;

  const x = useTransform(smoothScrollY, (v) => {
    // Direct mapping: v is scrollY pixels.
    // We convert pixels to percentage movement.
    // Reduced factor to 0.025 for "heavier", smoother feel.
    const movePercent = v * 0.025 * moveDirection;
    return `${wrap(-20, -45, movePercent)}%`;
  });

  return (
    <div className="parallax overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div
        className="scroller font-hacker font-bold text-4xl md:text-6xl flex whitespace-nowrap flex-nowrap gap-8 md:gap-16 will-change-transform"
        style={{ x }}
      >
        {/* Repeat children to ensure seamless loop */}
        <span className="block mr-8 md:mr-16 text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800 dark:from-gray-200 dark:to-gray-500 opacity-80 uppercase">
          {children}
        </span>
        <span className="block mr-8 md:mr-16 text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800 dark:from-gray-200 dark:to-gray-500 opacity-80 uppercase">
          {children}
        </span>
        <span className="block mr-8 md:mr-16 text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800 dark:from-gray-200 dark:to-gray-500 opacity-80 uppercase">
          {children}
        </span>
        <span className="block mr-8 md:mr-16 text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800 dark:from-gray-200 dark:to-gray-500 opacity-80 uppercase">
          {children}
        </span>
      </motion.div>
    </div>
  );
}

const ParallaxMarquee = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });

  // Mobile Detection
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Split features into two rows for visual variety
  const row1 = features.slice(0, 8).join(" • ");
  const row2 = features.slice(8).join(" • ");

  if (isMobile) {
    return (
      <section className="py-20 px-4 bg-background relative z-10 overflow-hidden">
        <div className="max-w-md mx-auto">
          {/* Static Mobile Layout: Scattered 'Bento' Cloud */}
          <div className="flex flex-wrap justify-center gap-4 py-8">
            {features.map((feature, i) => {
              // Deterministic randomness for layout stability (SSR safe)
              const rotate = ((i * 33) % 11) - 5; // -5deg to 5deg
              const translateY = (i * 17) % 10; // 0px to 10px vertical variation

              return (
                <div
                  key={i}
                  className="px-5 py-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md text-sm font-bold text-foreground/90 shadow-sm transition-all duration-300 hover:scale-110 hover:z-20 hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-lg hover:rotate-0"
                  style={{
                    transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
                  }}
                >
                  {feature}
                </div>
              );
            })}
          </div>
        </div>
        {/* Subtle decorative glow for mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -z-10" />
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="py-24 relative z-10 overflow-hidden bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-12 transform -rotate-2 scale-110">
        {/* Row 1: Base velocity positive -> Moves Right naturally */}
        <div className="group hover:opacity-100 transition-opacity opacity-80">
          <ParallaxText
            baseVelocity={2}
            isHovered={isHovered}
            isInView={isInView}
          >
            {row1}
          </ParallaxText>
        </div>

        {/* Row 2: Base velocity negative -> Moves Left naturally */}
        <div className="group hover:opacity-100 transition-opacity opacity-80">
          <ParallaxText
            baseVelocity={-2}
            isHovered={isHovered}
            isInView={isInView}
          >
            {row2}
          </ParallaxText>
        </div>
      </div>

      {/* Vignette for Fade Effect */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none"></div>
    </section>
  );
};

export default ParallaxMarquee;
