import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Playfair_Display } from "next/font/google";
import GlobalNavFooter from "@/components/GlobalNavFooter";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Lumina Respite | Luxury Hotel & Resort",
  description: "Experience unparalleled luxury and tranquility at Lumina Respite. Book your stay today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-slate-950 text-slate-50 min-h-screen flex flex-col`}>
        <GlobalNavFooter>
          {children}
        </GlobalNavFooter>
      </body>
    </html>
  );
}
