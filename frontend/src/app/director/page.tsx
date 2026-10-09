"use client";
import React, { useEffect, useState } from 'react';

export default function DirectorDashboardPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [financials, setFinancials] = useState({
     revenue: { total: 0, accommodation: 0, dining: 0, spa: 0 },
     payments: { cash: 0, card: 0, bank: 0 },
     monthlyChart: []
  });

  useEffect(() => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/financials')
      .then(res => res.json())
      .then(data => {
         if (data.revenue) {
            setFinancials({ revenue: data.revenue, payments: data.payments, monthlyChart: data.monthlyChart || [] });
            setShifts(data.shifts || []);
         }
      })
      .catch(console.error);
  }, []);

  const totalRev = financials.revenue.total || 1;
  const accomPct = Math.round((financials.revenue.accommodation / totalRev) * 100);
  const diningPct = Math.round((financials.revenue.dining / totalRev) * 100);
  const spaPct = Math.round((financials.revenue.spa / totalRev) * 100);
  const totalCashCollected = shifts.reduce((acc, current) => acc + (current.actualCashCount || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Vue d'Ensemble & Chiffre d'Affaires</h1>
          <p className="text-slate-400">Suivez les KPIs en temps réel, l'occupation et les revenus de l'établissement.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl transition-all border border-slate-700 shadow-sm flex items-center gap-2">
            <span>📅</span> Mois en cours
          </button>
          <button className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold px-6 py-2 rounded-xl transition-all shadow-lg flex items-center gap-2">
            <span>⬇️</span> Exporter Rapport
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 border-b-4 border-emerald-500">
          <h3 className="text-slate-400 font-medium mb-1">CA Généré (Aujourd'hui)</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl text-white font-bold">{financials.revenue.total.toFixed(2)} €</span>
            <span className="text-emerald-500 font-bold px-2 py-1 bg-emerald-500/10 rounded text-sm">+8%</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-sky-500">
          <h3 className="text-slate-400 font-medium mb-1">Taux d'Occupation</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl text-white font-bold">92%</span>
            <span className="text-sky-400 font-bold px-2 py-1 bg-sky-500/10 rounded text-sm">Complet</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-[#D4AF37]">
          <h3 className="text-slate-400 font-medium mb-1">Total Encaissé (Tiroir)</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl text-white font-bold">{totalCashCollected.toFixed(2)} €</span>
            <span className="text-[#D4AF37] font-bold px-2 py-1 bg-[#D4AF37]/10 rounded text-sm">Réel</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-amber-500">
          <h3 className="text-slate-400 font-medium mb-1">ADR (Prix Moyen/Nuit)</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl text-white font-bold">280 €</span>
            <span className="text-amber-400 font-bold px-2 py-1 bg-amber-500/10 rounded text-sm">+15 €</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 glass-card p-8 border border-slate-800 rounded-2xl">
          <h2 className="text-xl font-medium text-white mb-6">Évolution Mensuelle du Chiffre d'Affaires</h2>
          <div className="h-64 flex flex-col justify-end gap-2 pr-4 border-l border-b border-slate-700 relative pt-4">
             {/* Real Chart Bars */}
             <div className="flex justify-between items-end h-full w-full opacity-80 gap-2">
                {financials.monthlyChart.map((monthData: any, idx: number) => {
                   const maxMonth = Math.max(...financials.monthlyChart.map((m: any) => m.total), 1);
                   const heightPct = Math.max(10, Math.round((monthData.total / maxMonth) * 100));
                   const isCurrentMonth = idx === 5; // The last array item is the current month
                   return (
                     <div key={idx} className={`w-1/6 rounded-t-sm transition-all group relative ${isCurrentMonth ? 'bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-sky-500/50 hover:bg-sky-500'}`} style={{ height: `${heightPct}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                           {monthData.total.toFixed(2)} €
                        </div>
                     </div>
                   );
                })}
             </div>
             <div className="flex justify-between w-full text-xs text-slate-500 mt-2 px-2">
               {financials.monthlyChart.map((monthData: any, idx: number) => (
                 <span key={idx} className={idx === 5 ? 'text-[#D4AF37] font-bold' : ''}>{monthData.label}</span>
               ))}
             </div>
          </div>
        </div>

        <div className="md:col-span-1 glass-card p-8 border border-slate-800 rounded-2xl flex flex-col">
          <h2 className="text-xl font-medium text-white mb-6">Répartition par pôle</h2>
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Chambres & Suites</span>
                <span className="text-white font-bold">{accomPct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: `${accomPct}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Restaurant & Bar</span>
                <span className="text-white font-bold">{diningPct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${diningPct}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Spa & Extras</span>
                <span className="text-white font-bold">{spaPct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${spaPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ---------------- NEW SHIFT TABLE FOR DIRECTOR ---------------- */}
      <div className="glass-card p-8 border border-slate-800 rounded-2xl mb-10">
         <h2 className="text-xl font-medium text-white mb-6 border-b border-slate-800 pb-2 flex justify-between items-center">
            <span>Rapports de Caisse (Clôtures Réception)</span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded text-slate-400">Total Espèces : {totalCashCollected.toFixed(2)} €</span>
         </h2>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
               <thead>
                  <tr className="border-b border-slate-800">
                     <th className="pb-3 px-4">Agent (Shift)</th>
                     <th className="pb-3 px-4">Ouverture</th>
                     <th className="pb-3 px-4">Clôture</th>
                     <th className="pb-3 px-4 text-right">Espèces Déclarées</th>
                     <th className="pb-3 px-4 text-right">Écart</th>
                  </tr>
               </thead>
               <tbody>
                  {shifts.map(shift => {
                    const theoretical = shift.initialCashFloat + shift.currentCashTotal;
                    const delta = (shift.actualCashCount || 0) - theoretical;
                    return (
                     <tr key={shift._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-4 font-bold text-white">{shift.agentName}</td>
                        <td className="py-4 px-4 text-slate-400">{new Date(shift.startTime).toLocaleString('fr-FR')}</td>
                        <td className="py-4 px-4 text-slate-400">{new Date(shift.endTime).toLocaleString('fr-FR')}</td>
                        <td className="py-4 px-4 text-right font-black text-amber-400">{(shift.actualCashCount || 0).toFixed(2)} €</td>
                        <td className={`py-4 px-4 text-right font-bold ${delta === 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                           {delta > 0 ? '+' : ''}{delta.toFixed(2)} €
                        </td>
                     </tr>
                    );
                  })}
                  {shifts.length === 0 && (
                     <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-600">Aucun rapport de caisse clôturé disponible.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
