"use client";

import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/layout/Header";

interface ClientHeaderProviderProps {
  children: React.ReactNode;
}

export function ClientHeaderProvider({ children }: ClientHeaderProviderProps) {
  return (
    <SessionProvider>
      <Header />
      {children}
    </SessionProvider>
  );
}
