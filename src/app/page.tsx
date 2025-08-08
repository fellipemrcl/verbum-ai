"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { SignInButton } from "@/components/SignInButton";
import { BookSearchContainer } from "@/components/features/BookSearchContainer";

export default function Home() {
  const { status } = useSession();

  return (
    <div className="font-sans flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-950 p-8">
      {status !== "authenticated" && (
        <motion.main
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-8 items-center w-full max-w-lg bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-slate-800/50 p-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-3">
              Verbum AI
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 font-medium mb-2">
              Discover Your Next Great Read
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Get personalized AI-powered book recommendations tailored to your taste. 
              Search, explore, and find books you&apos;ll love.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="w-full"
          >
            <SignInButton fullWidth />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex items-center gap-6 text-sm text-slate-400 dark:text-slate-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Personalized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Instant</span>
            </div>
          </motion.div>
        </motion.main>
      )}
      
      {status === "authenticated" && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Welcome Back!
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Ready to discover your next favorite book?
            </p>
          </motion.div>
          <BookSearchContainer />
        </motion.div>
      )}
      
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
          &copy; {new Date().getFullYear()} Verbum AI. Powered by Next.js, OpenAI, and Shadcn UI.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-slate-300 dark:text-slate-600">
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            Secure Authentication
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
            Privacy First
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
            Open Source
          </span>
        </div>
      </motion.footer>
    </div>
  );
}
