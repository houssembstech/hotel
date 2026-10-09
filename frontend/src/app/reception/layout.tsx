"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [unresolvedLogs, setUnresolvedLogs] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('hotel_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Fetch logbook entries to get unresolved count
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/logbook')
      .then(res => res.json())
      .then(data => {
         if (Array.isArray(data)) {
            const count = data.filter((log: any) => !log.isResolved).length;
            setUnresolvedLogs(count);
         }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hotel_token');
    localStorage.removeItem('hotel_user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      
      {/* Sidebar for Receptionist */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
           <div>
             <h2 className="text-xl font-serif text-white tracking-widest text-[#D4AF37]">RÉCEPTION</h2>
             <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold flex items-center gap-1 mt-1">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Lumina Desk
             </span>
           </div>
        </div>

        {/* Active Agent Session */}
        <div className="p-4 border-b border-slate-800 bg-slate-800/20 m-4 rounded-xl border border-slate-700">
           <p className="text-xs text-slate-400 mb-2">Agent Connecté</p>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Felix'}&backgroundColor=334155`} alt="Agent" />
              </div>
              <div>
                 <p className="text-sm text-white font-bold">{user?.name || 'Chargement...'}</p>
                 <button onClick={handleLogout} className="text-[10px] text-sky-400 hover:underline">Déconnexion</button>
              </div>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/reception" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium">
             Lobby & Rack (Front Desk)
          </Link>
          <Link href="/reception/arrivals" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium">
             Arrivées (Check-in)
          </Link>
          <Link href="/reception/calendar" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium relative flex items-center justify-between">
             <span>Calendrier</span>
             <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">NOUVEAU</span>
          </Link>
          <Link href="/reception/departures" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium">
             Départs (Check-out)
          </Link>
          <Link href="/reception/logbook" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium flex justify-between items-center">
             <span>Main Courante</span>
             {unresolvedLogs > 0 && (
               <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unresolvedLogs}</span>
             )}
          </Link>
          <Link href="/reception/cash-register" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium">
             Ma Caisse (Shift)
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <Link href="/" className="block px-4 py-2 text-sm text-slate-500 hover:text-white transition-colors text-center">
            ← Quitter le logiciel
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden relative">
         <div className="p-4 md:p-8 max-w-7xl mx-auto h-full pb-32">
           {children}
         </div>
      </main>
      
    </div>
  );
}
