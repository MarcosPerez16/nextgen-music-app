"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  //loading state
  if (status === "loading") {
    return <main className="text-white text-xl p-4">Loading...</main>;
  }

  return (
    <main>
      <h1>NextGen Music Player</h1>

      {/* show different content based on login status */}

      {session ? (
        //user is logged in
        <div>
          <p>Welcome, {session.user?.name}!</p>

          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        // user is not logged in
        <div>
          <p>Please log in to access your music</p>

          <button
            onClick={() => signIn()}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Login
          </button>
        </div>
      )}
    </main>
  );
}
