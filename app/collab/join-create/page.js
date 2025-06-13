"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { FaUsers, FaPlusCircle, FaArrowRight, FaKey, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const JoinCreateCollab = () => {
  const [formData, setFormData] = useState({
    inviteCode: '',
    collabName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('join');
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const endpoint = type === 'join' ? '/api/collab/join' : '/api/collab/create';
      const payload = type === 'join' 
        ? { inviteCode: formData.inviteCode }
        : { name: formData.collabName };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(type === 'join' ? 'Successfully joined collab!' : 'Collab created successfully!');
        router.push(type === 'join' ? `/chat/${data.collabId}` : `/collab/admin/${data.collabId}`);
      } else {
        toast.error(data.message || (type === 'join' ? 'Invalid invite code. Please try again.' : 'Failed to create collab.'));
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading component
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div 
          className="w-20 h-20 border-t-4 border-blue-500 border-solid rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Not logged in view
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-10 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl backdrop-blur-md max-w-md w-full"
        >
          <FaShieldAlt className="text-5xl text-blue-600 dark:text-blue-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Authentication Required</h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-6">Please sign in to join or create a collaboration space.</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium transition duration-300 flex items-center justify-center gap-2"
            onClick={() => router.push('/auth')}
          >
            <FaKey /> Sign In to Continue
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const backgroundGradient = isDark
    ? "bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"
    : "bg-[radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]";

  return (
    <div>
      <div className={`fixed -z-10 h-full w-full top-0 left-0 ${backgroundGradient}`}></div>
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="min-h-screen text-gray-900 dark:text-white p-6 flex flex-col items-center justify-center"
      >
        <div className="relative max-w-4xl w-full">
          <div className="absolute top-2 -left-60">
                  <motion.button
                    onClick={() => window.history.back()}
                    className="mb-4 ml-24 flex items-center text-[#4a6fa5] dark:text-blue-400 hover:text-[#3a5a8c] dark:hover:text-blue-300 transition-colors duration-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ x: -3 }}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </motion.button>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400"
          >
            Collaborate & Create
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-center mb-12 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Join an existing collaboration or create your own space for seamless teamwork
          </motion.p>
          
          <div className="mb-10 flex justify-center">
            <div className="bg-white/20 dark:bg-gray-800/30 p-1.5 rounded-full flex  gap-2 backdrop-blur-sm">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('join')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'join' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60'
                }`}
              >
                <FaUsers /> Join
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('create')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'create' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60'
                }`}
              >
                <FaPlusCircle /> Create
              </motion.button>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'join' ? (
                <motion.div
                  key="join"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 30, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mr-4">
                      <FaUsers className="text-3xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-semibold">Join a Collab</h2>
                  </div>
                  <form onSubmit={(e) => handleSubmit(e, 'join')} className="space-y-5">
                    <div className="relative">
                      <input
                        type="text"
                        name="inviteCode"
                        value={formData.inviteCode}
                        onChange={handleInputChange}
                        placeholder="Enter invite code"
                        className="w-full p-4 pl-4 pr-12 bg-gray-50 dark:bg-gray-700/90 rounded-lg border-2 border-transparent focus:border-blue-400 focus:ring-0 focus:outline-none transition-all duration-300"
                        required
                      />
                      <div className="absolute right-3 top-3 text-gray-400">
                        <FaArrowRight />
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.03, boxShadow: "0 15px 25px -5px rgba(59, 130, 246, 0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg font-medium transition-all duration-300 flex justify-center items-center gap-2"
                    >
                      {isLoading ? (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-t-2 border-white border-solid rounded-full"
                        />
                      ) : (
                        <>
                          <FaUsers /> Join Collaboration
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="create"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full mr-4">
                      <FaPlusCircle className="text-3xl text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-semibold">Create a Collab</h2>
                  </div>
                  <form onSubmit={(e) => handleSubmit(e, 'create')} className="space-y-5">
                    <div className="relative">
                      <input
                        type="text"
                        name="collabName"
                        value={formData.collabName}
                        onChange={handleInputChange}
                        placeholder="Enter collab name"
                        className="w-full p-4 pl-4 pr-12 bg-gray-50 dark:bg-gray-700/90 rounded-lg border-2 border-transparent focus:border-green-400 focus:ring-0 focus:outline-none transition-all duration-300"
                        required
                      />
                      <div className="absolute right-3 top-3 text-gray-400">
                        <FaPlusCircle />
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.03, boxShadow: "0 15px 25px -5px rgba(34, 197, 94, 0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg font-medium transition-all duration-300 flex justify-center items-center gap-2"
                    >
                      {isLoading ? (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-t-2 border-white border-solid rounded-full"
                        />
                      ) : (
                        <>
                          <FaPlusCircle /> Create Collaboration
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinCreateCollab;