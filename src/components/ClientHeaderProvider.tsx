"use client";

import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";

export default function ClientHeaderProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      {children}
    </SessionProvider>
  );
}
