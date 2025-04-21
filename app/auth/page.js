'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from 'react';
import { FaGithub, FaCode, FaUserAstronaut } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Loading from "@/components/Loading";
import { motion } from 'framer-motion';

const AuthPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (session) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        router.push(`/${session.username}`);
      }, 3000);
    }
  }, [session, router]);

  const handleGitHubSignIn = () => {
    signIn('github');
  };

  if (status === "loading") {
    return <Loading/>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating code particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gray-700 opacity-10"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -100, 
              rotate: Math.random() * 360 
            }}
            animate={{ 
              y: window.innerHeight + 100,
              rotate: [0, 360],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: Math.random() * 20 + 10, 
              repeat: Infinity,
              ease: "linear" 
            }}
          >
            <FaCode size={Math.random() * 30 + 10} />
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-10 rounded-xl shadow-2xl border border-gray-700"
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
              className="p-3 bg-indigo-600 rounded-full"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaUserAstronaut className="h-10 w-10 text-white" />
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
            className="mt-2 text-center text-sm text-gray-300"
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
        >
          <motion.button
            onClick={handleGitHubSignIn}
            className="group relative w-full flex justify-center py-3 px-4 border-2 border-gray-600 text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(79, 70, 229, 0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span 
              className="absolute left-0 inset-y-0 flex items-center pl-3"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
            >
              <FaGithub className="h-5 w-5 text-indigo-400" />
            </motion.span>
            Sign in with GitHub
          </motion.button>
        </motion.div>

        {session && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-center text-gray-300">Signed in as {session.user.email}</p>
            <motion.button
              onClick={() => signOut()}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
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
          className="fixed bottom-5 right-5 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center"
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
          Welcome aboard, {session.user.email}!
        </motion.div>
      )}
    </div>
  );
};

export default AuthPage;