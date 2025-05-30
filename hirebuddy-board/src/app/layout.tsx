import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";


import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hirebuddy",
  description: "Your AI-powered job search assistant, based on resume-matching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          toastOptions={{
            className: "backdrop-blur-md bg-zinc-900/80 text-zinc-100 border border-zinc-700 shadow-xl max-w-md px-4 py-3 rounded-lg",
            style: {
              fontSize: "15px",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
