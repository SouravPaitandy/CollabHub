import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Check if the request is for the dashboard route
  if (pathname === "/dashboard") {
    // Get the authentication token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If the user is authenticated, redirect to their profile
    if (token && token.user?.email) {
      // Create the username from email (or use another property from the token)
      const username = token.user.email.split("@")[0]; // Or use a dedicated username field

      // Create the new URL for redirect
      const url = new URL(`/${username}`, request.url);

      // Preserve existing search params (e.g. ?join=123)
      request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });

      // Return the redirect response
      return NextResponse.redirect(url);
    }
  }

  // Continue with the request for other routes
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ["/dashboard"],
};
