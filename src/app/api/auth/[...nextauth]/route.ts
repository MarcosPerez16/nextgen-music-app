import NextAuth, {
  type NextAuthOptions,
  type Account,
  type User,
} from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AdapterUser } from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";
import SpotifyProvider from "next-auth/providers/spotify";
import { refreshSpotifyToken } from "@/lib/spotify";
import { CustomJWT } from "@/types/auth";

// create new prisma client instance to communciate with our database
const prisma = new PrismaClient();

//configuration object that tells NextAuth how to handle authentication
export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      // these identify our app to spotify's servers
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "user-read-email user-read-private playlist-read-private user-top-read streaming user-read-playback-state user-modify-playback-state",
        },
      },
    }),
  ],
  //   functions that run during different parts of the auth process
  callbacks: {
    async signIn({ user, account }) {
      // make sure we have the account data and required tokens if not we reject login
      if (
        !account ||
        !account.access_token ||
        !account.refresh_token ||
        !account.expires_at
      )
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
          //have to convert unix time that spotify gives us to JS date
          expiresAt: new Date(account.expires_at * 1000),
        },
        create: {
          spotifyId: user.id,
          email: user.email,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: new Date(account.expires_at * 1000),
        },
      });

      return true;
    },

    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT & CustomJWT;
      account: Account | null;
      user: User | AdapterUser;
    }) {
      // first login - store fresh tokens from spotify
      if (account && user && account.expires_at) {
        //user just logged in - save their tokens to the JWT
        const newToken = {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at * 1000,
          spotifyId: user.id,
        };

        return newToken;
      }

      //return visit - check if tokens need refreshing
      //make sure we have the required token data
      if (!token.expiresAt || !token.refreshToken) {
        return {
          ...token,
          error: "MissingTokenData",
        };
      }

      //check if the current access token is expired
      if (Date.now() < token.expiresAt) {
        return token;
      }

      //token is expired
      try {
        const refreshedTokens = await refreshSpotifyToken(token.refreshToken);

        return {
          ...token,
          accessToken: refreshedTokens.access_token,
          refreshToken: refreshedTokens.refresh_token,
          expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
        };
      } catch (error) {
        console.error("Error refreshing token:", error);

        return {
          ...token,
          error: "RefreshTokenError",
        };
      }
    },
    async session({ session, token }) {
      // Include custom data from JWT token in the session
      return {
        ...session,
        spotifyId: token.spotifyId,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
    },
  },
};
// processes all auth requests
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
