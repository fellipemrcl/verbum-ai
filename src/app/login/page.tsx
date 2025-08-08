"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in to your account</h1>
        <Button
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
