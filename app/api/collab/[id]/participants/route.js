import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import CollabParticipant from '@/models/CollabParticipant';
import User from '@/models/User';
// import { currentUser } from "@clerk/nextjs/server";

export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    // const user = await currentUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    console.log("id: ", id)

    const userid = await User.findOne({email: session.user.email})
    console.log("userid", userid.id)

    // Connect to the database
    await dbConnect();

    // Check if the user is an admin of the collaboration
    const isAdmin = await CollabParticipant.findOne({
      collabId: id,
      userId: userid.id,
      role: 'ADMIN'
    });
    console.log("isAdmin",isAdmin)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch the participants 
    const participants = await CollabParticipant.find({ collabId: id })
      // .populate('user', 'name email')
      // .select('role user');
   
    // Return the participants data
    console.log("participants: ", participants)

    // First, fetch all necessary user data in a single query
    const userIds = participants.map(participant => participant.userId);
    const users = await User.find({ _id: { $in: userIds } }, 'name image');

    // Create a map for quick user lookup
    const userMap = new Map(users.map(user => [user._id.toString(), user]));

    // Now, prepare the response
    const participantsData = participants.map(participant => {
      const userData = userMap.get(participant.userId.toString());
      return {
        _id: participant._id,
        role: participant.role,
        collabId: participant.collabId,
        collabName: participant.collabName,
        user: userData ? {
          name: userData.name,
          image: userData.image
        } : null
      };
    });
    console.log(participantsData)
    return NextResponse.json({ participants: participantsData });

  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}