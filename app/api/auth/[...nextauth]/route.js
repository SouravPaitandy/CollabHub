import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

dbConnect().then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

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
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    })
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
        console.log("SignIn callback with account:", account);
        
        // Check if user already exists
        let dbUser = await User.findOne({ email: user.email });
        
        if (!dbUser) {
          // Create new user if doesn't exist
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: account.provider,
            providerId: account.providerAccountId,
            username: profile.login || `user${Date.now()}`,
          });
        }
        
        console.log('User signed in successfully:', dbUser);
        
        // Store additional provider info in user object for JWT callback
        user.provider = account.provider;
        user.accessToken = account.access_token;
        if (account.provider === "github") {
          user.username = profile.login;
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log("JWT callback on initial sign in:", { 
          provider: account.provider,
          hasToken: !!account.access_token
        });
        
        return {
          ...token,
          accessToken: account.access_token,
          provider: account.provider,
          username: user.username || token.username,
        };
      }
      
      // On subsequent calls, return the existing token
      return token;
    },
    async session({ session, token }) {
      // Add token values to the session
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      session.username = token.username;
      
      console.log("Session updated with token info:", {
        hasAccessToken: !!session.accessToken,
        provider: session.provider
      });
      
      return session;
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }