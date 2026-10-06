import React from 'react';

export default function DirectorDashboardPage() {
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
          <h3 className="text-slate-400 font-medium mb-1">CA Encaissé (Aujourd'hui)</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl text-white font-bold">14,250 €</span>
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
        <div className="glass-card p-6 border-b-4 border-purple-500">
          <h3 className="text-slate-400 font-medium mb-1">RevPAR (Revenu/Chambre)</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl text-white font-bold">215 €</span>
            <span className="text-slate-500 font-bold px-2 py-1 bg-slate-800 rounded text-sm">Stable</span>
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
             {/* Fake Chart Bars */}
             <div className="flex justify-between items-end h-full w-full opacity-80">
                <div className="w-1/12 bg-sky-500 rounded-t-sm h-[40%]" title="Jan"></div>
                <div className="w-1/12 bg-sky-500 rounded-t-sm h-[60%]" title="Fev"></div>
                <div className="w-1/12 bg-sky-500 rounded-t-sm h-[55%]" title="Mar"></div>
                <div className="w-1/12 bg-[#D4AF37] rounded-t-sm h-[80%] shadow-[0_0_15px_rgba(212,175,55,0.4)]" title="Avr"></div>
                <div className="w-1/12 bg-sky-500/50 rounded-t-sm h-[30%]" title="Mai"></div>
                <div className="w-1/12 bg-sky-500/50 rounded-t-sm h-[45%]" title="Juin"></div>
             </div>
             <div className="flex justify-between w-full text-xs text-slate-500 mt-2">
               <span>Jan</span><span>Fev</span><span>Mar</span><span className="text-[#D4AF37] font-bold">Avr</span><span>Mai</span><span>Juin</span>
             </div>
          </div>
        </div>

        <div className="md:col-span-1 glass-card p-8 border border-slate-800 rounded-2xl flex flex-col">
          <h2 className="text-xl font-medium text-white mb-6">Répartition par pôle</h2>
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Chambres & Suites</span>
                <span className="text-white font-bold">65%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Restaurant & Bar</span>
                <span className="text-white font-bold">18%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-sky-500 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Salles (Événements)</span>
                <span className="text-white font-bold">12%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Spa & Extras</span>
                <span className="text-white font-bold">5%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
