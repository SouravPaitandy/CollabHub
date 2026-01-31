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
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px]" />
      </div>

      <main>
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          onMouseMove={handleMouseMove}
          className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-20 group"
          style={{ opacity, scale }}
        >
          {/* Lantern Beam */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: lanternBackground,
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                v2.0 is here: Redesigned for focus
              </span>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground">
                Collaborate <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-600">
                  Without Limits
                </span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The all-in-one workspace for your team. Real-time documents, video
              calls, and seamless chat—all wrapped in a beautiful, focused
              interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
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
                className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all"
              >
                {session ? "Go to Dashboard" : "Start Collaborating"}
              </Link>
              <Link
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  featuresRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-xl bg-muted text-foreground font-medium text-lg hover:bg-muted/80 transition-all border border-border"
              >
                See Features
              </Link>
            </div>
          </motion.div>

          {/* Hero Image / Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 w-full max-w-6xl mx-auto"
          >
            <SpotlightCard className="aspect-video shadow-2xl bg-card/50 backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-4xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground aura-text-glow">
                  App Preview UI
                </span>
              </div>
              <div className="w-full h-full bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
            </SpotlightCard>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <div ref={featuresRef} className="py-24 relative z-0">
          <KeyFeatures />
        </div>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto bg-card border border-border rounded-3xl p-8 sm:p-16 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Ready to boost productivity?
              </h2>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                Join thousands of teams already using CollabHub to ship faster
                and work better together.
              </p>
              <Link
                href="/auth"
                className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Get Started for Free
              </Link>
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
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          >
            <FiArrowUp className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
