"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-20" />;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed z-50 transition-all duration-300 left-0 right-0 flex justify-center ${
          isScrolled ? "top-4" : "top-0"
        }`}
      >
        <div
          className={`relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-between
          ${
            isScrolled
              ? "w-[90%] max-w-5xl rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-2xl py-2 px-6 border border-black/10 dark:border-white/[0.08] shadow-lg dark:shadow-none"
              : "w-full max-w-7xl px-6 py-4 bg-transparent border-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Image
                src="/favicon.png"
                alt="Logo"
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              />
            </div>
            <span className="text-xl font-hacker font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:aura-text-glow transition-all">
              Coordly
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <div className="flex items-center gap-1 mr-4 bg-secondary/30 rounded-full px-2 py-1 backdrop-blur-sm border border-white/5">
              <NavLink href="/features">Features</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
            </div>

            <div className="h-6 w-px bg-border/50 mx-2" />

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:rotate-12"
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {session ? (
              <UserDropdown session={session} />
            ) : (
              <Link
                href="/auth"
                className="ml-3 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all text-sm shadow-[0_0_20px_-5px_rgba(99,102,241,0.6)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.8)] hover:scale-105 active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-muted-foreground hover:text-primary transition-colors"
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foreground active:scale-90 transition-transform"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-7 h-7" />
              ) : (
                <Bars3Icon className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed inset-x-4 top-24 z-40 md:hidden rounded-2xl glass-card bg-white/90 dark:bg-black/90 border border-black/10 dark:border-white/20 overflow-hidden shadow-2xl backdrop-blur-xl"
          >
            <div className="p-6 space-y-4 flex flex-col">
              <MobileNavLink
                href="/features"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </MobileNavLink>
              <MobileNavLink
                href="/pricing"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </MobileNavLink>
              <div className="border-t border-white/10 my-2" />
              {session ? (
                <>
                  <div className="flex items-center gap-4 px-4 py-3 bg-secondary/30 rounded-xl">
                    <Image
                      src={session.user?.image || "/default-avatar.png"}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-primary/50"
                      alt="User"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        {session.user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {session.user?.email}
                      </span>
                    </div>
                  </div>
                  <MobileNavLink
                    href={`/${session.username || "dashboard"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </MobileNavLink>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-indigo-500/20"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
    >
      {children}
      {isHovered && (
        <motion.div
          layoutId="navdb"
          className="absolute inset-0 bg-secondary/80 rounded-full -z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
};

const MobileNavLink = ({ href, children, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/40 rounded-xl transition-all"
  >
    {children}
  </Link>
);

const UserDropdown = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative ml-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-transparent hover:border-white/10 hover:bg-secondary/30 transition-all duration-300"
      >
        <div className="relative">
          <Image
            src={session.user?.image || "/default-avatar.png"}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full ring-2 ring-transparent group-hover:ring-primary/50 transition-all"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
        </div>
        <span className="text-sm font-medium max-w-[100px] truncate hidden lg:block">
          {session.user?.name}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-60 glass-card rounded-2xl shadow-xl py-1 z-50 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/5 bg-secondary/10">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Signed in as
              </p>
              <p className="text-sm font-semibold text-foreground truncate mt-1">
                {session.user?.email}
              </p>
            </div>
            <div className="p-2">
              <Link
                href={`/${session.username || "dashboard"}`}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/50 rounded-xl transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 cursor-pointer text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
