"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useSession } from "next-auth/react";

const Star = ({ index, shouldAnimate, isMobile }) => {
  const randomDuration = 2 + Math.random() * 4;
  const randomDelay = Math.random() * 5;
  const randomAngle = Math.random() * 360;
  const distance = 100 + Math.random() * 300; // Distance from center to travel

  return (
    <motion.div
      className={`absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full ${isMobile ? "opacity-60" : "shadow-[0_0_8px_white]"}`}
      initial={{
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
      }}
      animate={
        shouldAnimate
          ? {
              x: Math.cos(randomAngle * (Math.PI / 180)) * distance,
              y: Math.sin(randomAngle * (Math.PI / 180)) * distance,
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }
          : {}
      }
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        delay: randomDelay,
        ease: "easeIn",
      }}
    />
  );
};

export default function CTASection() {
  const { data: session } = useSession();
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });

  // Mobile Detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Desktop Scroll Animations (Immersive Takeover)
  // Scale goes from confined (0.9) to full screen (1)
  // Adjusted timing: [0.5, 1] means it starts growing when 50% through the entry phase and hits full size EXACTLY at center.
  const scale = useTransform(scrollYProgress, [0.25, 1], [0.4, 1]);
  // Optional: subtle Y parallax for floating feel
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Mobile: Simple fade/slide
  const mobileY = useTransform(scrollYProgress, [0, 1], [0, 0]);

  // Mobile Entry Animation Props
  const mobileAnimationProps = isMobile
    ? {
        initial: { opacity: 0.8, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" },
        viewport: { once: true, margin: "-50px" },
      }
    : {};

  return (
    <section
      ref={containerRef}
      className={`relative z-10 overflow-hidden ${isMobile ? "py-20 px-4" : "mt-40 mb-20 py-0 px-2 h-[120vh]"}`}
      // Desktop: h-[120vh] ensures enough scroll space for the effect to breathe
    >
      <div
        className={`w-full h-full flex items-center justify-center ${isMobile ? "" : "sticky top-0"}`}
      >
        <motion.div
          style={{
            scale: isMobile ? 1 : scale,
            y: isMobile ? undefined : 0, // Should strictly separate style vs animate
            // For mobile, we use mobileAnimationProps for y entrance
          }}
          {...mobileAnimationProps}
          onMouseEnter={() => !isMobile && setIsHovering(true)}
          onMouseLeave={() => !isMobile && setIsHovering(false)}
          className={`relative bg-black rounded-[2.5rem] border-2 border-white/10 dark:border-white overflow-hidden flex flex-col items-center justify-center text-center group ${
            isMobile
              ? "min-h-[400px] w-full max-w-6xl mx-auto"
              : "w-full h-[120vh]"
          }`}
        >
          {/* Warp Field Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-black to-purple-900/40 opacity-50" />

          {/* Stars / Warp Lines */}
          <div className="absolute inset-0 perspective-1000">
            {[...Array(isMobile ? 15 : isHovering ? 60 : 30)].map((_, i) => (
              <Star
                key={i}
                index={i}
                shouldAnimate={isInView}
                isMobile={isMobile}
              />
            ))}
            {/* Motion Blur Lines on Hover (Desktop Only) */}
            {!isMobile &&
              isHovering &&
              [...Array(20)].map((_, i) => (
                <motion.div
                  key={`line-${i}`}
                  className="absolute top-1/2 left-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-full origin-left"
                  initial={{
                    rotate: Math.random() * 360,
                    scaleX: 0,
                    opacity: 0,
                  }}
                  animate={{ scaleX: 1, opacity: [0, 0.5, 0], x: 200 }} // Shoot out
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: Math.random() * 1,
                  }}
                  style={{ width: "50%" }}
                />
              ))}
          </div>

          {/* Grid Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-[linear-gradient(to_bottom,transparent_0%,rgba(99,102,241,0.2)_100%)] perspective-1000 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,rgba(0,0,0,1)_2px),linear-gradient(90deg,transparent_2px,rgba(0,0,0,1)_2px)] bg-[size:40px_40px] [transform:rotateX(60deg)scale(2)] opacity-30 animate-grid-flow" />
          </div>

          {/* Content */}
          <div className="relative z-20 space-y-8 px-4 max-w-4xl mx-auto">
            <motion.div
              animate={{ scale: isHovering ? 1.05 : 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main Text (Relative - Layout Driver) */}
              <h2 className="relative z-10 text-4xl sm:text-7xl md:text-8xl font-black font-hacker tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-white/50 mb-6 inline-block leading-tight">
                Ready for Liftoff?
                {/* Glow Effect Layer (Desktop Only, Absolute) */}
                {/* {!isMobile && (
                  <span
                    className="absolute inset-0 text-white mix-blend-overlay blur-[3px] opacity-70"
                    aria-hidden="true"
                  >
                    Ready for Liftoff?
                  </span>
                )} */}
              </h2>
            </motion.div>

            <p className="text-lg sm:text-2xl text-zinc-400 max-w-2xl mx-auto font-geist-sans font-light">
              Join the ecosystem that powers the next generation of genius.
            </p>

            <div className="pt-8">
              <Link href={session ? "/dashboard" : "/auth"}>
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 50px rgba(99,102,241,0.6)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group inline-flex items-center gap-3 px-8 py-4 sm:px-12 sm:py-6 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-100 transition-all shadow-2xl shadow-indigo-500/20"
                >
                  <span className="font-geist-sans z-10 tracking-wide">
                    Initialize Workspace
                  </span>
                  <FiArrowRight className="z-10 group-hover:translate-x-1 transition-transform" />

                  {/* Inner Button Gradient */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity blur-lg" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
