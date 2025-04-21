"use client"
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
// import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { FaUsers, FaPlusCircle } from 'react-icons/fa';
import { useTheme } from 'next-themes';

const JoinCreateCollab = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [collabName, setCollabName] = useState('');
  const [error, setError] = useState('');
  // const { isSignedIn, user } = useUser()
  const { data: session, status } = useSession();
  const router = useRouter();
  const {theme} = useTheme();

  const handleJoinCollab = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/collab/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode }),
      });
      if (response.ok) {
        const data = await response.json();
        router.push(`/chat/${data.collabId}`);
      } else {
        setError('Invalid invite code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleCreateCollab = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/collab/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: collabName }),
      });
      if (response.ok) {
        const data = await response.json();
        router.push(`/collab/admin/${data.collabId}`);
      } else {
        setError('Failed to create collab. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white text-xl">Please sign in to join or create a collab.</p>
      </div>
    );
  }

  return (
    <div>
     <div className="fixed -z-10 h-full w-full top-0 left-0">
      {theme === 'dark' ? <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        : <div class="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      } 
    </div>
    <div className="min-h-screen text-gray-900 dark:text-white p-6">
      <div className="max-w-4xl mx-auto mt-20">
        <h1 className="text-5xl font-bold text-center mb-12 text-blue-600 dark:text-blue-400">Collaborate & Create</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#fffff0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <FaUsers className="text-4xl text-blue-600 dark:text-blue-400 mr-4" />
              <h2 className="text-3xl font-semibold">Join a Collab</h2>
            </div>
            <form onSubmit={handleJoinCollab} className="space-y-4">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invite code"
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Join Collab
              </button>
            </form>
          </div>

          <div className="bg-[#fffff0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <FaPlusCircle className="text-4xl text-green-600 dark:text-green-400 mr-4" />
              <h2 className="text-3xl font-semibold">Create a Collab</h2>
            </div>
            <form onSubmit={handleCreateCollab} className="space-y-4">
              <input
                type="text"
                value={collabName}
                onChange={(e) => setCollabName(e.target.value)}
                placeholder="Enter collab name"
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />
              <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors duration-200">
                Create Collab
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default JoinCreateCollab;