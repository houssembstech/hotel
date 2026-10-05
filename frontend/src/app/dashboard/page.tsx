import React from 'react';

export default function GuestDashboardPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">My Portal</h1>
            <p className="text-slate-400">Welcome back. Manage your stays and request services.</p>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-2 rounded-xl transition-all">
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6 border-gold-500/30 border">
            <h2 className="text-xl font-medium text-white mb-4">Current Stay</h2>
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Room</span>
                <span className="text-gold-400 font-bold text-[#D4AF37]">304 - Oceanfront</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Wi-Fi Code</span>
                <span className="text-white tracking-widest font-mono">LUMINA26</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Check-out</span>
                <span className="text-white">Tomorrow, 11:00 AM</span>
              </div>
            </div>
            <button className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold py-3 rounded-lg transition-all">
              Request Room Service
            </button>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-medium text-white mb-4">Past Invoices</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-3 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-white">Stay: 14 Aug - 18 Aug</p>
                    <p className="text-sm text-slate-500">Paid • $1,250</p>
                  </div>
                </div>
                <span className="text-[#D4AF37] text-sm">Download</span>
              </li>
              <li className="flex justify-between items-center p-3 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-white">Stay: 02 Jan - 05 Jan</p>
                    <p className="text-sm text-slate-500">Paid • $890</p>
                  </div>
                </div>
                <span className="text-[#D4AF37] text-sm">Download</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
