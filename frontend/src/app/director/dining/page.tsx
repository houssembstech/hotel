import React from 'react';

export default function DirectorDiningPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Restauration & Room-Service</h1>
          <p className="text-slate-400">Cartes des menus, formules pension et gestion dynamique des stocks du restaurant.</p>
        </div>
        <button className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg">
          + Ajouter un Plat/Formule
        </button>
      </div>
      <div className="glass-card p-8 border border-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
         <span className="text-6xl mb-4 text-slate-700">🍽️</span>
         <h2 className="text-xl text-white font-serif mb-2">Module Menu & Formules en cours d'assemblage</h2>
         <p className="text-slate-400 max-w-md text-center">Vous gérerez ici les repas à la carte, les allergènes, les prix et les options All-Inclusive.</p>
      </div>
    </div>
  );
}
