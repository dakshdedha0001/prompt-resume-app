import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prompt Resume — Build a Professional ATS-Friendly Resume with AI",
  description: "A step-by-step ebook with 23 chapters and 30+ ready-to-use AI prompts to help students and freshers build an ATS-proof resume, optimize LinkedIn, write cover letters, and land more interview calls.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "SsbCzeZE1fDVZpWX2TkR9iUZTP0mf9hModK7ebGx1pI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          signInFallbackRedirectUrl="https://pages.razorpay.com/pl_TM7354DbTXicGS/view"
          signUpFallbackRedirectUrl="https://pages.razorpay.com/pl_TM7354DbTXicGS/view"
          signInForceRedirectUrl="https://pages.razorpay.com/pl_TM7354DbTXicGS/view"
          signUpForceRedirectUrl="https://pages.razorpay.com/pl_TM7354DbTXicGS/view"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
