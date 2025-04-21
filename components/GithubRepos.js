"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

      if (session.provider !== "github") {
        setError("Please sign in with GitHub to access repositories");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching GitHub repos with session provider:", session.provider);
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
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-center shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h3 
          className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          GitHub Repositories
        </motion.h3>
        <motion.p 
          className="mb-6 text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Connect with GitHub to view your repositories and start collaborating
        </motion.p>
        <motion.button
          onClick={() => signIn("github")}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign In with GitHub
          </div>
        </motion.button>
      </motion.div>
    );
  }

  // GitHub connection required
  if (session.provider !== "github") {
    return (
      <motion.div 
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-center shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h3 
          className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          GitHub Connection Required
        </motion.h3>
        <motion.p 
          className="mb-6 text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You&apos;re signed in, but not with GitHub. Please connect your GitHub account to continue.
        </motion.p>
        <motion.button
          onClick={() => signIn("github")}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
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
        className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/10 rounded-2xl p-8 text-center shadow-lg"
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
        className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-900/10 rounded-2xl p-8 text-center shadow-lg"
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
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* GitHub Profile Stats */}
      <motion.div 
        className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-1">
            <p className="text-gray-700 dark:text-gray-300 mb-6">{profile.bio || "No bio available"}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div whileHover={{ y: -5, scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                <Stat icon="📦" label="Repositories" value={profile.totalRepos} />
              </motion.div>
              <motion.div whileHover={{ y: -5, scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                <Stat icon="⭐" label="Stars" value={profile.totalStars} />
              </motion.div>
              <motion.div whileHover={{ y: -5, scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                <Stat icon="👥" label="Followers" value={profile.followers} />
              </motion.div>
              <motion.div whileHover={{ y: -5, scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                <Stat icon="🔄" label="Forks" value={profile.totalForks} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Repository List */}
      <motion.h3 
        className="text-2xl font-bold dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        Your Repositories
      </motion.h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {repos.slice(0, 8).map((repo, index) => (
            <motion.div 
              key={repo.id}
              className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 
                          border border-gray-200 dark:border-gray-700 rounded-xl p-5 
                          hover:border-indigo-300 dark:hover:border-indigo-700 transition-all
                          ${hoveredRepo === repo.id ? 'ring-2 ring-indigo-400 dark:ring-indigo-600' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index % 8) }}
              whileHover={{ 
                y: -8, 
                boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.15)",
                scale: 1.02
              }}
              onHoverStart={() => setHoveredRepo(repo.id)}
              onHoverEnd={() => setHoveredRepo(null)}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{repo.name}</h4>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <motion.span 
                    className="flex items-center mr-3"
                    whileHover={{ scale: 1.1, color: "#FBBF24" }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/>
                    </svg>
                    {repo.stargazers_count}
                  </motion.span>
                  <motion.span 
                    className="flex items-center"
                    whileHover={{ scale: 1.1, color: "#60A5FA" }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0z"/>
                    </svg>
                    {repo.forks_count}
                  </motion.span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                {repo.description || "No description available"}
              </p>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center text-xs">
                  {repo.language && (
                    <motion.span 
                      className={`flex items-center mr-4 ${getLanguageColorClass(repo.language)}`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className={`w-3 h-3 rounded-full mr-1 ${getLanguageBackgroundClass(repo.language)}`}></div>
                      {repo.language}
                    </motion.span>
                  )}
                  <span className="text-gray-500 dark:text-gray-500">
                    Updated {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
                
                <motion.button
                  onClick={() => onCreateCollab(repo)}
                  className="text-xs px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-sm hover:shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Collab
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <motion.div 
        className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start">
          <div className="mr-3 text-blue-500 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Limited Repository Display</h4>
            <p className="text-blue-600 dark:text-blue-400">
              Currently, we only display your 8 most recently updated repositories for quality purposes. 
              If you don&apos;t see a specific repository, please update it on GitHub to make it appear in this list.
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Import Repo Modal */}
      <AnimatePresence>
        {selectedRepo && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Import Repository</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Import <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedRepo.name}</span> to CollabHub?
              </p>
              <div className="flex justify-end gap-3">
                <motion.button 
                  onClick={() => setSelectedRepo(null)}
                  className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  onClick={() => {
                    alert(`Repository ${selectedRepo.name} imported successfully!`);
                    setSelectedRepo(null);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-md"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Import
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .dot-flashing {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #9f7aea;
          color: #9f7aea;
          animation: dot-flashing 1s infinite linear alternate;
          animation-delay: 0.5s;
        }
        .dot-flashing::before, .dot-flashing::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
        }
        .dot-flashing::before {
          left: -15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #9f7aea;
          color: #9f7aea;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing::after {
          left: 15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #9f7aea;
          color: #9f7aea;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 1s;
        }
        
        @keyframes dot-flashing {
          0% { background-color: #9f7aea; }
          50%, 100% { background-color: rgba(159, 122, 234, 0.2); }
        }
      `}</style>
    </motion.div>
  );
};

// Enhanced Stat component
const Stat = ({ icon, label, value }) => (
  <div className="text-center p-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">{value}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
  </div>
);

// Helper functions remain the same
const getLanguageColorClass = (language) => {
  const colorMap = {
    JavaScript: 'text-yellow-400',
    TypeScript: 'text-blue-400',
    Python: 'text-green-400',
    Java: 'text-orange-500',
    HTML: 'text-red-500',
    CSS: 'text-pink-500',
    Ruby: 'text-red-600',
    PHP: 'text-purple-400',
    Go: 'text-blue-300',
    Rust: 'text-orange-600',
    C: 'text-gray-500',
    'C++': 'text-pink-600',
    'C#': 'text-green-600',
  };
  
  return colorMap[language] || 'text-gray-400';
};

const getLanguageBackgroundClass = (language) => {
  const bgMap = {
    JavaScript: 'bg-yellow-400',
    TypeScript: 'bg-blue-400',
    Python: 'bg-green-400',
    Java: 'bg-orange-500',
    HTML: 'bg-red-500',
    CSS: 'bg-pink-500',
    Ruby: 'bg-red-600',
    PHP: 'bg-purple-400',
    Go: 'bg-blue-300',
    Rust: 'bg-orange-600',
    C: 'bg-gray-500',
    'C++': 'bg-pink-600',
    'C#': 'bg-green-600',
  };
  
  return bgMap[language] || 'bg-gray-400';
};

export default GitHubRepos;