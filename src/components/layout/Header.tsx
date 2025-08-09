"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/SignInButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const { data: session } = useSession();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full flex items-center justify-between p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-slate-800/50 sticky top-0 z-50"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <Image
              src="/book.png"
              alt="Verbum AI Book Icon"
              width={24}
              height={24}
              className="w-6 h-6 filter brightness-0 invert"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Verbum AI
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
              Book Discovery
            </p>
          </div>
        </Link>
      </motion.div>

      {session?.user ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <ThemeToggle />
          
          <motion.div
            className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {session.user.image && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full ring-2 ring-blue-500/20"
                />
              </motion.div>
            )}
            <div>
              <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                {session.user.name}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                Welcome back!
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <ThemeToggle />
          <SignInButton />
        </motion.div>
      )}
    </motion.header>
  );
}
