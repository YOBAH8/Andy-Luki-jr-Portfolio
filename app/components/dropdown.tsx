'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Dropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white text-2xl hover:text-gray-300"
      >
        ☰
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-screen md:w-48 bg-[#0C2340] rounded-md shadow-2xl py-2 z-20 border border-gray-600">
          <Link
            href="/"
            className="block px-4 py-2 text-base font-mono font-bold text-white hover:bg-gray-700 text-center"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {session ? (
            <>
              <Link
                href="/edit"
                className="block px-4 py-2 text-base font-mono font-bold text-white hover:bg-gray-700 text-center"
                onClick={() => setIsOpen(false)}
              >
                Edit
              </Link>
              <Link
                href="/upload"
                className="block px-4 py-2 text-base font-mono font-bold text-white hover:bg-gray-700 text-center"
                onClick={() => setIsOpen(false)}
              >
                Upload
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-base font-mono font-bold text-white hover:bg-gray-700 text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="block px-4 py-2 text-base font-mono font-bold text-white hover:bg-gray-700 text-center"
                onClick={() => setIsOpen(false)}
              >
                Admin Login
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
