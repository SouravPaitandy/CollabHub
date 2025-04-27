"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import Image from "next/image";

const Navbar = () => {
  const [isTop, setIsTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY >= 1) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        // Only force re-render if currently using system theme
        setMounted(false);
        setTimeout(() => setMounted(true), 10);
      }
    };
    
    // Modern approach for event listener
    try {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (e) {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]); // Add theme as dependency

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Return a skeleton with the same structure but without theme-dependent content
    return (
      <nav className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 fixed top-0 transition-all duration-300 z-50">
        {/* Minimal skeleton structure */}
      </nav>
    );
  }

  const isSystemThemeActive = () => {
    if (theme !== 'system') return false;
    
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    
    return systemTheme === currentTheme;
  };

  console.log("Current theme:", theme);
  console.log("System theme active:", isSystemThemeActive());

  return (
    <nav
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 fixed top-0 transition-all duration-300 z-50
            ${
              !isTop
                ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg"
                : "bg-transparent"
            }
            ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
      style={{
        transition: "background-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
            <Image src="/favicon.png" alt="C" width={40} height={40} className="transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"></Image>
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:tracking-wider">
            CollabHub
          </h1>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/features"
            className="text-gray-900 dark:text-amber-50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all after:duration-300"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-gray-900 dark:text-amber-50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all after:duration-300"
          >
            Pricing
          </Link>
          {session ? (
            <div className="relative group">
              <div className="flex gap-2 items-center p-2 border-2 border-indigo-400 dark:border-indigo-500 rounded-md cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300">
                <Image
                  width={28}
                  height={28}
                  priority={true}
                  src={session.user?.image || "/default-avatar.png"}
                  alt="Profile"
                  className="w-7 h-7 rounded-full border-2 border-indigo-300 dark:border-indigo-600"
                />
                <p className="font-medium text-gray-900 dark:text-amber-50">@{session.username}</p>
                <ArrowDownIcon className="h-4 w-4 text-indigo-500 dark:text-indigo-400 transform group-hover:rotate-180 transition-transform duration-300" />
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Signed in as
                  </p>
                  <p className="font-medium text-sm truncate text-gray-900 dark:text-amber-50">
                    {session.user?.email}
                  </p>
                </div>
                <Link
                  href={`/${session.username}`}
                  className="flex items-center px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                  <span className="text-gray-900 dark:text-amber-50">Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center text-left px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              className="relative overflow-hidden group bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-md transition-all duration-300 hover:shadow-[0_5px_15px_rgba(79,70,229,0.4)] hover:from-indigo-600 hover:to-purple-700 hover:translate-y-[-2px]"
            >
              <span className="relative z-10">Login</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300"></span>
            </Link>
          )}
          <div className="relative group">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              <div className="relative w-6 h-6 overflow-hidden">
                <SunIcon
                  className={`w-6 h-6 text-yellow-500 absolute transition-all duration-500 ease-in-out ${
                    theme === "dark" || (theme === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches)
                      ? "opacity-0 rotate-90 scale-0"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                />
                <MoonIcon
                  className={`w-6 h-6 text-blue-400 absolute transition-all duration-500 ease-in-out ${
                    theme === "dark" || (theme === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches)
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-90 scale-0"
                  }`}
                />
              </div>
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
              <button
                onClick={() => setTheme("light")}
                className="flex w-full items-center px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
              >
                <SunIcon className="w-4 h-4 mr-3 text-yellow-500" />
                <span
                  className={`${
                    theme === "light"
                      ? "font-medium text-indigo-600 dark:text-indigo-400"
                      : "text-gray-900 dark:text-amber-50"
                  }`}
                >
                  Light
                </span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className="flex w-full items-center px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
              >
                <MoonIcon className="w-4 h-4 mr-3 text-blue-400" />
                <span
                  className={`${
                    theme === "dark"
                      ? "font-medium text-indigo-600 dark:text-indigo-400"
                      : "text-gray-900 dark:text-amber-50"
                  }`}
                >
                  Dark
                </span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className="flex w-full items-center px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span
                  className={`${
                    theme === "system" || isSystemThemeActive()
                      ? "font-medium text-indigo-600 dark:text-indigo-400"
                      : ""
                  }`}
                >
                  System
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 group transition-all duration-300 text-gray-900 dark:text-amber-50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              {/* First bar */}
              <span 
                className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 translate-y-2.5" : "translate-y-1"
                }`}
              ></span>
              {/* Middle bar */}
              <span 
                className={`absolute block h-0.5 w-4 group-hover:w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-0" : "opacity-100 translate-y-2.5"
                }`}
              ></span>
              {/* Last bar */}
              <span 
                className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 translate-y-2.5" : "translate-y-4"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu with slide-down animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg rounded-lg transform transition-all duration-300">
          <Link
            href="/features"
            className="block px-4 py-2 text-gray-900 dark:text-amber-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:pl-6"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="block px-4 py-2 text-gray-900 dark:text-amber-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:pl-6"
          >
            Pricing
          </Link>
          {session ? (
            <>
              <Link
                href={`/${session.username}`}
                className="block px-4 py-2 text-gray-900 dark:text-amber-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:pl-6"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-gray-900 dark:text-amber-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:pl-6"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="block px-4 py-2 text-gray-900 dark:text-amber-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:pl-6"
            >
              Login
            </Link>
          )}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-amber-50">Theme:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ${
                    theme === "light"
                      ? "bg-gray-200 dark:bg-gray-700 scale-110"
                      : ""
                  }`}
                >
                  <SunIcon className="w-5 h-5 text-yellow-500" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gray-200 dark:bg-gray-700 scale-110"
                      : ""
                  }`}
                >
                  <MoonIcon className="w-5 h-5 text-blue-400" />
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ${
                    theme === "system" || isSystemThemeActive()
                      ? "bg-gray-200 dark:bg-gray-700 scale-110"
                      : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-900 dark:text-amber-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
