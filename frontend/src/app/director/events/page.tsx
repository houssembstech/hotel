import React from 'react';

export default function DirectorEventsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Salles & Événementiel</h1>
          <p className="text-slate-400">Gérez les réservations et la configuration des salles de conférence, mariages et réunions.</p>
        </div>
        <button className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg">
          + Nouvelle Salle
        </button>
      </div>
      <div className="glass-card p-8 border border-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
         <span className="text-6xl mb-4 text-slate-700">🗓️</span>
         <h2 className="text-xl text-white font-serif mb-2">Planning Événementiel en construction</h2>
         <p className="text-slate-400 max-w-md text-center">L'affichage interactif du calendrier de disponibilité des salles sera intégré ici pour prévenir les chevauchements d'événements.</p>
      </div>
    </div>
  );
}
