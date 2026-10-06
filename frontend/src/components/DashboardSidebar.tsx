"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('hotel_token');
    localStorage.removeItem('hotel_user');
    router.push('/login');
  };

  let links: { name: string; path: string; icon: string }[] = [];

  if (role === 'SUPER_ADMIN') {
    links = [
      { name: 'Financial Overview', path: '/admin', icon: '💰' },
      { name: 'Director & Staff', path: '/admin/roles', icon: '👥' },
      { name: 'Audit & System Logs', path: '/admin/logs', icon: '⚙️' },
    ];
  } else if (role === 'DIRECTOR') {
    links = [
      { name: 'Vue d\'Ensemble', path: '/director', icon: '📈' },
      { name: 'Hébergement', path: '/director/rooms', icon: '🛏️' },
      { name: 'Événementiel', path: '/director/events', icon: '🎭' },
      { name: 'Restauration', path: '/director/dining', icon: '🍽️' },
      { name: 'Services & Extras', path: '/director/services', icon: '🛎️' },
      { name: 'Équipes & Staff', path: '/director/staff', icon: '👥' },
      { name: 'Finances & Caisses', path: '/director/finance', icon: '💳' },
    ];
  } else if (role === 'RECEPTIONIST') {
    links = [
      { name: 'Front Desk', path: '/reception', icon: '🛎️' },
      { name: 'Room Rack', path: '/reception/rack', icon: '📅' },
      { name: 'Walk-ins', path: '/reception/walk-in', icon: '🚶' },
      { name: 'Housekeeping', path: '/reception/housekeeping', icon: '🧹' },
      { name: 'Cash Register', path: '/reception/cashier', icon: '💶' },
    ];
  } else {
    links = [
      { name: 'My Stay', path: '/dashboard', icon: '🏠' },
      { name: 'Room Service', path: '/dashboard/room-service', icon: '🍽️' },
      { name: 'Invoices', path: '/dashboard/invoices', icon: '📄' },
    ];
  }

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col hidden md:flex fixed">
      <div className="p-6 pb-2 border-b border-slate-800">
        <h2 className="text-[#D4AF37] text-2xl font-serif font-bold">Lumina</h2>
        <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{role.replace('_', ' ')} PORTAL</p>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2 px-4">
          {links.map((link) => (
            <li key={link.path}>
              <Link 
                href={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === link.path ? 'bg-[#D4AF37] text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 rounded-xl transition-colors font-medium"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
}
