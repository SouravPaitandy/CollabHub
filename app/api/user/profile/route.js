import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select(
      "-password",
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      bio: user.bio,
      skills: user.skills,
      location: user.location,
      website: user.website,
      socials: user.socials,
      accounts: user.accounts,
      joinedDate: user.createdAt,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update fields
    if (data.bio !== undefined) user.bio = data.bio;
    if (data.location !== undefined) user.location = data.location;
    if (data.website !== undefined) user.website = data.website;
    if (data.skills !== undefined) user.skills = data.skills; // Expecting array
    if (data.socials !== undefined) {
      user.socials = { ...user.socials, ...data.socials };
    }

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
