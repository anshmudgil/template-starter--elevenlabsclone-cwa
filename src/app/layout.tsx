import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mission Control",
    template: "%s | Mission Control",
  },
  description: "Velocity OS — OpenClaw-connected operations dashboard",
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shell = (
    <>
      <NuqsAdapter>{children}</NuqsAdapter>
      <Toaster />
    </>
  );

  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        {clerkPublishableKey ? (
          <ClerkProvider publishableKey={clerkPublishableKey}>{shell}</ClerkProvider>
        ) : (
          shell
        )}
      </body>
    </html>
  );
}
