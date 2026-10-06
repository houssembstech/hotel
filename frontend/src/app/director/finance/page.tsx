import React from 'react';

export default function DirectorFinancePage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Modes de Paiement & Caisses</h1>
          <p className="text-slate-400">Paramétrage Stripe, terminaux TPE, et suivi de clôture de caisse du personnel.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 border border-sky-500/30 rounded-2xl">
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
           <p className="text-slate-400">Les rapports de clôture soumis par les réceptionnistes apparaîtront ici pour contrôle des écarts.</p>
        </div>
      </div>
    </div>
  );
}
