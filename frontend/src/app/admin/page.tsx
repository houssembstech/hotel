"use client";
import React, { useEffect, useState } from 'react';

export default function SuperAdminFinancePage() {
  const [stats, setStats] = useState({ hotels: 0, users: 4, status: 'Healthy', uptime: 1000 });
  const [shifts, setShifts] = useState<any[]>([]);
  const [financials, setFinancials] = useState({
     revenue: { total: 0, accommodation: 0, dining: 0, spa: 0 },
     payments: { cash: 0, card: 0, bank: 0 }
  });

  useEffect(() => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/financials')
      .then(res => res.json())
      .then(data => {
         if (data.revenue) {
            setFinancials({ revenue: data.revenue, payments: data.payments });
            setShifts(data.shifts || []);
         }
      })
      .catch(console.error);
  }, []);

  const totalCashCollected = shifts.reduce((acc, current) => acc + (current.actualCashCount || 0), 0);
  
  // To avoid divide by zero errors
  const totalRev = financials.revenue.total || 1;
  const accomPct = Math.round((financials.revenue.accommodation / totalRev) * 100);
  const diningPct = Math.round((financials.revenue.dining / totalRev) * 100);
  const spaPct = Math.round((financials.revenue.spa / totalRev) * 100);
  
  const totalPay = (financials.payments.cash + financials.payments.card + financials.payments.bank) || 1;
  const cardPct = Math.round((financials.payments.card / totalPay) * 100);
  const cashPct = Math.round((financials.payments.cash / totalPay) * 100);
  const bankPct = Math.round((financials.payments.bank / totalPay) * 100);

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
          <p className="text-slate-400 text-sm font-medium mb-1">Chiffre d'Affaires Total (Généré)</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white">${financials.revenue.total.toFixed(2)}</h2>
            <span className="text-emerald-400 font-bold text-sm">Validé</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-emerald-500 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Paiements Réels (Perçus)</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white text-emerald-400">
               ${(financials.payments.cash + financials.payments.card + financials.payments.bank).toFixed(2)}
            </h2>
            <span className="text-emerald-500 font-bold text-sm">En trésorerie</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-sky-500 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Passif / Créances (À recouvrir)</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white text-rose-400">
               ${Math.max(0, financials.revenue.total - (financials.payments.cash + financials.payments.card + financials.payments.bank)).toFixed(2)}
            </h2>
            <span className="text-slate-500 font-bold text-sm">En attente</span>
          </div>
        </div>
        <div className="glass-card p-6 border-b-4 border-purple-500 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Processus de Relève (Shifts)</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-serif text-white">{shifts.length}</h2>
            <span className="text-slate-500 font-bold text-sm">Caisses Clôturées</span>
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
                <span className="text-white font-bold">${financials.revenue.accommodation.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-[#D4AF37] h-3 rounded-full" style={{ width: `${accomPct}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Restaurant & Room Service</span>
                <span className="text-white font-bold">${financials.revenue.dining.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-sky-500 h-3 rounded-full" style={{ width: `${diningPct}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Spa & Wellness Extras</span>
                <span className="text-white font-bold">${financials.revenue.spa.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${spaPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 border border-slate-800 rounded-2xl">
          <h2 className="text-xl font-medium text-white mb-6 border-b border-slate-800 pb-2">Payment Methods Breakdown</h2>
          <div className="flex items-center justify-around h-full pb-8">
            <div className="text-center">
               <div className="w-24 h-24 rounded-full border-8 border-sky-500 flex items-center justify-center mx-auto mb-4">
                 <span className="text-sky-400 font-bold">{cardPct}%</span>
               </div>
               <span className="text-slate-300 block">Credit Card</span>
               <span className="text-slate-500 text-sm">${financials.payments.card.toFixed(2)}</span>
            </div>
            <div className="text-center">
               <div className="w-24 h-24 rounded-full border-8 border-amber-500 flex items-center justify-center mx-auto mb-4 bg-amber-500/10">
                 <span className="text-amber-400 font-bold">Real✅</span>
               </div>
               <span className="text-slate-300 block mt-2 text-amber-500">Cash (Tiroir)</span>
               <span className="text-slate-500 text-sm font-bold">${totalCashCollected.toFixed(2)}</span>
            </div>
            <div className="text-center">
               <div className="w-24 h-24 rounded-full border-8 border-purple-500 flex items-center justify-center mx-auto mb-4">
                 <span className="text-purple-400 font-bold">{bankPct}%</span>
               </div>
               <span className="text-slate-300 block">Bank Transfer</span>
               <span className="text-slate-500 text-sm">${financials.payments.bank.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* ---------------- NEW SHIFT TABLE FOR DIRECTOR ---------------- */}
      <div className="glass-card p-8 border border-slate-800 rounded-2xl mb-10">
         <h2 className="text-xl font-medium text-white mb-6 border-b border-slate-800 pb-2 flex justify-between items-center">
            <span>Rapports de Caisse (Clôtures Réception)</span>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded text-slate-400">Total Espèces Sécurisées : {totalCashCollected.toFixed(2)} €</span>
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
