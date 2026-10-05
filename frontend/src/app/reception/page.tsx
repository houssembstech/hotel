"use client";
import React, { useState } from 'react';

export default function ReceptionDashboardPage() {
  const [activeTab, setActiveTab] = useState<'ARRIVALS' | 'DEPARTURES'>('ARRIVALS');

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Front Desk Operations</h1>
          <p className="text-slate-400">Manage today's check-ins, check-outs, and quick actions.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2">
            <span>+</span> New Walk-in
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 border border-sky-500/30 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Expected Arrivals</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white">12</h2>
            <span className="text-sky-400 bg-sky-500/10 px-2 py-1 rounded text-xs font-bold">Today</span>
          </div>
        </div>
        <div className="glass-card p-6 border border-amber-500/30 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Pending Departures</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white">8</h2>
            <span className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded text-xs font-bold">11:00 AM</span>
          </div>
        </div>
        <div className="glass-card p-6 border border-emerald-500/30 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">In-House Guests</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white">45</h2>
            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold">Live</span>
          </div>
        </div>
        <div className="glass-card p-6 border border-purple-500/30 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Available Rooms</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white">5</h2>
            <span className="text-purple-400 bg-purple-500/10 px-2 py-1 rounded text-xs font-bold">Clean</span>
          </div>
        </div>
      </div>

      {/* Action Area: Arrivals vs Departures */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('ARRIVALS')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'ARRIVALS' ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            Check-Ins (Arrivals)
          </button>
          <button 
            onClick={() => setActiveTab('DEPARTURES')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'DEPARTURES' ? 'bg-slate-800 text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            Check-Outs (Departures)
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 flex gap-4">
            <input 
              type="text" 
              placeholder="Search by guest name or booking ID..." 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
            <button className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-all">
              Filter
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-sm">
                <th className="font-medium pb-4 pl-4">Guest Name</th>
                <th className="font-medium pb-4">Booking Ref</th>
                <th className="font-medium pb-4">Room Type</th>
                <th className="font-medium pb-4">Status</th>
                <th className="font-medium pb-4 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {activeTab === 'ARRIVALS' ? (
                <>
                  <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pl-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">JD</div>
                      John Doe
                    </td>
                    <td className="py-4 font-mono text-sm text-slate-400">#RES-8894</td>
                    <td className="py-4">Oceanfront Deluxe</td>
                    <td className="py-4"><span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-medium border border-slate-700">Not arrived</span></td>
                    <td className="py-4 text-right pr-4">
                      <button className="bg-sky-500/20 text-sky-400 border border-sky-500/50 hover:bg-sky-500/50 px-4 py-2 rounded-lg text-sm transition-all font-medium">
                        Perform Check-in
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 pl-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">SA</div>
                      Sarah Ahmed
                    </td>
                    <td className="py-4 font-mono text-sm text-slate-400">#RES-2301</td>
                    <td className="py-4">Executive Suite</td>
                    <td className="py-4"><span className="bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded text-xs font-medium border border-emerald-800">Checked In</span></td>
                    <td className="py-4 text-right pr-4">
                      <button className="bg-slate-800 text-slate-400 px-4 py-2 rounded-lg text-sm transition-all font-medium cursor-not-allowed" disabled>
                        Done
                      </button>
                    </td>
                  </tr>
                </>
              ) : (
                <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pl-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">ML</div>
                    Marie Laurent
                  </td>
                  <td className="py-4 font-mono text-sm text-slate-400">#RES-1044</td>
                  <td className="py-4">Standard Room (304)</td>
                  <td className="py-4"><span className="bg-amber-900/50 text-amber-400 px-2 py-1 rounded text-xs font-medium border border-amber-800">Balance USD 45</span></td>
                  <td className="py-4 text-right pr-4">
                    <button className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg text-sm transition-all font-bold">
                      Settle & Check-out
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
