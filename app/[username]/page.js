import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Dashboard from "@/components/dashboard/Dashboard";

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
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Loading Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Setting up your workspace...
          </p>
        </div>
      </div>
    </div>
  );
}
