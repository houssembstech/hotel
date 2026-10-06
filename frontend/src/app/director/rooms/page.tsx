import React from 'react';

export default function SuitesManagementPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Gestion de l'Hébergement</h1>
          <p className="text-slate-400">Inventaire du parc, création des chambres et gestion de maintenance technique.</p>
        </div>
        <button className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg">
          + Ajouter une Chambre
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mb-8">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex gap-4">
          <input type="text" placeholder="Rechercher par Numéro (ex: 304)..." className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37] w-1/3" />
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none">
            <option>Toutes Catégories</option>
            <option>Suite Présidentielle</option>
            <option>Deluxe Vue Mer</option>
            <option>Standard</option>
          </select>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none">
            <option>Tous Statuts</option>
            <option>Opérationnel</option>
            <option>En Maintenance</option>
          </select>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 text-sm bg-slate-900/30">
              <th className="font-medium pb-4 pt-4 pl-6">Chambre</th>
              <th className="font-medium pb-4 pt-4">Catégorie</th>
              <th className="font-medium pb-4 pt-4">Capacité (Lits)</th>
              <th className="font-medium pb-4 pt-4">Statut Technique</th>
              <th className="font-medium pb-4 pt-4 text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-200">
            <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 opacity-60">
              <td className="py-4 pl-6 font-medium font-mono text-xl">101</td>
              <td className="py-4">Standard</td>
              <td className="py-4">2 (Double)</td>
              <td className="py-4"><span className="bg-red-900/50 text-red-400 border border-red-800 px-2 py-1 rounded text-xs">🛠️ Rénovation (Jusqu'au 20 Oct)</span></td>
              <td className="py-4 text-right pr-6"><button className="text-sky-400 text-sm font-medium">Modifier</button></td>
            </tr>
            <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
              <td className="py-4 pl-6 font-medium font-mono text-xl text-[#D4AF37]">304</td>
              <td className="py-4">Deluxe Vue Mer</td>
              <td className="py-4">3 (1 Double, 1 Simple)</td>
              <td className="py-4"><span className="bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-2 py-1 rounded text-xs">Opérationnel</span></td>
              <td className="py-4 text-right pr-6"><button className="text-sky-400 text-sm font-medium">Modifier</button></td>
            </tr>
            <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
              <td className="py-4 pl-6 font-medium font-mono text-xl text-purple-400">400</td>
              <td className="py-4">Suite Présidentielle</td>
              <td className="py-4">4 (2 King Size)</td>
              <td className="py-4"><span className="bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-2 py-1 rounded text-xs">Opérationnel</span></td>
              <td className="py-4 text-right pr-6"><button className="text-sky-400 text-sm font-medium">Modifier</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
