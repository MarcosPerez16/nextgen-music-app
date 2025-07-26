import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import SpotifyProvider from "next-auth/providers/spotify";

// create new prisma client instance to communciate with our database
const prisma = new PrismaClient();

//configuration object that tells NextAuth how to handle authentication
const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      // these identify our app to spotify's servers
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  ],
  //   functions that run during different parts of the auth process
  callbacks: {
    async signIn({ user, account }) {
      // make sure we have the account data and required tokens if not we reject login
      if (!account || !account.access_token || !account.refresh_token)
        return false; //cant proceed without tokens

      //   save or update user in our database
      // upsert = update if exists, create if doesn't exist
      await prisma.user.upsert({
        // find an existing user by Spotify ID
        where: {
          spotifyId: user.id,
        },
        update: {
          //if user exists update these fields, tokens expire so we refresh them on each login
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
        },
        create: {
          spotifyId: user.id,
          email: user.email,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
        },
      });

      return true;
    },
  },
};
// processes all auth requests
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
