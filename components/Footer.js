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

const SocialIcon = ({ href, icon }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-muted-foreground hover:text-primary transition-colors"
  >
    {icon}
  </Link>
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
    <footer className="bg-background border-t border-black/5 dark:border-white/[0.08] text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-hacker font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-900/60 dark:from-white dark:to-white/60">
              Coordly
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Empowering teams to collaborate seamlessly and efficiently in a
              unified workspace.
            </p>
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
                <FooterLink href="/contact">Contact</FooterLink>
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
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-6 text-foreground tracking-wider uppercase font-hacker">
              Stay in loop
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all font-light"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs font-mono">
            &copy; {new Date().getFullYear()} Coordly. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <SocialIcon
              href="https://www.souravpaitandy.me/"
              icon={<FaGlobe className="h-6 w-6" />}
            />
            <SocialIcon
              href="https://x.com/PaitandySourav/"
              icon={<FaTwitter className="h-6 w-6" />}
            />
            <SocialIcon
              href="https://github.com/SouravPaitandy/CollabHub/"
              icon={<FaGithub className="h-6 w-6" />}
            />
            <SocialIcon
              href="https://www.linkedin.com/in/sourav-paitandy/"
              icon={<FaLinkedin className="h-6 w-6" />}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
