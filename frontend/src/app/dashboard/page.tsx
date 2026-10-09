"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GuestDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers la nouvelle application mobile PWA
    router.replace('/resident');
  }, [router]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-[#0a0a0a] flex items-center justify-center">
       <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#D4AF37]/50 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold">Lancement de l'App...</p>
       </div>
    </div>
  );
}
