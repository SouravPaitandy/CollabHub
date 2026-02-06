"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loading";

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
    <div className="flex items-center justify-center min-w-screen min-h-screen bg-black">
      <Loader message="Redirecting to Workspace..." />
    </div>
  );
}
