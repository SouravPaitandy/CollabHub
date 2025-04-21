"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "./Loading";
import { motion } from "framer-motion";
import GitHubRepos from "./GithubRepos.js";

const Dashboard = ({ username }) => {
  const { data: session } = useSession();
  const [adminCollabs, setAdminCollabs] = useState([]);
  const [memberCollabs, setMemberCollabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const router = useRouter();

  if (!session) {
    router.push("/auth");
  }

  useEffect(() => {
    const fetchCollabs = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/user/collabs");
          if (!response.ok) {
            throw new Error("Failed to fetch collaborations");
          }
          const data = await response.json();
          console.log("Collabs data: ", data);
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

  if (isLoading) return <Loader />;
  if (error)
    return <div className="h-screen text-center pt-80">Error: {error}</div>;

  const stats = [
    { label: "Projects", value: 12, icon: "📁" },
    { label: "Tasks", value: 34, icon: "✅" },
    { label: "Completed", value: 78, icon: "🏆" },
  ];

  // Add this function to your Dashboard component
  const createCollabFromRepo = async (repo) => {
    try {
      // Show loading state
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

      // Show success message
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

  return (
    <div>
      {/* Background */}
      <div className="fixed -z-10 h-full w-full top-0 left-0">
        {theme === "dark" ? (
          <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        ) : (
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen text-gray-800 dark:text-white">
        <div className="max-w-7xl mx-auto p-6 py-20">
          {/* Header */}
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
                <Link
                  href="/collab/join-create"
                  className="px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-blue-500 dark:to-indigo-600 dark:hover:from-blue-600 dark:hover:to-indigo-700 shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  Get Started 🚀
                </Link>
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
              <img
                src={session?.user?.image}
                alt="Profile"
                className="w-24 h-24 rounded-full mr-6 border-4 border-indigo-500 shadow-lg"
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
              className="mb-8 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    viewBox="0 0 16 16"
                    className="w-8 h-8 mr-3 text-gray-700 dark:text-gray-300"
                    fill="currentColor"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                  <div>
                    <h4 className="font-medium">GitHub Integration</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Connected as @{session.username || "user"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Active
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Import repositories with one click
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg p-6 text-center transition-all transform hover:scale-105 bg-[#fffff0] dark:bg-gray-800 shadow-md dark:shadow-lg"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </h3>
                <p className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">
                  {stat.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Collaborations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-lg p-8 bg-[#fffff0] dark:bg-gray-800 shadow-md dark:shadow-lg"
          >
            <h1 className="text-4xl font-semibold mb-6 text-indigo-600 dark:text-indigo-300">
              Recent Activities
            </h1>

            {/* Admin Collaborations */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Your Administered Collaborations
              </h2>
              {adminCollabs.length > 0 ? (
                <ul className="space-y-2">
                  {adminCollabs.map((collab) => (
                    <li
                      key={collab.collabId}
                      className="p-3 rounded-md transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <Link
                        href={`/collab/admin/${collab.collabId}`}
                        className="flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                      >
                        <span className="mr-2">🔧</span> {collab.collabName}{" "}
                        (Admin Panel)
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  You are not administering any collaborations.
                </p>
              )}
            </section>

            {/* Member Collaborations */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Your Joined Collaborations
              </h2>
              {memberCollabs.length > 0 ? (
                <ul className="space-y-2">
                  {memberCollabs.map((collab) => (
                    <li
                      key={collab.collabId}
                      className="p-3 rounded-md transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <Link
                        href={`/chat/${collab.collabId}`}
                        className="flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                      >
                        <span className="mr-2">💬</span> {collab.collabName}{" "}
                        (Chat Room)
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  You have not joined any collaborations.
                </p>
              )}
            </section>
          </motion.div>

          {/* Repository Activity - Only show if using GitHub */}
          {session?.provider === "github" && (
            <motion.div
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
                  Convert any of your GitHub repositories into collaborations!
                  This will create a new collaboration space where you can:
                </p>
                <ul className="list-disc list-inside mt-2 text-blue-700 dark:text-blue-300">
                  <li>
                    Invite team members using your collaboration&apos;s invite
                    code
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
                      Convert any GitHub repository into a collaboration with
                      one click
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
                      Invite teammates to collaborate using a simple invite code
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* GitHub Repositories Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
              GitHub Repositories
            </h2>
            <GitHubRepos onCreateCollab={createCollabFromRepo} />
          </motion.div>
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
