"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { SignInButton } from "@/components/SignInButton";
import { BookSearchContainer } from "@/components/features/BookSearchContainer";

export default function Home() {
  const { status } = useSession();

  return (
    <div className="font-sans flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-black dark:to-gray-900 p-8">
      {status !== "authenticated" && (
        <main className="flex flex-col gap-8 items-center w-full max-w-lg bg-white dark:bg-gray-950 rounded-xl shadow-lg p-8">
          <Image
            className="dark:invert mb-4"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={30}
            priority
          />
          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome to Verbum AI
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Discover and get AI-powered book recommendations. Sign in to get
            started!
          </p>
          <SignInButton fullWidth />
        </main>
      )}
      {status === "authenticated" && (
        <>
          <p className="text-green-600 font-medium mb-4">You are signed in. Enjoy your recommendations!</p>
          <BookSearchContainer />
        </>
      )}
      <footer className="mt-8 text-xs text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Verbum AI. Powered by Next.js, OpenAI,
        and Shadcn UI.
      </footer>
    </div>
  );
}
