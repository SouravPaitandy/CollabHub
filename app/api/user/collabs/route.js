import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import CollabParticipant from "@/models/CollabParticipant";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  console.log("Session: ", session)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const userData = await User.findOne({email: session.user.email})
  console.log("User Data", userData)
  const userId = userData._id
  console.log("User ID", userId)
  try {
    const collabs = await CollabParticipant.find(
      { userId: userId }
    );

    console.log("Collabs", collabs)

    if (!collabs) {
      return NextResponse.json({ message: 'Collabs not found' }, { status: 404 });
    }

    return NextResponse.json(collabs);
  } catch (error) {
    console.error('Error finding Collbs:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}