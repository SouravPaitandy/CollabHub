"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 flex items-center justify-between mb-8">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Image
            src="/favicon.png"
            alt="Logo"
            fill
            className="object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:aura-text-glow transition-all">
          Coordly
        </span>
      </Link>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 cursor-pointer rounded-full text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-300 hover:rotate-12"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onBlur={() => setTimeout(() => setIsMenuOpen(false), 200)}
            className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-secondary/30 transition-all duration-300 border border-transparent hover:border-border/50 group"
          >
            <div className="relative">
              <Image
                src={session?.user?.image || "/default-pic.png"}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full ring-2 ring-transparent group-hover:ring-primary/50 transition-all border border-border"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background shadow-sm" />
            </div>

            <div className="hidden md:flex flex-col items-start mr-1">
              <span className="text-sm font-semibold max-w-[100px] truncate leading-tight">
                {session?.user?.name || "User"}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Dashboard
              </span>
            </div>

            <ChevronDownIcon
              className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 glass-card rounded-xl shadow-2xl py-2 z-50 overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl ring-1 ring-black/5"
              >
                <div className="px-5 py-4 border-b border-white/10 bg-white/5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-foreground truncate mt-1">
                    {session?.user?.email}
                  </p>
                </div>

                <div className="p-2 space-y-1">
                  <Link
                    href="/profile"
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-white/10 rounded-lg transition-colors group"
                  >
                    <UserCircleIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    Profile Settings
                  </Link>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium group"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
