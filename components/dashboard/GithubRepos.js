import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "../ui/SpotlightCard";

const GitHubRepos = ({ onCreateCollab }) => {
  const { data: session, status } = useSession();
  const [githubData, setGithubData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [hoveredRepo, setHoveredRepo] = useState(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      if (status === "loading") return;

      if (!session) {
        setIsLoading(false);
        return;
      }

      if (!session.connectedAccounts.includes("github")) {
        setError("Please sign in with GitHub to access repositories");
        setIsLoading(false);
        return;
      }

      try {
        console.log(
          "Fetching GitHub repos with session connectedAccounts:",
          session.connectedAccounts,
        );
        const response = await fetch("/api/user/repos");

        if (!response.ok) {
          const errorData = await response.json();
          console.error("GitHub API error:", errorData);
          throw new Error(errorData.error || `Error ${response.status}`);
        }

        const data = await response.json();
        console.log("GitHub data received");
        setGithubData(data);
      } catch (err) {
        console.error("Failed to fetch GitHub data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubData();
  }, [session, status]);

  // Loading animation
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <motion.div
          className="w-16 h-16 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 border-4 border-indigo-200 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 border-t-4 border-indigo-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </motion.div>
      </div>
    );
  }

  // Sign in with GitHub
  if (!session) {
    return (
      <motion.div
        className="bg-card border border-border rounded-2xl p-8 text-center shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h3
          className="text-2xl font-bold mb-6 aura-text-glow"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          GitHub Repositories
        </motion.h3>
        <motion.p
          className="mb-6 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Connect with GitHub to view your repositories and start collaborating
        </motion.p>
        <motion.button
          onClick={() => signIn("github")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Sign In with GitHub
          </div>
        </motion.button>
      </motion.div>
    );
  }

  // GitHub connection required
  if (!session.connectedAccounts.includes("github")) {
    return (
      <motion.div
        className="bg-card border border-border rounded-2xl p-8 text-center shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h3
          className="text-2xl font-bold mb-6 aura-text-glow"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          GitHub Connection Required
        </motion.h3>
        <motion.p
          className="mb-6 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You&apos;re signed in, but not with GitHub. Please connect your GitHub
          account to continue.
        </motion.p>
        <motion.button
          onClick={() => signIn("github")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Connect GitHub Account
        </motion.button>
      </motion.div>
    );
  }

  // Handle errors
  if (error) {
    return (
      <motion.div
        className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-8 text-center shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.h3
          className="text-2xl font-bold mb-6 text-red-600 dark:text-red-400"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          Error Loading Repositories
        </motion.h3>
        <motion.p
          className="text-red-500 dark:text-red-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {error}
        </motion.p>
        <motion.button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  // Handle no data yet
  if (!githubData) {
    return (
      <motion.div
        className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-2xl p-8 text-center shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.h3
          className="text-2xl font-bold mb-6 text-yellow-600 dark:text-yellow-400"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          Loading Repositories
        </motion.h3>
        <motion.p
          className="text-yellow-600 dark:text-yellow-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Please wait while we fetch your GitHub data...
        </motion.p>
        <motion.div
          className="mt-4 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="dot-flashing"></div>
        </motion.div>
      </motion.div>
    );
  }

  // Render GitHub data
  const { profile, repos } = githubData;

  return (
    <motion.div
      className="bg-card dark:bg-card/50 backdrop-blur rounded-2xl shadow-xl border border-border p-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* GitHub Profile Stats */}
      <motion.div
        className="mb-10 border-b border-border pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-1">
            <p className="text-muted-foreground mb-6">
              {profile.bio || "No bio available"}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Stat
                  icon="📦"
                  label="Repositories"
                  value={profile.totalRepos}
                />
              </motion.div>
              <motion.div
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Stat icon="⭐" label="Stars" value={profile.totalStars} />
              </motion.div>
              <motion.div
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Stat icon="👥" label="Followers" value={profile.followers} />
              </motion.div>
              <motion.div
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Stat icon="🔄" label="Forks" value={profile.totalForks} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Repository List */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h3
            className="text-2xl font-bold text-foreground aura-text-glow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Your Repositories
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground flex items-center"
          >
            <span className="hidden sm:inline mr-2">Showing</span>
            {Math.min(repos.length, 8)}{" "}
            <span className="hidden sm:inline ml-2 mr-2">of </span>{" "}
            {repos.length}{" "}
            <span className="hidden sm:inline ml-2">repositories</span>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar max-h-[550px] p-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <AnimatePresence>
            {repos.slice(0, 8).map((repo, index) => (
              <motion.div
                key={repo.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 50 },
                  },
                }}
                className="h-full"
              >
                <SpotlightCard
                  className={`h-full bg-white/80 dark:bg-black/40 backdrop-blur-2xl border-white/50 dark:border-white/10`}
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {repo.name}
                      </h4>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <motion.span
                          className="flex items-center"
                          whileHover={{ scale: 1.1, color: "#FBBF24" }}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
                          </svg>
                          {repo.stargazers_count}
                        </motion.span>
                        <motion.span
                          className="flex items-center"
                          whileHover={{ scale: 1.1, color: "#60A5FA" }}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0z" />
                          </svg>
                          {repo.forks_count}
                        </motion.span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 min-h-[40px]">
                      {repo.description || "No description available"}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {repo.language && (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLanguageColorClass(
                            repo.language,
                          )} bg-card border border-border`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1.5 ${getLanguageBackgroundClass(
                              repo.language,
                            )}`}
                          ></div>
                          {repo.language}
                        </span>
                      )}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-auto pt-4 relative z-20">
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          const confirmed = confirm(
                            "Are you sure you want to create a collaboration with this GitHub repo?",
                          );
                          if (confirmed) {
                            onCreateCollab(repo);
                          }
                        }}
                        className="w-full text-sm font-medium px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-all flex items-center justify-center pointer-events-auto"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Create Collaboration
                      </motion.button>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3 bg-blue-100 dark:bg-blue-800/30 p-2 rounded-full text-blue-500 dark:text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
              Limited Repository Display
            </h4>
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              Currently displaying your 8 most recently updated repositories. If
              you don&apos;t see a specific repository, update it on GitHub to
              make it appear in this list.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>

      {/* Import Repo Modal */}
      <>
        <AnimatePresence>
          {selectedRepo && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <h3 className="text-2xl font-bold mb-4 aura-text-glow">
                  Import Repository
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Import{" "}
                  <span className="font-semibold text-primary">
                    {selectedRepo.name}
                  </span>{" "}
                  to Coordly?
                </p>
                <div className="flex justify-end gap-3">
                  <motion.button
                    onClick={() => setSelectedRepo(null)}
                    className="px-5 py-2 border border-border rounded-full text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      alert(
                        `Repository ${selectedRepo.name} imported successfully!`,
                      );
                      setSelectedRepo(null);
                    }}
                    className="px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-md transition-all"
                  >
                    Import
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </motion.div>
  );
};

