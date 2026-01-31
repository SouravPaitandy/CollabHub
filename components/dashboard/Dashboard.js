"use client";
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Loader from "../Loading";
import { motion } from "framer-motion";
import { ArrowBigDown } from "lucide-react";
import DashboardStats from "./DashboardStats";
import DashboardCollabs from "./DashboardCollabs";
import Image from "next/image";
import SpotlightCard from "../ui/SpotlightCard";
import CreateJoinCollabModal from "./CreateJoinCollabModal";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import ErrorState from "../common/ErrorState";
import OfflineBanner from "../common/OfflineBanner";
import {
  DEMO_COLLABS_ADMIN,
  DEMO_COLLABS_MEMBER,
  DEMO_TASK_STATS,
} from "@/constants/demoData";

// Lazy load the GitHub repos component
const GitHubRepos = lazy(() => import("./GithubRepos.js"));

const SessionExpiredBanner = ({ onLogin }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-600 dark:text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between md:items-center">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
            Your session has expired or you&apos;ve been logged out. You&apos;re
            currently viewing in demo mode.
          </p>
          <div className="mt-3 md:mt-0 md:ml-6">
            <button
              onClick={onLogin}
              className="whitespace-nowrap px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-md hover:bg-red-200 dark:hover:bg-red-700 font-medium text-sm transition-colors"
            >
              Log in again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({
  username = "User",
  isSessionExpired = false,
  joinCode: initialJoinCode = null,
}) => {
  const { data: session } = useSession();
  const { isOnline } = useNetworkStatus(); // Network status detection

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("create");
  const [joinCode, setJoinCode] = useState(initialJoinCode || "");
  const [adminCollabs, setAdminCollabs] = useState([]);
  const [memberCollabs, setMemberCollabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false); // Track if showing demo data
  const [showGithubRepos, setShowGithubRepos] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(isSessionExpired);

  const [taskStats, setTaskStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    highPriorityTasks: 0,
    tasksDueSoon: 0,
  });

  const { theme } = useTheme();
  // REMOVED: const router = useRouter();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const githubRepoRef = useRef(null);

  // Handle join code from URL (passed as prop from server)
  useEffect(() => {
    if (initialJoinCode) {
      setJoinCode(initialJoinCode);
      setModalTab("join");
      setIsModalOpen(true);

      // Clean up URL without reload (only if we have a username)
      if (typeof window !== "undefined" && username) {
        window.history.replaceState({}, "", `/${username}`);
      }
    }
  }, [initialJoinCode, username]);

  /// Update session expired state if session changes to null after it was previously available
  useEffect(() => {
    // If server already determined session is expired, we don't need client checks
    if (isSessionExpired) return;

    // If initially loading, wait for session check to complete
    if (isLoading) return;

    // Check if session is missing (expired/logged out)
    if (!session) {
      console.log(
        "Dashboard: No active session detected, switching to demo mode",
      );
      setSessionExpired(true);

      // Set demo data for better UX
      setAdminCollabs([
        {
          id: "demo-1",
          name: "Demo Project",
          description:
            "This is a demo project shown because your session has expired",
          role: "ADMIN",
          createdAt: new Date().toISOString(),
        },
      ]);
      setMemberCollabs([]); // Reduced for brevity in demo

      setTaskStats({
        totalProjects: 1,
        totalTasks: 5,
        completedTasks: 2,
        highPriorityTasks: 1,
        tasksDueSoon: 1,
      });
    }
  }, [session, isLoading, isSessionExpired]);

  // Handle login button click with Callback URL
  const handleLogin = () => {
    if (typeof window !== "undefined") {
      const callbackUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth?callbackUrl=${callbackUrl}`;
    }
  };

  // Load core data first (collaborations)
  // Load core data only if we have a session
  useEffect(() => {
    const fetchCollabs = async () => {
      if (sessionExpired) {
        // In demo mode, load demo data
        setAdminCollabs(DEMO_COLLABS_ADMIN);
        setMemberCollabs([]);
        setIsDemo(true);
        setIsLoading(false);
        return;
      }
      if (session?.user?.email) {
        try {
          setError(null); // Clear previous errors
          const response = await fetch("/api/user/collabs");

          if (!response.ok) {
            throw new Error(
              `Server error (${response.status}): Failed to load collaborations`,
            );
          }

          const data = await response.json();
          setAdminCollabs(data.filter((collab) => collab.role === "ADMIN"));
          setMemberCollabs(data.filter((collab) => collab.role === "MEMBER"));
          setIsDemo(false);
        } catch (err) {
          console.error("Error fetching collabs:", err);

          // Check if it's a network error
          const isNetworkError =
            !navigator.onLine || err.message.includes("fetch");

          if (isNetworkError) {
            // Use demo data for network errors
            setAdminCollabs(DEMO_COLLABS_ADMIN);
            setMemberCollabs(DEMO_COLLABS_MEMBER);
            setIsDemo(true);
          } else {
            // For other errors, set error state
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchCollabs();
  }, [session, sessionExpired]);

  // Load non-critical stats data.
  useEffect(() => {
    const fetchStats = async () => {
      if (sessionExpired) {
        // In demo mode, just finish loading
        setIsLoading(false);
        setIsStatsLoading(false);
        return;
      }
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
      } else {
        // No session, just finish loading stats
        setIsStatsLoading(false);
      }
    };

    fetchStats();
  }, [session, isLoading, sessionExpired]);

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
          collabsData.filter((collab) => collab.role === "ADMIN"),
        );
        setMemberCollabs(
          collabsData.filter((collab) => collab.role === "MEMBER"),
        );
      }

      alert(
        `Collaboration created for ${repo.name}! Invite code: ${data.inviteCode}`,
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

  // Retry function for error states
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Trigger re-fetch by updating a dependency
    window.location.reload();
  };

  const switchToDemo = () => {
    setError(null);
    setAdminCollabs(DEMO_COLLABS_ADMIN);
    setMemberCollabs(DEMO_COLLABS_MEMBER);
    setTaskStats(DEMO_TASK_STATS);
    setIsDemo(true);
  };

  if (isLoading) return <Loader />;

  // Show error state with retry option
  if (error && !isSessionExpired && !isDemo) {
    return (
      <ErrorState
        icon="network"
        title="Unable to Load Dashboard"
        message={error}
        action={{
          label: "Retry",
          onClick: handleRetry,
        }}
        secondaryAction={{
          label: "View Demo Mode",
          onClick: switchToDemo,
        }}
      />
    );
  }

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

  // Determine display name
  const displayName = isSessionExpired
    ? "Demo User"
    : session?.username || username || "User";

  return (
    <div className="min-h-screen relative bg-background text-foreground overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px]" />
      </div>

      {/* Offline Banner */}
      <OfflineBanner isOnline={isOnline} onRetry={handleRetry} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Session Expired Banner */}
        {isSessionExpired && <SessionExpiredBanner onLogin={handleLogin} />}

        {/* Demo Mode Banner */}
        {isDemo && !isSessionExpired && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                  Viewing demo data - Unable to load real data
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <CreateJoinCollabModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialTab={modalTab}
            initialInviteCode={joinCode}
          />
          {/* === Main Content Column (Left) === */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2 aura-text-glow">
                  {isSessionExpired
                    ? "Dashboard Preview"
                    : `Welcome back, ${displayName.split(" ")[0]}`}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {isSessionExpired
                    ? "Log in to access your full workspace."
                    : "Here's what's happening with your projects today."}
                </p>
              </div>

              {/* Mobile Profile Toggle or similar could go here if needed, but we have sidebar */}
            </motion.div>

            {/* Stats Overview */}
            <DashboardStats
              stats={stats}
              isStatsLoading={isStatsLoading}
              taskStats={taskStats}
            />

            {/* Projects / Collaborations */}
            {session && (
              <DashboardCollabs
                adminCollabs={adminCollabs}
                memberCollabs={memberCollabs}
                username={displayName}
              />
            )}

            {/* GitHub Repositories (Lazy Loaded) */}
            {session?.connectedAccounts?.includes("github") &&
              (showGithubRepos || adminCollabs.length === 0) && (
                <motion.div
                  ref={githubRepoRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="pt-4"
                >
                  <h2 className="text-2xl font-bold mb-6 aura-text-glow">
                    Repositories
                  </h2>
                  <Suspense
                    fallback={
                      <div className="h-40 flex items-center justify-center text-muted-foreground">
                        Loading repositories...
                      </div>
                    }
                  >
                    <GitHubRepos onCreateCollab={createCollabFromRepo} />
                  </Suspense>
                </motion.div>
              )}

            {/* 4. Footer Info (Moved to Sidebar) */}
            <div className="pt-6 text-center text-xs text-muted-foreground/40">
              <p>© {new Date().getFullYear()} CollabHub</p>
              <p className="mt-1">Crafted for the community</p>
            </div>
          </div>

          {/* === Sidebar Column (Right) === */}
          <div className="fixed right-4 lg:col-span-4 xl:col-span-3 space-y-6">
            {/* 1. Profile Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SpotlightCard className="p-6 bg-card/60 backdrop-blur-md border-border/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <Image
                      src={session?.user?.image || "/default-pic.png"}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="rounded-full border-2 border-primary/20"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg truncate max-w-[150px]">
                      {displayName}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {session?.user?.email || "Pro Member"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href={session ? "/profile" : "/auth"}
                    className="block w-full py-2 px-4 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium text-center transition-colors"
                  >
                    View Profile
                  </Link>
                  {isSessionExpired && (
                    <button
                      onClick={handleLogin}
                      className="block w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium text-center hover:opacity-90 transition-opacity"
                    >
                      Log In
                    </button>
                  )}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* 2. Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SpotlightCard className="p-6 bg-card/60 backdrop-blur-md border-border/50">
                <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setModalTab("create");
                      setJoinCode("");
                      setIsModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all group text-left"
                  >
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md group-hover:scale-110 transition-transform">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-sm">New Project</div>
                      <div className="text-xs text-muted-foreground">
                        Start a fresh collaboration
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setModalTab("join");
                      setJoinCode("");
                      setIsModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all group text-left"
                  >
                    <div className="p-2 bg-purple-500/10 text-purple-500 rounded-md group-hover:scale-110 transition-transform">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Join Team</div>
                      <div className="text-xs text-muted-foreground">
                        Enter an invite code
                      </div>
                    </div>
                  </button>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* 3. Integrations / GitHub */}
            {!isSessionExpired && session && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <SpotlightCard className="p-6 bg-card/60 backdrop-blur-md border-border/50">
                  <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-4">
                    Integrations
                  </h3>

                  {session.connectedAccounts?.includes("github") ? (
                    // Connected State
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                            <svg
                              height="20"
                              viewBox="0 0 16 16"
                              width="20"
                              className="fill-current"
                            >
                              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                            </svg>
                          </div>
                          <span className="font-medium text-sm">GitHub</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      </div>

                      {!showGithubRepos && (
                        <button
                          onClick={handleShowGithubRepos}
                          className="w-full py-2 px-3 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors flex items-center justify-center gap-2"
                        >
                          Import Repositories{" "}
                          <ArrowBigDown className="w-3 h-3" />
                        </button>
                      )}
                    </>
                  ) : (
                    // Not Connected State
                    <div className="text-center">
                      <p className="text-sm max-w-[300px] text-wrap text-muted-foreground mb-4">
                        Connect GitHub to import repositories and create
                        collaborations instantly.
                      </p>
                      <button
                        onClick={() =>
                          import("next-auth/react").then(({ signIn }) =>
                            signIn("github"),
                          )
                        }
                        className="w-full py-2 px-3 bg-[#24292e] text-white hover:bg-[#2f363d] rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <svg
                          height="16"
                          viewBox="0 0 16 16"
                          width="16"
                          className="fill-current"
                        >
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                        Connect GitHub
                      </button>
                    </div>
                  )}
                </SpotlightCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
