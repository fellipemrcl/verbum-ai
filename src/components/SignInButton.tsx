"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function SignInButton({ className = "", fullWidth = false }: { className?: string; fullWidth?: boolean }) {
  return (
    <Button
      className={`flex items-center justify-center gap-2 ${fullWidth ? "w-full" : ""} ${className}`}
      variant="outline"
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      <FcGoogle className="text-xl" />
      Sign in with Google
    </Button>
  );
}