// Enhanced Stat component
const Stat = ({ icon, label, value }) => (
  <SpotlightCard className="text-center p-3 bg-card border border-border rounded-xl">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
      {value}
    </div>
    <div className="text-xs text-muted-foreground mt-1">{label}</div>
  </SpotlightCard>
);

// Helper functions remain the same
const getLanguageColorClass = (language) => {
  const colorMap = {
    JavaScript: "text-yellow-400",
    TypeScript: "text-blue-400",
    Python: "text-green-400",
    Java: "text-orange-500",
    HTML: "text-red-500",
    CSS: "text-pink-500",
    Ruby: "text-red-600",
    PHP: "text-purple-400",
    Go: "text-blue-300",
    Rust: "text-orange-600",
    C: "text-gray-500",
    "C++": "text-pink-600",
    "C#": "text-green-600",
  };

  return colorMap[language] || "text-gray-400";
};

const getLanguageBackgroundClass = (language) => {
  const bgMap = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-400",
    Python: "bg-green-400",
    Java: "bg-orange-500",
    HTML: "bg-red-500",
    CSS: "bg-pink-500",
    Ruby: "bg-red-600",
    PHP: "bg-purple-400",
    Go: "bg-blue-300",
    Rust: "bg-orange-600",
    C: "bg-gray-500",
    "C++": "bg-pink-600",
    "C#": "bg-green-600",
  };

  return bgMap[language] || "bg-gray-400";
};

export default GitHubRepos;
