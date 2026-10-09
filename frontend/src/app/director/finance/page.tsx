"use client";
import React, { useEffect, useState } from 'react';

export default function DirectorFinancePage() {
  const [shifts, setShifts] = useState<any[]>([]);

  useEffect(() => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/financials')
      .then(res => res.json())
      .then(data => {
         if (data.shifts) {
            setShifts(data.shifts);
         }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Modes de Paiement & Caisses</h1>
          <p className="text-slate-400">Paramétrage Stripe, terminaux TPE, et suivi de clôture de caisse du personnel.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card p-8 border border-sky-500/30 rounded-2xl h-fit">
           <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-2"><span className="text-2xl">💳</span> Passerelles de Paiement</h2>
           <div className="space-y-4">
             <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex justify-between items-center">
               <div>
                  <h4 className="text-white font-bold">Stripe Integration</h4>
                  <p className="text-sm text-slate-400">Carte Bancaire (En ligne)</p>
               </div>
               <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded text-xs">Connecté</span>
             </div>
           </div>
        </div>
        <div className="glass-card p-8 border border-amber-500/30 rounded-2xl">
           <h2 className="text-xl text-white font-serif mb-4 flex items-center gap-2"><span className="text-2xl">💶</span> Clôtures de Caisses</h2>
           <p className="text-slate-400 mb-6">Les rapports de clôture soumis par les réceptionnistes apparaissent ici pour contrôle des écarts.</p>
           
           <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
               <thead>
                  <tr className="border-b border-slate-700">
                     <th className="pb-3 px-2">Agent</th>
                     <th className="pb-3 px-2">Date (Clôture)</th>
                     <th className="pb-3 px-2 text-right">Espèces</th>
                     <th className="pb-3 px-2 text-right">Écart</th>
                  </tr>
               </thead>
               <tbody>
                  {shifts.map(shift => {
                    const theoretical = shift.initialCashFloat + shift.currentCashTotal;
                    const delta = (shift.actualCashCount || 0) - theoretical;
                    return (
                     <tr key={shift._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-2 font-bold text-white">{shift.agentName}</td>
                        <td className="py-4 px-2 text-slate-400">{new Date(shift.endTime).toLocaleString('fr-FR')}</td>
                        <td className="py-4 px-2 text-right font-black text-amber-400">{(shift.actualCashCount || 0).toFixed(2)} €</td>
                        <td className={`py-4 px-2 text-right font-bold ${delta === 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                           {delta > 0 ? '+' : ''}{delta.toFixed(2)} €
                        </td>
                     </tr>
                    );
                  })}
                  {shifts.length === 0 && (
                     <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-600">Aucun rapport de caisse disponible.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
        </div>
      </div>
    </div>
  );
}
