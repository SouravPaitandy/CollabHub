import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Collab from '@/models/Collab';
import CollabParticipant from '@/models/CollabParticipant';
// import { currentUser } from "@clerk/nextjs/server";

export async function GET(request, { params }) {
  try {
    // Check authentication
    // const userSession = await currentUser();
    const userSession = await getServerSession(authOptions);
    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const user = await User.findOne({email: userSession?.user?.email})
    // Connect to the database
    await dbConnect();

    // Fetch the Collab
    const collab = await Collab.findById(id);
    // console.log("collab: ",collab)

    if (!collab) {
      return NextResponse.json({ error:'Collab not found' }, { status: 404 });
    }

    // Check if the user is a participant or admin of the Collab
    const participant = await CollabParticipant.findOne({
      collabId: id,
      userId: user.id,
      role: { $in: ['ADMIN', 'MEMBER'] }
    });

    if (!participant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Return the Collab data
    return NextResponse.json({
      _id: collab._id,
      name: collab.name,
      inviteCode: collab.inviteCode,
      createdAt: collab.createdAt,
      userRole: participant.role
      // Add other relevant fields here
    });

  } catch (error) {
    console.error('Error fetching Collab:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const userSession = await getServerSession();
    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const user = await User.findOne({email: userSession?.user?.email})
    
    // Connect to the database
    await dbConnect();

    // Check if the user is an admin of the Collab
    const participant = await CollabParticipant.findOne({
      collabId: id,
      userId: user.id,
      role: 'ADMIN'
    });

    if (!participant) {
      return NextResponse.json({ error: 'Unauthorized. Only admins can delete the collaboration.' }, { status: 403 });
    }

    // Delete the Collab
    const deletedCollab = await Collab.findByIdAndDelete(id);

    if (!deletedCollab) {
      return NextResponse.json({ error: 'Collab not found' }, { status: 404 });
    }

    // Delete all associated CollabParticipants
    await CollabParticipant.deleteMany({ collabId: id });

    // You might want to delete other associated data here as well (e.g., messages, tasks, etc.)

    return NextResponse.json({ message: 'Collaboration deleted successfully' });

  } catch (error) {
    console.error('Error deleting Collab:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}