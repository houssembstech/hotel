import React from 'react';

export default function DirectorServicesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Services Additionnels & Frais</h1>
          <p className="text-slate-400">Catalogue des extras (Spa, navette) et paramétrage des taxes et pénalités.</p>
        </div>
      </div>
      <div className="glass-card p-8 border border-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
         <span className="text-6xl mb-4 text-slate-700">🛎️</span>
         <h2 className="text-xl text-white font-serif mb-2">Centre des Politiques Tarifaires</h2>
         <p className="text-slate-400 max-w-md text-center">Cette section servira à configurer les montants pour les late-checkout, early-checkin, et les pénalités d'annulation.</p>
      </div>
    </div>
  );
}
