import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kyiv Light Logo — Гірлянди з вашим логотипом",
  description:
    "Новорічні гірлянди з вашим логотипом. Будь-яка форма, будь-який логотип. Виробимо за 3 дні.",
  icons: {
    icon: "/hero-garland.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "#000000", color: "#ffffff" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}