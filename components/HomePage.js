"use client";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/common/Button";
import KeyFeatures from "@/components/KeyFeatures";
import FooterWrapper from "./FooterWrapper";
import { useSession } from "next-auth/react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useMotionTemplate, useMotionValue } from "framer-motion";
import SpotlightCard from "./ui/SpotlightCard";
import MissionControl from "./landing/MissionControl";

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

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-12"
          style={{ opacity, scale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto space-y-8 z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 hover:border-primary/30 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground font-geist-sans tracking-wide">
                v2.0 Now Available
              </span>
            </motion.div>

            <div className="space-y-2 relative">
              <h1 className="text-4xl sm:text-8xl font-bold tracking-tighter text-foreground font-hacker leading-none relative z-10">
                COLLABORATE
                <br className="hidden sm:block" />
                <span className="relative inline-block mt-2">
                  <span className="absolute -inset-2 blur-2xl bg-primary/20 rounded-full"></span>
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500">
                    WITHOUT&nbsp;LIMITS
                  </span>
                </span>
              </h1>
            </div>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-geist-sans font-light">
              The all-in-one workspace for your team. Real-time docs, video, and
              chat - all wrapped in a{" "}
              <span className="text-foreground font-medium">Cosmic Liquid</span>{" "}
              interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link
                href={
                  !session
                    ? "/auth"
                    : `/${
                        session?.user?.username ||
                        session?.username ||
                        "dashboard"
                      }`
                }
                className="group relative px-8 py-4 rounded-xl border border-primary/90 text-primary font-bold text-lg shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] hover:scale-105 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                <span className="relative flex items-center gap-2 font-hacker">
                  {session ? "Launch Dashboard" : "Start Collaborating"}
                  <FiArrowDown className="rotate-[-90deg] group-hover:rotate-0 transition-transform" />
                </span>
              </Link>
              <Link
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  featuresRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-xl bg-white/5 text-foreground font-medium text-lg hover:bg-white/10 transition-all border border-white/10 backdrop-blur-sm font-geist-sans"
              >
                Explore Features
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="mt-20">
          {/* Hero Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.5, duration: 1, type: "spring" }}
            className="mt-20 w-full max-w-6xl mx-auto perspective-1000"
          >
            <div className="relative group rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden h-[600px] md:h-auto md:aspect-[21/9]">
              <MissionControl />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-24 relative z-0">
          <KeyFeatures />
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-2xl p-12 sm:p-24 text-center overflow-hidden shadow-2xl group">
              {/* Background gradient animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>

              {/* Orb decorations */}
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

              <div className="relative z-10 space-y-8">
                <h2 className="text-3xl sm:text-6xl font-bold font-hacker tracking-tight text-white mb-4">
                  Ready to upgrade your workflow?
                </h2>
                <p className="text-lg sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-geist-sans font-light">
                  Join the future of collaboration. Fast, beautiful, and
                  designed for focus.
                </p>
                <div className="pt-8">
                  <Link
                    href={session ? "/dashboard" : "/auth"}
                    className="inline-flex items-center gap-3 px-6 py-3 sm:px-10 sm:py-5 rounded-2xl bg-white text-black font-bold text-sm sm:text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300"
                  >
                    Get Started for Free <FiArrowDown className="-rotate-90" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterWrapper />

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
