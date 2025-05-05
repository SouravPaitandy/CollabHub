import { redirect, notFound } from 'next/navigation'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Dashboard from '@/components/dashboard/Dashboard'
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
// import { NextResponse } from "next/server";

export default async function UserDashboard({ params }) {
    // Ensure params is properly resolved
      const {username} = await params;
    
    // Check if the username exists in your database FIRST before any session checks
    if(!username) {
      console.log("No username provided in URL params")
      notFound()
    }
    
    // const userExists = await checkIfUserExists(username)
    // if (!userExists) {
    //   // If username doesn't exist in the database, trigger not-found page
    //   console.log("Username does not exist in database:", username)
    //   notFound()
    // }

    // After confirming username exists, proceed with session checks
    const session = await getServerSession(authOptions)
    console.log("UserDashboard - Session:", session)
    
    if (!session) {
      redirect('/auth')
    }
    
    // The username is directly on the session object, not in session.user
    if (!session.username) {
      return <p>Please complete your profile first to view this page.</p>
    }

    if (session.username !== username) {
      console.log("Username mismatch", session.username, username)
      return <p>You don&apos;t have permission to view this page.</p>
    }
    
    return <Dashboard username={username} />
}

// Function to check if username exists in your database
// async function checkIfUserExists(username) {
//   try {
//     await dbConnect();
//     const userData = await User.findOne({username: username})
//     return !!userData // Returns true if user exists, false otherwise
//   } catch (error) {
//     console.error("Error checking if user exists:", error)
//     return false
//   }
// }