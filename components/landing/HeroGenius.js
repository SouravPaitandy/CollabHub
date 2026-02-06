"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { FiArrowDown } from "react-icons/fi";
import { useSession } from "next-auth/react";

// --- Magnetic Button Component ---
const MagneticButton = ({ children, className, href, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const itemX = clientX - (left + width / 2);
    const itemY = clientY - (top + height / 2);
    x.set(itemX * 0.1); // Strength of magnetism
    y.set(itemY * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Wrapper = href ? Link : motion.div;
  const props = href
    ? {
        href,
        className,
        ref,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
      }
    : {
        className,
        ref,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        onClick,
      };

  return (
    <Wrapper {...props}>
      <motion.div
        style={{ x, y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </Wrapper>
  );
};

// --- 3D Cosmic Orb (Interactive) ---
const CosmicOrb = ({ mouseX, mouseY, isInView }) => {
  // Removed scroll-driven transforms to eliminate lag
  // Now uses continuous auto-rotation in the JSX below

  // Mouse Parallax (Inverse movement)
  const x = useTransform(mouseX, [0, 1], [20, -20]);
  const y = useTransform(mouseY, [0, 1], [20, -20]);

  // 3D Gyroscopic Tilt
  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-10 opacity-100 perspective-1000">
      <motion.div
        style={{ x, y, rotateX, rotateY }}
        animate={isInView ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="relative w-full h-full transform-3d"
      >
        {/* Core Glow - Pulsing */}
        <motion.div
          animate={
            isInView ? { scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] } : {}
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/30 dark:bg-indigo-500/50 rounded-full blur-[100px]"
        />

        {/* Orbiting Rings - Only animate when visible */}
        <motion.div
          animate={
            isInView
              ? { rotateX: 60, rotateY: [0, 360], rotateZ: -20 }
              : { rotateX: 60, rotateZ: -20 }
          }
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-indigo-500/30 dark:border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
        />
        <motion.div
          animate={
            isInView
              ? { rotateX: -60, rotateY: [0, -360], rotateZ: 20 }
              : { rotateX: -60, rotateZ: 20 }
          }
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-purple-500/30 dark:border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]"
        />

        {/* Third Ring - Off-axis */}
        <motion.div
          animate={
            isInView
              ? { rotateX: 90, rotateY: [0, 360], rotateZ: 45 }
              : { rotateX: 90, rotateZ: 45 }
          }
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-cyan-500/30 dark:border-cyan-500/10"
        />

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-indigo-500 dark:bg-white rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] dark:shadow-[0_0_10px_white]"
            style={{
              x: Math.cos(i) * 200,
              y: Math.sin(i) * 200,
            }}
            animate={
              isInView
                ? {
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }
                : {}
            }
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

// --- Staggered Text Reveal ---
const StaggeredText = ({ text, className }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 1 }, // Keep container visible so children control opacity
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2, // Small initial delay
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 100, // Start lower for more drama
      rotateX: -90, // Add 3D rotation for extra "Genius" feel
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ overflow: "hidden" }} // Ensure no scrollbar issues during animation
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          style={{ display: "inline-block", transformStyle: "preserve-3d" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default function HeroGenius({ onExplore }) {
  const { data: session } = useSession();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const [isMobile, setIsMobile] = useState(true); // Default to true (safe/SSR)

  useEffect(() => {
    // Check mobile status on mount
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mouse Tracking (Only active on desktop)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    // Normalize to 0-1
    mouseX.set(clientX / window.innerWidth);
    mouseY.set(clientY / window.innerHeight);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 sm:pt-20 overflow-hidden perspective-1000"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {isMobile ? (
          /* Mobile Fallback: Lightweight Static Gradient Blur */
          <div className="w-full h-full flex items-center justify-center opacity-40">
            <div className="absolute w-[300px] h-[300px] bg-indigo-500/30 rounded-full blur-[80px] animate-pulse-slow" />
            <div className="absolute w-[250px] h-[250px] bg-purple-500/30 rounded-full blur-[60px] translate-y-10" />
          </div>
        ) : (
          /* Desktop: Full 3D Cosmic Orb */
          <CosmicOrb mouseX={mouseX} mouseY={mouseY} isInView={isInView} />
        )}
      </div>

      {/* Version Pill */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md mb-8 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
          System v2.0 Online
        </span>
      </motion.div>

      {/* Main Headline */}
      <div className="relative z-10 text-center space-y-4">
        <StaggeredText
          text="COLLABORATE"
          className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-foreground font-hacker leading-[0.9]"
        />

        <div className="relative inline-block">
          <h1 className="relative inline-block text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 animate-gradient-x font-hacker leading-[0.9]">
            WITHOUT{" "}
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 animate-gradient-x">
              LIMITS
              <svg
                className="pointer-events-none absolute left-0 right-0 -bottom-1 sm:bottom-4 h-8 w-full"
                viewBox="0 0 120 40"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="underlineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.9" />
                    <stop
                      offset="100%"
                      stopColor="#a855f7"
                      stopOpacity="0.95"
                    />
                  </linearGradient>
                </defs>

                <g>
                  {/* Soft glow base */}
                  <motion.path
                    d="M4 26 C 20 18, 45 30, 70 24 S 116 28, 116 24"
                    fill="none"
                    stroke="#4f46e5"
                    strokeOpacity={0.2}
                    strokeWidth="11"
                    strokeLinecap="round"
                    className="blur-[6px]"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      delay: 0.9,
                      duration: 1.2,
                      ease: "circOut",
                    }}
                  />

                  {/* Main wavy underline */}
                  <motion.path
                    d="M4 26 C 20 18, 45 30, 70 24 S 116 28, 116 24"
                    fill="none"
                    stroke="url(#underlineGradient)"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 1.1, ease: "circOut" }}
                  />
                </g>
              </svg>
            </span>
          </h1>
        </div>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-center font-geist-sans font-light leading-relaxed"
      >
        The unified workspace where code, video, and ideas flow seamlessly.
        Designed for{" "}
        <span className="text-foreground font-medium">high-velocity teams</span>
        .
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-12 flex flex-col sm:flex-row items-center gap-6 z-20"
      >
        {isMobile ? (
          // Mobile: Standard Buttons (No Magnetic Physics)
          <>
            <Link
              href={
                !session
                  ? "/auth"
                  : `/${session?.user?.username || session?.username || "dashboard"}`
              }
              className="px-8 py-4 rounded-xl bg-foreground text-background font-bold text-lg shadow-lg active:scale-95 transition-transform"
            >
              <span className="flex items-center gap-2">
                {session ? "Enter Dashboard" : "Start Building"}
                <FiArrowDown className="-rotate-90" />
              </span>
            </Link>
            <button
              onClick={onExplore}
              className="px-8 py-4 rounded-xl bg-black/5 dark:bg-white/5 text-foreground font-medium text-lg border border-black/10 dark:border-white/10 active:scale-95 transition-transform"
            >
              Explore Features
            </button>
          </>
        ) : (
          // Desktop: Magnetic Buttons
          <>
            <MagneticButton
              href={
                !session
                  ? "/auth"
                  : `/${session?.user?.username || session?.username || "dashboard"}`
              }
              className="group relative px-8 py-4 rounded-xl bg-foreground text-background font-bold text-lg shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {session ? "Enter Dashboard" : "Start Building"}
                <FiArrowDown className="-rotate-90 group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>

            <MagneticButton
              onClick={onExplore}
              className="cursor-pointer px-8 py-4 rounded-xl bg-black/5 dark:bg-white/5 text-foreground font-medium text-lg border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              Explore Features
            </MagneticButton>
          </>
        )}
      </motion.div>
    </section>
  );
}
