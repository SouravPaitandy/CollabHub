// components/Footer.js
"use client";
import { Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast"; // Install if not already: npm install react-hot-toast
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";

const FooterLink = ({ href, children }) => (
  <Link
    href={href}
    className="text-muted-foreground hover:text-primary transition-colors"
  >
    {children}
  </Link>
);

import { motion } from "framer-motion";

const SocialIcon = ({ href, icon }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -3, scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="p-3 rounded-full bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5"
  >
    {icon}
  </motion.a>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-background text-foreground overflow-hidden">
      {/* Cinematic Grain Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Large Decorative Watermark */}
      <div className="absolute bottom-50 sm:-bottom-10 sm:left-0 left-1/2 -translate-x-1/2 sm:translate-x-0 text-[20vw] font-hacker font-bold text-foreground/20 dark:text-foreground/10 pointer-events-none select-none leading-none opacity-50 dark:opacity-60">
        COORDLY
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="space-y-6 md:col-span-2">
            <h3 className="text-4xl font-hacker font-bold text-foreground">
              Coordly
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-geist-sans">
              <span className="text-primary font-semibold">
                Evolutionary collaboration.
              </span>{" "}
              <br />
              Empowering teams to ship faster in a unified, high-performance
              workspace.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubmit} className="space-y-3 max-w-xs">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Join the Beta
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full mt-2 px-4 py-3 bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.1] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all font-light group-hover:border-primary/30"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-4 bottom-2 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "..." : "Join"}
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-6 text-foreground tracking-wider uppercase font-hacker">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <FooterLink href="/features">Features</FooterLink>
              </li>
              <li>
                <FooterLink href="/pricing">Pricing</FooterLink>
              </li>
              <li>
                <FooterLink href="/updates">Changelog</FooterLink>
              </li>
              <li>
                <FooterLink href="/manifesto">Manifesto</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-6 text-foreground tracking-wider uppercase font-hacker">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <FooterLink href="/about">About Us</FooterLink>
              </li>
              <li>
                <FooterLink href="/careers">Careers</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact">Contact</FooterLink>
              </li>
              <li>
                <FooterLink href="/press">Press Kit</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-6 text-foreground tracking-wider uppercase font-hacker">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <FooterLink href="/terms">Terms</FooterLink>
              </li>
              <li>
                <FooterLink href="/privacy">Privacy</FooterLink>
              </li>
              <li>
                <FooterLink href="/security">Security</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-xs font-mono">
            &copy; {new Date().getFullYear()} Coordly. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <SocialIcon
              href="https://www.souravpaitandy.me/"
              icon={<FaGlobe className="h-5 w-5" />}
            />
            <SocialIcon
              href="https://x.com/PaitandySourav/"
              icon={<FaTwitter className="h-5 w-5" />}
            />
            <SocialIcon
              href="https://github.com/SouravPaitandy/CollabHub/"
              icon={<FaGithub className="h-5 w-5" />}
            />
            <SocialIcon
              href="https://www.linkedin.com/in/sourav-paitandy/"
              icon={<FaLinkedin className="h-5 w-5" />}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
