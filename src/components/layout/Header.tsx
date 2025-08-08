"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/SignInButton";

export function Header() {
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
          <Button
            variant="outline"
            size="sm"
            className="ml-2 text-sm text-gray-500 hover:text-red-600"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </Button>
        </div>
      ) : (
        <SignInButton />
      )}
    </header>
  );
}
