"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    // Read query parameters from URL
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get("join");
    const query = joinCode ? `?join=${joinCode}` : "";

    if (session?.user?.email) {
      // User is logged in, redirect to their username route with query
      const username = session.username || session.user.email.split("@")[0];
      window.location.href = `/${username}${query}`;
    } else {
      // User not logged in, redirect to auth with callback that includes query
      const callbackUrl = encodeURIComponent(`/dashboard${query}`);
      window.location.href = `/auth?callbackUrl=${callbackUrl}`;
    }
  }, [session, status]);

  // Show simple loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm text-muted-foreground">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}
