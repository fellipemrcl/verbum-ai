"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function SignInButton({ 
  className = "", 
  fullWidth = false 
}: { 
  className?: string; 
  fullWidth?: boolean; 
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={fullWidth ? "w-full" : ""}
    >
      <Button
        className={`
          flex items-center justify-center gap-3 
          ${fullWidth ? "w-full py-4 text-lg" : "px-6 py-2"} 
          bg-white hover:bg-gray-50 
          dark:bg-slate-800 dark:hover:bg-slate-700 
          border-2 border-slate-200 dark:border-slate-600 
          hover:border-slate-300 dark:hover:border-slate-500
          text-slate-700 dark:text-slate-200
          shadow-lg hover:shadow-xl
          transition-all duration-200
          ${className}
        `}
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <motion.div
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <FcGoogle className={fullWidth ? "text-2xl" : "text-xl"} />
        </motion.div>
        <span className="font-medium">
          Sign in with Google
        </span>
        <motion.div
          className="ml-2"
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.div>
      </Button>
    </motion.div>
  );
}
