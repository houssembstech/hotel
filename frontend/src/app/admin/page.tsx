"use client";
import React, { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ hotels: 0, users: 0, status: 'Loading', uptime: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">Super Admin Portal</h1>
          <p className="text-slate-400">Manage all hotel properties, IT logs, and high-level platform settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="md:col-span-1 space-y-4">
          <div className="glass-card p-6 border-gold-500/30 border">
            <h3 className="text-gold-400 font-medium mb-4">Platform Stats</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                <span>Active Hotels</span>
                <span className="font-bold text-white text-xl">{stats.hotels}</span>
              </li>
              <li className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                <span>Total Staff Users</span>
                <span className="font-bold text-white text-xl">{stats.users}</span>
              </li>
              <li className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                <span>API Status</span>
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${stats.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{stats.status}</span>
              </li>
              <li className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                <span>Server Uptime</span>
                <span className="font-mono text-slate-400 text-sm">{Math.floor(stats.uptime / 60)} min</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-3 glass-card p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                 <span className="text-5xl">🌍</span>
              </div>
              <h2 className="text-2xl text-white font-serif mb-2">Global Infrastructure Healthy</h2>
              <p className="text-slate-400 max-w-md mx-auto">Use the sidebar to manage your multi-tenant hotel establishments or to assign Directors to their respective locations.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
