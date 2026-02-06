"use client";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { useMotionTemplate, useMotionValue } from "framer-motion";
import MissionControl from "./landing/MissionControl";
import HeroGenius from "./landing/HeroGenius";
import BentoFeatures from "./landing/BentoFeatures";
import ParallaxMarquee from "./landing/ParallaxMarquee";
import CTASection from "./landing/CTASection";

export default function HomePage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  // Lantern Effect Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Scroll Animations
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });
  const opacity = useTransform(smoothScrollProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(smoothScrollProgress, [0, 0.2], [1, 0.95]);

  const lanternBackground = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(var(--primary), 0.15),
      transparent 80%
    )
  `;

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      <main className="relative z-10">
        {/* Animated Liquid Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px]"
          />
        </div>

        {/* Global Cinematic Grain Overlay */}
        <div
          className="fixed inset-0 z-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Hero Section */}
        <HeroGenius
          onExplore={(e) => {
            e?.preventDefault();
            featuresRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <section className="mt-20">
          {/* Hero Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.5, duration: 1, type: "spring" }}
            className="mt-20 w-full max-w-6xl mx-auto perspective-1000"
          >
            <div className="relative group rounded-2xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden h-[600px] md:h-auto md:aspect-[21/9]">
              <MissionControl />
            </div>
          </motion.div>
        </section>

        {/* Features Section - Upgraded to Bento Grid */}
        <section ref={featuresRef} className="relative z-0">
          <BentoFeatures />
          <ParallaxMarquee />
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="group cursor-pointer fixed bottom-8 right-8 z-50 p-3 rounded-full bg-transparent backdrop-blur-sm border-2 border-primary text-primary shadow-lg hover:shadow-xl transition-all"
          >
            <FiArrowUp className="text-xl group-hover:translate-y-[-4px] transition-all duration-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
