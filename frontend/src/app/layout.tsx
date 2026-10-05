import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
        {/* Navigation Bar */}
        <nav className="fixed w-full z-50 glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-gold-400 text-[#D4AF37]">Lumina</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#rooms" className="text-slate-300 hover:text-white transition-colors">Our Suites</a>
                <a href="#dining" className="text-slate-300 hover:text-white transition-colors">Dining</a>
                <a href="#spa" className="text-slate-300 hover:text-white transition-colors">Spa & Wellness</a>
                <button className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>
        {/* Footer */}
        <footer className="bg-slate-900 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400 font-serif mb-4 text-xl">Lumina Respite</p>
            <p className="text-slate-500 text-sm">© 2026 Lumina Respite. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
