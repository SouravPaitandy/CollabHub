import HomePage from '@/components/HomePage';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { auth, currentUser } from '@clerk/nextjs/server' 

export default async function Home() {
  // const session = await getServerSession(authOptions);
  // return <HomePage session={session} />;
  return <HomePage/>
}