"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalNavFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/admin') || 
                      pathname.startsWith('/director') || 
                      pathname.startsWith('/reception') || 
                      pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/resident') || 
                      pathname.startsWith('/login');

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-gold-400 text-[#D4AF37]">Lumina</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#rooms" className="text-slate-300 hover:text-white transition-colors">Our Suites</Link>
              <Link href="/#dining" className="text-slate-300 hover:text-white transition-colors">Dining</Link>
              <Link href="/#spa" className="text-slate-300 hover:text-white transition-colors">Spa & Wellness</Link>
              <Link href="/login" className="text-slate-300 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">Sign In</Link>
              <Link href="/book" className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 inline-block">
                Book Now
              </Link>
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
    </>
  );
}
