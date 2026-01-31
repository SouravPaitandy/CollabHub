// filepath: c:\Users\soura\OneDrive\Desktop\CollabHub Project\collabhub\app\api\collab\[id]\chat\route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Message from "@/models/Message";
import CollabParticipant from "@/models/CollabParticipant";
import User from "@/models/User";

// GET: Fetch all messages for a collaboration
export async function GET(request, { params }) {
  const { id } = await params;
  const collabId = id;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    // Find the user's document to get their ID
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is a participant using their user ID
    const participant = await CollabParticipant.findOne({
      collabId,
      userId: user._id,
    });
    if (!participant) {
      return NextResponse.json(
        { error: "Access Denied. You are not a member of this collaboration." },
        { status: 403 }
      );
    }

    const messages = await Message.find({ collabId })
      .sort({ timestamp: 1 })
      .limit(100);
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Save a new message
export async function POST(request, { params }) {
  const { id } = await params;
  const collabId = id;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // --- FIX: Correctly parse mentions and find user IDs ---
    const mentionRegex = /@([\w\s]+)/g;
    const mentionedUsernames = [...content.matchAll(mentionRegex)]
      .map((match) => match[1].trim())
      .filter(Boolean);

    let mentionedUserIds = [];
    if (mentionedUsernames.length > 0) {
      const mentionedUsers = await User.find({
        name: { $in: mentionedUsernames },
      });
      mentionedUserIds = mentionedUsers.map((user) => user._id);
    }

    // Create and save the new message
    const newMessage = new Message({
      collabId,
      content,
      sender: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      mentions: mentionedUserIds, // Save the array of ObjectIds
    });

    await newMessage.save();

    // --- FIX: Populate the mentions field before sending the response ---
    // This step is critical. It replaces the array of IDs with an array of user objects.
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("mentions", "name email image _id"); // Populate with necessary fields

    // This is the object that will be sent back to Chat.js and then emitted via socket
    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
