"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

const GitHubRepos = ({ onCreateCollab }) => {
  const { data: session, status } = useSession();
  const [githubData, setGithubData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      // Don't proceed until we know the session state
      if (status === "loading") {
        return;
      }
      
      // If not logged in, stop loading
      if (!session) {
        setIsLoading(false);
        return;
      }

      // Check if user is logged in with GitHub
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

  const handleImportRepo = async (repo) => {
    // Set the selected repo for the modal
    setSelectedRepo(repo);
    
    // Here you would implement logic to import the repo to your app
    // This could be another API call to your backend to store the repo details
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Handle not authenticated
  if (!session) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">GitHub Repositories</h3>
        <p className="mb-4">Sign in to view your GitHub repositories</p>
        <button
          onClick={() => signIn("github")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Sign In with GitHub
        </button>
      </div>
    );
  }

  // Handle GitHub-specific auth needed
  if (session.provider !== "github") {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">GitHub Connection Required</h3>
        <p className="mb-4">You&apos;re signed in, but not with GitHub. Please connect your GitHub account.</p>
        <button
          onClick={() => signIn("github")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Connect GitHub Account
        </button>
      </div>
    );
  }

  // Handle errors
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Error Loading Repositories</h3>
        <p className="text-red-500 dark:text-red-300 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Handle no data yet
  if (!githubData) {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-4">Loading Repositories</h3>
        <p className="text-yellow-500 dark:text-yellow-300">Please wait while we fetch your GitHub data...</p>
      </div>
    );
  }

  // Render GitHub data
  const { profile, repos } = githubData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
      {/* GitHub Profile Stats */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* <img 
            src={profile.avatar_url} 
            alt={profile.name || profile.login} 
            className="w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-900"
          /> */}
          
          <div className="flex-1">
            {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name || profile.login}</h2> */}
            {/* <p className="text-gray-600 dark:text-gray-400 mb-2">@{profile.login}</p> */}
            <p className="text-gray-700 dark:text-gray-300 mb-4">{profile.bio || "No bio available"}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat icon="📦" label="Repositories" value={profile.totalRepos} />
              <Stat icon="⭐" label="Stars" value={profile.totalStars} />
              <Stat icon="👥" label="Followers" value={profile.followers} />
              <Stat icon="🔄" label="Forks" value={profile.totalForks} />
            </div>
          </div>
        </div>
      </div>

      {/* Repository List */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Repositories</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.slice(0, 10).map((repo) => (
          <motion.div 
            key={repo.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-medium text-indigo-600 dark:text-indigo-400">{repo.name}</h4>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center mr-3">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/>
                  </svg>
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0z"/>
                  </svg>
                  {repo.forks_count}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 h-10">
              {repo.description || "No description available"}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs">
                {repo.language && (
                  <span className={`flex items-center mr-4 ${getLanguageColorClass(repo.language)}`}>
                    <div className={`w-3 h-3 rounded-full mr-1 ${getLanguageBackgroundClass(repo.language)}`}></div>
                    {repo.language}
                  </span>
                )}
                <span className="text-gray-500 dark:text-gray-500">Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
              </div>
              
              {/* Add button to create a collaboration from this repo */}
              <button
                onClick={() => onCreateCollab(repo)}
                className="text-xs px-3 py-1 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-md transition-colors"
              >
                Create Collab
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {repos.length > 10 && (
        <div className="mt-6 text-center">
          <Link 
            href="/github/repos"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
          >
            View All Repositories ({repos.length})
          </Link>
        </div>
      )}
      
      {/* Import Repo Modal */}
      {selectedRepo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Import Repository</h3>
            <p className="mb-4">
              Import <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedRepo.name}</span> to CollabHub?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setSelectedRepo(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Implement the actual import logic here
                  alert(`Repository ${selectedRepo.name} imported successfully!`);
                  setSelectedRepo(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for stats
const Stat = ({ icon, label, value }) => (
  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{value}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
  </div>
);

// Helper function to get a color class based on programming language
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

// Helper function to get a background color class
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