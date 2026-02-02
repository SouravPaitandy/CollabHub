"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaGithub, FaGoogle, FaUserAstronaut } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";

import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

import SpotlightCard from "@/components/ui/SpotlightCard";

const AuthContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") ||
    (session?.username ? `/${session.username}` : "/dashboard");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (session) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        router.push(callbackUrl);
      }, 3000);
    }
  }, [session, router, callbackUrl]);

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl });
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background Decor - Cosmic Liquid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] animate-pulse-slow delay-700" />
      </div>

      <motion.div
        className="max-w-md w-full space-y-8 bg-card backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-center">
            <motion.div
              className="p-3 bg-white/5 rounded-2xl border border-white/10"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaUserAstronaut className="h-10 w-10 text-primary" />
            </motion.div>
          </div>
          <motion.h2
            className="mt-6 text-center text-3xl font-extrabold text-white"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Join CollabHub
          </motion.h2>
          <motion.p
            className="mt-2 text-center text-sm text-muted-foreground"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Connect, Collaborate, Create with GitHub
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-4 pt-6"
        >
          {/* Google Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            className="group relative cursor-pointer w-full flex justify-center py-3 px-4 border border-white/10 text-sm font-medium rounded-xl text-foreground bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 15px rgba(234, 67, 53, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FaGoogle className="h-5 w-5 text-red-500" />
            </motion.span>
            Sign in with Google
          </motion.button>

          {/* GitHub Button */}
          <motion.button
            onClick={handleGitHubSignIn}
            className="group relative cursor-pointer w-full flex justify-center py-3 px-4 border border-white/10 text-sm font-medium rounded-xl text-white bg-[#24292e] hover:bg-[#2f363d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 15px rgba(36, 41, 46, 0.5)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="absolute left-0 inset-y-0 flex items-center pl-3"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
            >
              <FaGithub className="h-5 w-5 text-white" />
            </motion.span>
            Sign in with GitHub
          </motion.button>
        </motion.div>

        {session && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-center text-muted-foreground">
              Signed in as {session.user.email}
            </p>
            <motion.button
              onClick={() => signOut()}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive transition-colors duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Sign out
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {showPopup && (
        <motion.div
          className="fixed bottom-5 right-5 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-xl z-50 flex items-center"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
        >
          <motion.div
            className="mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1 }}
          >
            <FaUserAstronaut />
          </motion.div>
          Welcome aboard, {session.user.email}! Redirecting you to your
          profile...
        </motion.div>
      )}
    </div>
  );
};

const AuthPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AuthContent />
    </Suspense>
  );
};

export default AuthPage;
