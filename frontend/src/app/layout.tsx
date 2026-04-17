"use client";

import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: '--font-roboto',
});

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
      <body className="font-body">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Toaster position="top-center" richColors />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
