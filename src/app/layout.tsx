import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UTSAV | Organization Transparency Platform",
  description: "Secure, transparent, and community-driven Organization management.",
};

import SessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} bg-[#F8FAFC]`}>
        <SessionProvider>
          <Toaster position="top-center" expand={true} richColors />
          <Navbar />
          <div className="pt-16 min-h-screen">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
