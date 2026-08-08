import type { Metadata } from "next";
import { Inter_Tight, Inter } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Timio — Meeting room booking",
  description: "Book meeting rooms, manage reservations and see live availability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-inter">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
