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
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background Decor - Cosmic Liquid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <SpotlightCard
        spotlightColor="rgba(99, 102, 241, 0.15)"
        className="max-w-md w-full space-y-8 bg-black/40 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-center mb-8">
            <motion.div
              className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 0 50px rgba(99,102,241,0.4)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <FaUserAstronaut className="h-10 w-10 text-indigo-400" />
            </motion.div>
          </div>
          <motion.h2
            className="mt-6 text-center text-3xl sm:text-4xl font-black font-hacker text-white tracking-tight"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            INITIALIZE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              SEQUENCE
            </span>
          </motion.h2>
          <motion.p
            className="mt-2 text-center text-sm text-zinc-400 font-geist-sans"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Enter the unified workspace for the future.
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
            className="group relative cursor-pointer w-full flex justify-center py-4 px-4 border border-white/10 text-sm font-medium rounded-xl text-white bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden"
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <motion.span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FaGoogle className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
            </motion.span>
            <span className="font-geist-sans tracking-wide">
              Continue with Google
            </span>
          </motion.button>

          {/* GitHub Button */}
          <motion.button
            onClick={handleGitHubSignIn}
            className="group relative cursor-pointer w-full flex justify-center py-4 px-4 border border-white/10 text-sm font-medium rounded-xl text-white bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden"
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <motion.span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FaGithub className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
            </motion.span>
            <span className="font-geist-sans tracking-wide">
              Continue with GitHub
            </span>
          </motion.button>
        </motion.div>

        {session && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-center text-zinc-500 text-xs font-mono">
              IDENTIFIED: {session.user.email}
            </p>
            <motion.button
              onClick={() => signOut()}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-red-500/20 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ABORT SESSION
            </motion.button>
          </motion.div>
        )}
      </SpotlightCard>

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
