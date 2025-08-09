
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientHeaderProvider } from "@/components/layout/ClientHeaderProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verbum AI - AI-Powered Book Discovery",
  description: "Discover your next great read with AI-powered book recommendations. Search, explore, and find books tailored to your taste.",
  icons: {
    icon: '/book.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <ClientHeaderProvider>
            {children}
          </ClientHeaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
