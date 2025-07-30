import { getServerSession, Session } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

interface ExtendedSession {
  spotifyId?: string;
  accessToken?: string;
  refreshToken?: string;
}

const prisma = new PrismaClient();

export async function GET() {
  //Get current users session from NextAuth
  const session = await getServerSession(authOptions);

  //   check if user is logged in
  if (!session) {
    return Response.json({ error: "You must be logged in" }, { status: 401 });
  }
  //typescript needs to know about our custom session props since NextAuth's default
  // Session type doesnt know about spotifyId, accessToken, etc.
  const extendedSession = session as Session & ExtendedSession;
  //get user data from db
  const user = await prisma.user.findUnique({
    where: {
      spotifyId: extendedSession.spotifyId,
    },
  });

  //check if user exists in db
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json({
    user: {
      id: user.id,
      spotifyId: user.spotifyId,
      email: user.email,
      createdAt: user.createdAt,
      //do not return accessToken/refreshToken for security
    },
  });
}
