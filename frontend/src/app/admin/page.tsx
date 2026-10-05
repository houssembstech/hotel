"use client";
import React, { useEffect, useState } from 'react';

export default function SuperAdminFinancePage() {
  const [stats, setStats] = useState({ hotels: 0, users: 4, status: 'Healthy', uptime: 1000 });

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">Investor Dashboard</h1>
          <p className="text-slate-400">Global financial oversight, revenue tracking, and business governance.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-all border border-slate-700 flex items-center gap-2">
            <span>📄</span> Export PDF
          </button>
          <button className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2">
            <span>📊</span> Export Excel / CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 border-b-4 border-[#D4AF37] rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Today's Revenue</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white">$4,250</h2>
            <span className="text-emerald-400 font-bold text-sm">+5% vs Yesterday</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-emerald-500 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Current Month (MTD)</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white">$142,500</h2>
            <span className="text-emerald-400 font-bold text-sm">+12% vs N-1</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-sky-500 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Total Year (YTD)</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white">$1.2M</h2>
            <span className="text-emerald-400 font-bold text-sm">+8% vs N-1</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-purple-500 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Tourism Taxes (To Remit)</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white">$8,450</h2>
            <span className="text-slate-500 font-bold text-sm">Collected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="glass-card p-8 border border-slate-800 rounded-2xl">
          <h2 className="text-xl font-medium text-white mb-6 border-b border-slate-800 pb-2">Revenue Origin</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Room Booking (Accommodation)</span>
                <span className="text-white font-bold">$115,000</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-[#D4AF37] h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Restaurant & Room Service</span>
                <span className="text-white font-bold">$18,500</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-sky-500 h-3 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Spa & Wellness Extras</span>
                <span className="text-white font-bold">$9,000</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 border border-slate-800 rounded-2xl">
          <h2 className="text-xl font-medium text-white mb-6 border-b border-slate-800 pb-2">Payment Methods Breakdown</h2>
          <div className="flex items-center justify-around h-full pb-8">
            <div className="text-center">
               <div className="w-24 h-24 rounded-full border-8 border-sky-500 flex items-center justify-center mx-auto mb-4">
                 <span className="text-sky-400 font-bold">60%</span>
               </div>
               <span className="text-slate-300 block">Credit Card</span>
               <span className="text-slate-500 text-sm">$85,500</span>
            </div>
            <div className="text-center">
               <div className="w-24 h-24 rounded-full border-8 border-amber-500 flex items-center justify-center mx-auto mb-4">
                 <span className="text-amber-400 font-bold">25%</span>
               </div>
               <span className="text-slate-300 block">Cash</span>
               <span className="text-slate-500 text-sm">$35,625</span>
            </div>
            <div className="text-center">
               <div className="w-24 h-24 rounded-full border-8 border-purple-500 flex items-center justify-center mx-auto mb-4">
                 <span className="text-purple-400 font-bold">15%</span>
               </div>
               <span className="text-slate-300 block">Bank Transfer</span>
               <span className="text-slate-500 text-sm">$21,375</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
