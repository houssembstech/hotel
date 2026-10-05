import React from 'react';

export default function DirectorDashboardPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Director's Overview</h1>
          <p className="text-slate-400">Financial KPIs, Room Inventory, and Staff Management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 border-b-4 border-[#D4AF37]">
          <h3 className="text-slate-400 font-medium mb-2">Monthly Revenue (MoM)</h3>
          <div className="flex items-end gap-4">
            <span className="text-4xl text-white font-bold">$142,500</span>
            <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded text-sm">+12.4%</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-emerald-500">
          <h3 className="text-slate-400 font-medium mb-2">Occupancy Rate</h3>
          <div className="flex items-end gap-4">
            <span className="text-4xl text-white font-bold">86%</span>
            <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded text-sm">+5%</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-sky-500">
          <h3 className="text-slate-400 font-medium mb-2">RevPAR</h3>
          <div className="flex items-end gap-4">
            <span className="text-4xl text-white font-bold">$215</span>
            <span className="text-slate-500 font-bold bg-slate-800 px-2 py-1 rounded text-sm">Stable</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 border border-slate-800 rounded-2xl min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4">📈</span>
          <p className="text-slate-500 text-lg">Financial charts & Revenue curves will be rendered here.</p>
        </div>
      </div>
    </div>
  );
}
