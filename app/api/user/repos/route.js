import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("GitHub Repos API - Session info:", {
      connectedAccounts: session.connectedAccounts,
      hasAccessToken: !!session.accessToken,
    });

    // Check if the user authenticated with GitHub
    if (!session.connectedAccounts.includes("github") || !session.accessToken) {
      return NextResponse.json(
        {
          error: "GitHub authentication required",
          authInfo: {
            connectedAccounts: session.connectedAccounts,
            hasToken: !!session.accessToken,
          },
        },
        { status: 403 },
      );
    }

    // Fetch GitHub user data
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error("GitHub user API error:", errorData);
      return NextResponse.json(
        {
          error: "Failed to fetch GitHub user data",
          github_error: errorData,
        },
        { status: userResponse.status },
      );
    }

    const userData = await userResponse.json();

    // Fetch user's repositories
    const reposResponse = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=10",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!reposResponse.ok) {
      const errorData = await reposResponse.json();
      console.error("GitHub repos API error:", errorData);
      return NextResponse.json(
        {
          error: "Failed to fetch GitHub repositories",
          github_error: errorData,
        },
        { status: reposResponse.status },
      );
    }

    const reposData = await reposResponse.json();

    // Calculate some stats
    const totalStars = reposData.reduce(
      (total, repo) => total + repo.stargazers_count,
      0,
    );
    const totalForks = reposData.reduce(
      (total, repo) => total + repo.forks_count,
      0,
    );

    // Return formatted data
    return NextResponse.json({
      profile: {
        ...userData,
        totalRepos: userData.public_repos,
        followers: userData.followers,
        totalStars,
        totalForks,
      },
      repos: reposData,
    });
  } catch (error) {
    console.error("GitHub repos API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
