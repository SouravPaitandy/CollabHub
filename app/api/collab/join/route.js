import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Collab from "@/models/Collab";
import CollabParticipant from "@/models/CollabParticipant";
import User from "@/models/User";


export async function POST(req) {
  const userSession = await getServerSession(authOptions);
  if (!userSession) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await dbConnect();

  const body = await req.json();
  const { inviteCode } = body;

  const user = await User.findOne({ email: userSession.user.email });

  try {
    const collab = await Collab.findOne({ inviteCode });

    if (!collab) {
      return new Response(JSON.stringify({ message: 'Invalid invite code' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existingParticipant = await CollabParticipant.findOne({
      collabId: collab._id,
      userId: user._id
    });

    if (existingParticipant) {
      return new Response(JSON.stringify({ message: 'Already a participant', collabId: collab._id.toString() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await CollabParticipant.create({
      userId: user._id,
      collabId: collab._id,
      collabName: collab.name,
      role: 'MEMBER'
    });

    return new Response(JSON.stringify({ message: 'Successfully joined collab', collabId: collab._id.toString() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error joining collab:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}