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

export async function PUT(request: Request) {
  //Get current users session from NextAuth
  const session = await getServerSession(authOptions);

  //   check if user is logged in
  if (!session) {
    return Response.json({ error: "You must be logged in" }, { status: 401 });
  }
  //typescript needs to know about our custom session props since NextAuth's default
  // Session type doesnt know about spotifyId, accessToken, etc.
  const extendedSession = session as Session & ExtendedSession;

  //parse the JSON request body into a JS object so we can access userData.email
  const userData = await request.json();

  //validation check
  if (!userData.email || userData.email.trim() === "") {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // update users email in database using their Spotify ID to identify them
    const updateUser = await prisma.user.update({
      where: {
        spotifyId: extendedSession.spotifyId,
      },
      data: {
        email: userData.email,
      },
    });

    return Response.json({
      // we return all the data for display, BUT they can still only update the email
      //we would not want to allow them to update unique info like spotifyId or id
      user: {
        id: updateUser.id,
        spotifyId: updateUser.spotifyId,
        email: updateUser.email,
        createdAt: updateUser.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}
