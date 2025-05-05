"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "../Loading";
import { motion } from "framer-motion";
import { ArrowBigDown } from "lucide-react";
import DashboardStats from "./DashboardStats";
import DashboardCollabs from "./DashboardCollabs";
import Image from "next/image";

// Lazy load the GitHub repos component
const GitHubRepos = lazy(() => import("./GithubRepos.js"));

const Dashboard = ({ username }) => {
  const { data: session } = useSession();
  const [adminCollabs, setAdminCollabs] = useState([]);
  const [memberCollabs, setMemberCollabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGithubRepos, setShowGithubRepos] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const [taskStats, setTaskStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    highPriorityTasks: 0,
    tasksDueSoon: 0,
  });

  const { theme } = useTheme();
  const router = useRouter();

  const githubRepoRef = useRef(null);

  if (!session) {
    router.push("/auth");
  }

  // Load core data first (collaborations)
  useEffect(() => {
    const fetchCollabs = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/user/collabs");
          if (!response.ok) {
            throw new Error("Failed to fetch collaborations");
          }
          const data = await response.json();
          setAdminCollabs(data.filter((collab) => collab.role === "ADMIN"));
          setMemberCollabs(data.filter((collab) => collab.role === "MEMBER"));
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCollabs();
  }, [session]);

  // Load non-critical stats data.
  useEffect(() => {
    const fetchStats = async () => {
      if (session?.user?.email && !isLoading) {
        try {
          const statsResponse = await fetch("/api/user/task-stats");
          if (!statsResponse.ok) {
            throw new Error("Failed to fetch task statistics");
          }
          const statsData = await statsResponse.json();
          setTaskStats(statsData);
        } catch (err) {
          console.error("Error loading stats:", err.message);
        } finally {
          setIsStatsLoading(false);
        }
      }
    };

    fetchStats();
  }, [session, isLoading]);

  const createCollabFromRepo = async (repo) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/collab/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: repo.name,
          description: repo.description || `Collaboration for ${repo.name}`,
          githubRepoId: repo.id,
          githubRepoUrl: repo.html_url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create collaboration");
      }

      const data = await response.json();

      // Refresh the collaborations list
      const collabsResponse = await fetch("/api/user/collabs");
      if (collabsResponse.ok) {
        const collabsData = await collabsResponse.json();
        setAdminCollabs(
          collabsData.filter((collab) => collab.role === "ADMIN")
        );
        setMemberCollabs(
          collabsData.filter((collab) => collab.role === "MEMBER")
        );
      }

      alert(
        `Collaboration created for ${repo.name}! Invite code: ${data.inviteCode}`
      );
    } catch (err) {
      console.error("Error creating collaboration:", err);
      alert("Failed to create collaboration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowGithubRepos = () => {
    setShowGithubRepos(true);
    setTimeout(() => {
      githubRepoRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (isLoading) return <Loader />;
  if (error)
    return <div className="h-screen text-center pt-80">Error: {error}</div>;

  const stats = [
    { label: "Projects", value: taskStats.totalProjects, icon: "📁" },
    { label: "Tasks", value: taskStats.totalTasks, icon: "✅" },
    { label: "Completed", value: taskStats.completedTasks, icon: "🏆" },
    { label: "High Priority", value: taskStats.highPriorityTasks, icon: "⚠️" },
    { label: "Due Soon", value: taskStats.tasksDueSoon, icon: "⏰" },
    {
      label: "Collaborations",
      value: adminCollabs.length + memberCollabs.length,
      icon: "🤝",
    },
  ];

  return (
    <div>
      {/* Background */}
      <div className="fixed -z-10 h-full w-full top-0 left-0">
        {theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
          <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        ) : (
          <>
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen text-gray-800 dark:text-white">
        <div className="max-w-7xl mx-auto p-6 py-20">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl font-extrabold pb-4 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 animate-gradient">
              Welcome, {username} 👋
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Ready to collaborate and achieve your goals? Let&apos;s make today
              productive and impactful!
            </p>
            <div className="mt-6 flex justify-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const confirmed = confirm(
                      "Would you like to create a collaboration manually? Click 'OK' to proceed or 'Cancel' to use GitHub repository integration instead."
                    );
                    if (confirmed) {
                      router.push("/collab/join-create");
                    } else if (session?.provider === "github") {
                      handleShowGithubRepos();
                    }
                  }}
                  className="px-8 py-3 cursor-pointer rounded-full text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-blue-500 dark:to-indigo-600 dark:hover:from-blue-600 dark:hover:to-indigo-700 shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  Get Started 🚀
                </button>
              </motion.div>
            </div>
          </motion.header>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-between mb-12"
          >
            <div className="flex items-center mb-6 md:mb-0">
              <Image
                src={session?.user?.image || "/default-avatar.png"}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full mr-6 border-4 border-indigo-500 shadow-lg"
                priority
              />
              <div>
                <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
                  {session?.user?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <Link
              href="/collab/join-create"
              className="px-6 py-3 rounded-full text-white font-semibold transition-all transform hover:scale-105 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg"
            >
              Create or Join a new Collab
            </Link>
          </motion.div>

          {/* GitHub Integration Status - Only show if using GitHub */}
          {session?.provider === "github" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-8 rounded-2xl bg-gradient-to-br from-white/90 to-gray-50/95 dark:from-gray-800/90 dark:to-gray-900/80 shadow-xl dark:shadow-2xl border border-gray-100/80 dark:border-gray-700/40 overflow-hidden"
            >
              <div className="p-6 relative">
                {/* Background decoration */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-green-100/30 to-blue-100/20 dark:from-green-900/20 dark:to-blue-900/10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-transparent via-green-100/30 dark:via-green-900/20 to-transparent blur-xl -z-10 opacity-70"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-md mr-4">
                      <svg
                        viewBox="0 0 16 16"
                        className="w-8 h-8 text-gray-800 dark:text-gray-200"
                        fill="currentColor"
                      >
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                      </svg>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        GitHub Integration
                      </h4>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Connected as{" "}
                          <span className="font-medium text-green-600 dark:text-green-400">
                            @{session.username || "user"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800/50">
                      <span className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Integration Active
                      </span>
                    </div>

                    <button
                      onClick={handleShowGithubRepos}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 dark:from-indigo-600 dark:to-blue-600 dark:hover:from-indigo-700 dark:hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:translate-y-[-2px]"
                    >
                      <span className="font-medium">Import Repositories</span>
                      <ArrowBigDown className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Feature highlight */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start px-4 py-3 bg-gray-50/70 dark:bg-gray-800/40 rounded-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-md text-blue-700 dark:text-blue-300 mr-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        One-Click Import
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Convert any repo to a collaboration with a click
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start px-4 py-3 bg-gray-50/70 dark:bg-gray-800/40 rounded-lg">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-md text-purple-700 dark:text-purple-300 mr-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Team Collaboration
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Invite teammates with a simple code
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start px-4 py-3 bg-gray-50/70 dark:bg-gray-800/40 rounded-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-md text-green-700 dark:text-green-300 mr-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Task Management
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Organize tasks for your GitHub projects
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Section */}
          <DashboardStats
            stats={stats}
            isStatsLoading={isStatsLoading}
            taskStats={taskStats}
          />

          {/* Collaborations Section */}
          <DashboardCollabs
            adminCollabs={adminCollabs}
            memberCollabs={memberCollabs}
          />

          {/* Repository Activity - Only show if using GitHub and explicitly requested */}
          {session?.provider === "github" &&
            (showGithubRepos || adminCollabs.length === 0) && (
              <>
                <motion.div
                  ref={githubRepoRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mt-8 rounded-lg p-6 bg-[#fffff0] dark:bg-gray-800 shadow-md dark:shadow-lg"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                    Repository Integration
                  </h2>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 dark:text-blue-200">
                      Convert any of your GitHub repositories into
                      collaborations! This will create a new collaboration space
                      where you can:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-blue-700 dark:text-blue-300">
                      <li>
                        Invite team members using your collaboration&apos;s
                        invite code
                      </li>
                      <li>Manage project tasks and discussions</li>
                      <li>Keep track of project progress</li>
                      <li>Chat with your collaborators</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="mr-4 text-indigo-500 dark:text-indigo-400 text-3xl">
                        🔗
                      </div>
                      <div>
                        <h3 className="font-medium text-indigo-700 dark:text-indigo-300">
                          Link Repositories
                        </h3>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400">
                          Convert any GitHub repository into a collaboration
                          with one click
                        </p>
                      </div>
                    </div>

                    <div className="flex p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="mr-4 text-green-500 dark:text-green-400 text-3xl">
                        👥
                      </div>
                      <div>
                        <h3 className="font-medium text-green-700 dark:text-green-300">
                          Team Collaboration
                        </h3>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Invite teammates to collaborate using a simple invite
                          code
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* GitHub Repositories Section - Lazy loaded */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-12"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                    GitHub Repositories
                  </h2>
                  <Suspense
                    fallback={
                      <div className="p-8 text-center">
                        Loading GitHub repositories...
                      </div>
                    }
                  >
                    <GitHubRepos onCreateCollab={createCollabFromRepo} />
                  </Suspense>
                </motion.div>
              </>
            )}

          {/* Show GitHub repos button if not already showing */}
          {session?.provider === "github" &&
            !showGithubRepos &&
            adminCollabs.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleShowGithubRepos}
                  className="px-6 py-3 cursor-pointer rounded-full text-white font-medium bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all"
                >
                  Show GitHub Repositories
                </button>
              </div>
            )}
        </div>
      </div>

      {/* Footer */}
      <hr className="my-8 border-t dark:border-indigo-300 opacity-20" />
      <footer className="py-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} CollabHub. All rights reserved.
        </p>
        <p className="text-5xl font-extrabold mt-2 opacity-40">
          <span className="text-indigo-600 dark:text-indigo-300">✨</span>
          <span className="text-gray-600 dark:text-gray-400">
            Made with ❤️ by the CollabHub Team
          </span>
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
