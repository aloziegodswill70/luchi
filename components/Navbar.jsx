'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link href="/" className="text-xl font-bold text-yellow-300">
        Luchi25
      </Link>
      <div className="space-x-4">
        {session ? (
          <>
            <Link href="/dashboard/cv">Dashboard</Link>
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white text-green-700 px-4 py-2 rounded hover:bg-gray-100"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
