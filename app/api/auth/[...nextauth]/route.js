import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

dbConnect()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          // Make sure we're requesting the correct scopes
          scope: "read:user user:email repo",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Force JWT strategy
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development", // Enable debugging in development
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();

        // 1. Find user by email
        let dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          // 2. User exists: Check if this provider is already linked
          const isLinked = dbUser.accounts?.some(
            (acc) =>
              acc.provider === account.provider &&
              acc.providerId === account.providerAccountId,
          );

          // 3. Link if not linked
          if (!isLinked) {
            if (!dbUser.accounts) dbUser.accounts = [];

            dbUser.accounts.push({
              provider: account.provider,
              providerId: account.providerAccountId,
            });

            // If main image is missing, use this one
            if (!dbUser.image) dbUser.image = user.image;

            await dbUser.save();
            console.log(
              `Linked ${account.provider} to existing user: ${dbUser.email}`,
            );
          }
        } else {
          // 4. Create new user with initial provider in accounts array
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            username: profile.login || user.email.split("@")[0], // Fallback username
            accounts: [
              {
                provider: account.provider,
                providerId: account.providerAccountId,
              },
            ],
          });
          console.log("Created new user:", dbUser.email);
        }

        // Store info for JWT
        user.dbId = dbUser._id.toString();
        user.username = dbUser.username;
        user.connectedAccounts = dbUser.accounts.map((acc) => acc.provider);

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // Initial sign in or subsequent requests
      if (account && user) {
        // On sign-in (account is present), update token with database ID and connected accounts
        // We know 'user' here is the object returned/modified in signIn?
        // Actually, the 'user' object in jwt callback is the one from the provider + whatever modification?
        // Let's re-fetch or use what we stored in signIn if possible.
        // In signIn, we modified 'user' object: user.dbId, user.username.

        // We also need the list of accounts.
        // Let's fetch the user again to be sure, or better, attach it in signIn?
        // Modifying 'user' in signIn works for passing data to jwt callback.

        return {
          ...token,
          accessToken: account.access_token,
          username: user.username,
          id: user.dbId,
          connectedAccounts: user.connectedAccounts || [account.provider], // We will add this in signIn
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      session.username = token.username;
      session.connectedAccounts = token.connectedAccounts || [];

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
