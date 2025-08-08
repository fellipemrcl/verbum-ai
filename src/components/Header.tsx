"use client";


import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full flex items-center justify-between p-4 bg-white shadow">
      <Link href="/" className="text-xl font-bold">
        Verbum AI
      </Link>
      {session?.user ? (
        <div className="flex items-center gap-3">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="font-medium">{session.user.name}</span>
        </div>
      ) : (
        <Link href="/login" className="text-blue-600 font-medium">
          Sign in
        </Link>
      )}
    </header>
  );
}
