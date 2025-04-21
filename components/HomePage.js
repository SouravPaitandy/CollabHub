'use client'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/common/Button";
import KeyFeatures from '@/components/KeyFeatures';
import FooterWrapper from "./FooterWrapper";
import { useSession } from "next-auth/react";
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorHovering, setCursorHovering] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const heroRef = useRef(null);

  // Scroll-to-top button visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      setShowScrollToTop(scrollPosition >= documentHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const featuresRef = useRef(null);

  // Enhanced parallax scrolling effect
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, { damping: 15, stiffness: 100 });
  const scrollOpacity = useTransform(smoothScrollProgress, [0, 0.3], [1, 0]);
  const scrollScale = useTransform(smoothScrollProgress, [0, 0.3], [1, 0.95]);
  const backgroundY = useTransform(smoothScrollProgress, [0, 1], ['0%', '30%']);
  
  // Mouse follow effect with enhanced interactivity
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleButtonHover = () => setCursorHovering(true);
    const handleButtonLeave = () => setCursorHovering(false);
    
    // Add event listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('button, a');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleButtonHover);
      el.addEventListener('mouseleave', handleButtonLeave);
    });
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleButtonHover);
        el.removeEventListener('mouseleave', handleButtonLeave);
      });
    };
  }, [mounted]);
  
  // Scroll to features section
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => setMounted(true), []);

  // Enhanced stagger animation variables
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,

      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 12 
      } 
    }
  };

  // Animation variants
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  const floatAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md p-8 space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-4 w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-8 w-1/2 mx-auto"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-40 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-orange-50 via-indigo-200 to-purple-300 dark:from-gray-900 dark:via-neutral-900 dark:to-gray-800 overflow-hidden">
      {/* Custom cursor follower with reactive animations */}
      <AnimatePresence>
        <motion.div 
          className="hidden md:block fixed rounded-full pointer-events-none z-50 mix-blend-difference"
          animate={{ 
            x: cursorPosition.x - (cursorHovering ? 35 : 72), 
            y: cursorPosition.y - (cursorHovering ? 35 : 72),
            width: cursorHovering ? '70px' : '144px',
            height: cursorHovering ? '70px' : '144px',
            opacity: cursorHovering ? 0.5 : 0.2,
            backdropFilter: cursorHovering ? 'blur(8px)' : 'blur(16px)',
          }}
          transition={{ 
            type: "spring", 
            damping: cursorHovering ? 15 : 30, 
            stiffness: cursorHovering ? 300 : 200,
            mass: cursorHovering ? 0.8 : 1
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-500 dark:to-blue-500 blur-xl" />
        </motion.div>
      </AnimatePresence>

      <motion.div
      className={`fixed bottom-16 right-6 z-50`}
      initial="hidden"
      animate={showScrollToTop ? "visible" : "hidden"}
      variants={buttonVariants}
    >
      <motion.div
        className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg text-white cursor-pointer backdrop-blur-md dark:from-blue-600 dark:to-cyan-500"
        whileHover="hover"
        whileTap="tap"
        animate={floatAnimation}
        variants={buttonVariants}
        onClick={scrollToTop}
      >
        <FiArrowUp className="text-xl" />
      </motion.div>
    </motion.div>

      <main>
        <motion.section 
          id="hero-section"
          ref={heroRef}
          className="relative min-h-screen flex items-center mx-auto px-4 sm:px-6 lg:px-8 z-0 overflow-hidden"
          style={{ y: backgroundY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          
          <motion.div 
            style={{ opacity: scrollOpacity, scale: scrollScale }}
            className="text-center relative z-10 w-full"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="overflow-hidden">
              <motion.h2 
                className="text-5xl sm:text-6xl lg:text-7xl pb-4 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-600"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Collaborate Seamlessly
                </motion.span>
              </motion.h2>
            </motion.div>
            
            <motion.div
              variants={item}
              className="mt-6 max-w-2xl mx-auto"
            >
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Join, create, and manage collaborations with ease. Connect with your team through chat, video, 
                and interactive whiteboards.
              </motion.p>
            </motion.div>
            
            <motion.div 
              variants={item} 
              className="mt-10 flex justify-center"
              whileHover={{ scale: 1.02 }}
            >
              <Button 
                href={!session ? "/auth" : `/${session?.user?.username || session?.username || 'dashboard'}`} 
                className="text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-blue-500 dark:to-indigo-600 dark:hover:from-blue-600 dark:hover:to-indigo-700 transform transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 dark:hover:shadow-blue-500/30 px-8 py-4 text-lg rounded-xl"
              >
                <motion.span 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Collaborating
                </motion.span>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={item}
              className="absolute bottom-[-6rem] left-1/2 transform -translate-x-1/2 cursor-pointer"
              initial={{ y: 0 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.2 }}
              onClick={scrollToFeatures}
            >
              <motion.div 
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-gray-800/30 dark:hover:bg-gray-800/50 transition-all duration-300"
                whileTap={{ scale: 0.9 }}
              >
                <FiArrowDown className="text-2xl text-purple-500 dark:text-blue-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        <div ref={featuresRef}>
          <KeyFeatures />
        </div>

        <section className="relative py-32 z-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white/20 dark:from-blue-900/10 dark:to-gray-900/30 z-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1, transition: { duration: 1 } }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="p-1 sm:p-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-xl dark:shadow-purple-500/20"
                whileHover={{ 
                  boxShadow: "0 20px 35px -10px rgba(147, 51, 234, 0.5)", 
                  transition: { duration: 0.3 } 
                }}
              >
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 sm:p-12 backdrop-blur-sm">
                  <div className="text-center">
                    <motion.h3 
                      className="text-3xl sm:text-4xl pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-600 mb-6"
                      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      Ready to boost your team&apos;s productivity?
                    </motion.h3>
                    
                    <motion.p 
                      className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      Join CollabHub today and experience seamless collaboration 
                      <br className="hidden sm:block" /> like never before.
                    </motion.p>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      {!session ? (
                        <Button 
                          href="/auth" 
                          className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-700 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-600 dark:hover:from-blue-600 dark:hover:via-indigo-600 dark:hover:to-purple-700 px-10 py-4 text-lg font-medium transition duration-300 shadow-lg hover:shadow-purple-500/40 dark:hover:shadow-blue-500/40 rounded-xl"
                        >
                          <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            Sign Up Now
                          </motion.span>
                        </Button>
                      ) : (
                        <Button 
                          href={`/${session?.user?.username || session?.username || 'dashboard'}`} 
                          className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-700 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-600 dark:hover:from-blue-600 dark:hover:via-indigo-600 dark:hover:to-purple-700 px-10 py-4 text-lg font-medium transition duration-300 shadow-lg hover:shadow-purple-500/40 dark:hover:shadow-blue-500/40 rounded-xl"
                        >
                          <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            Collaborate
                          </motion.span>
                        </Button>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <FooterWrapper/>
    </div>
  );
}