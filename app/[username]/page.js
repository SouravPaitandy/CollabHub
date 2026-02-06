import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Dashboard from "@/components/dashboard/Dashboard";
import Loader from "@/components/Loading";

export default async function UserDashboard({ params, searchParams }) {
  // 1. Resolve params and search params
  const { username } = await params;
  const resolvedSearchParams = await searchParams;
  const joinCode = resolvedSearchParams?.join || null;

  // 2. Get session
  const session = await getServerSession(authOptions);
  console.log("Server  UserDashboard - Session:", session);

  // 3. Handle no username - redirect to auth
  if (!username) {
    return redirect("/auth");
  }

  // 4. Handle no session - show demo mode
  const isSessionExpired = !session || !session.user;

  if (isSessionExpired) {
    console.log("No active session, showing demo dashboard");
    return (
      <DashboardWrapper
        username={username}
        isSessionExpired={true}
        joinCode={joinCode}
      />
    );
  }

  // 5. Handle incomplete profile - redirect to auth
  if (!session.username) {
    return redirect("/auth");
  }

  // 6. Handle username mismatch - redirect to correct username
  if (session.username !== username) {
    console.log("Username mismatch:", session.username, "!=", username);
    const query = joinCode ? `?join=${joinCode}` : "";
    return redirect(`/${session.username}${query}`);
  }

  // 7. Render dashboard with session
  return (
    <DashboardWrapper
      username={username}
      isSessionExpired={false}
      joinCode={joinCode}
    />
  );
}

// Separate wrapper component to ensure consistent Suspense usage
function DashboardWrapper({ username, isSessionExpired, joinCode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Dashboard
        username={username}
        isSessionExpired={isSessionExpired}
        joinCode={joinCode}
      />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <Loader message="Loading Dashboard..." />
    </div>
  );
}
