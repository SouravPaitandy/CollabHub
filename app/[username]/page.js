import { redirect, notFound } from 'next/navigation'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Dashboard from '@/components/dashboard/Dashboard'
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export default async function UserDashboard({ params }) {
  try {
    // Ensure params is properly resolved
    const { username } = await params;
    
    // Check if the username exists in your database FIRST before any session checks
    if (!username) {
      console.log("No username provided in URL params")
      return notFound()
    }
    
    // Get session safely
    const session = await getServerSession(authOptions)
    console.log("UserDashboard - Session:", session)
    
    // If no session (user is logged out), pass the session state to the Dashboard
    // rather than redirecting, so it can show the demo mode
    if (!session || !session.user) {
      console.log("No active session, showing demo dashboard")
      return <Dashboard username={username} isSessionExpired={true} />
    }

    // Check if username is in the session - redirect to profile completion if needed
    if (!session.username) {
      return redirect('/auth')
    }

    // Check if the logged-in user matches the requested profile
    if (session.username !== username) {
      console.log("Username mismatch", session.username, username)
      // Instead of showing a simple error message, we could:
      // 1. Show their own dashboard instead
      return redirect(`/${session.username}`)
      // Or 2. Show a proper error page
      // return (
      //   <div className="flex flex-col items-center justify-center min-h-screen">
      //     <div className="p-8 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      //       <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">
      //         Access Restricted
      //       </h1>
      //       <p className="text-gray-700 dark:text-gray-300 mb-6">
      //         You don't have permission to view this profile. Redirecting to your dashboard...
      //       </p>
      //     </div>
      //   </div>
      // )
    }
    
    // User is authenticated and authorized to view the dashboard
    return <Dashboard username={username} />
  } catch (error) {
    // Log the specific error for debugging
    console.error("Specific error in UserDashboard:", error.name, error.message)
    
    // For NEXT_REDIRECT errors, we can just show demo mode instead of redirecting
    if (error.message && error.message.includes('NEXT_REDIRECT')) {
      return <Dashboard username={username} isSessionExpired={true} />
    }
    
    // For other types of errors, return an error component
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="p-8 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We encountered an error while loading your dashboard. Please try again later.
          </p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a 
            href="/auth" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Login
          </a>
        </div>
      </div>
    )
  }
}