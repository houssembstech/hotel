"use client";
import React, { useEffect, useState } from 'react';

export default function CashRegisterPage() {
  const [shift, setShift] = useState<any>(null);
  const [declaredCash, setDeclaredCash] = useState<number | ''>('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchShift = async () => {
     try {
       const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/shift');
       const data = await res.json();
       // Assuming Marc is connected and has the first open shift returned
       if (data.length > 0) {
          // just taking the first for MVP demo purposes
          setShift(data[0]); 
       } else {
          setShift(null);
       }
     } catch (e) {
       console.error(e);
     }
  };

  useEffect(() => {
     fetchShift();
  }, []);

  const handleStartShift = async (e: React.FormEvent) => {
     e.preventDefault();
     const initial = Number(declaredCash);
     if (isNaN(initial) || initial < 0) return;
     
     const currentUserData = localStorage.getItem('hotel_user');
     let currentAgent = 'System';
     if (currentUserData) {
        currentAgent = JSON.parse(currentUserData).name;
     }

     const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/shift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           agentName: currentAgent,
           initialCashFloat: initial,
           currentCashTotal: 0
        })
     });
     
     if (res.ok) {
        setDeclaredCash('');
        fetchShift();
     }
  };

  const theoretical = shift ? (Number(shift.initialCashFloat) + Number(shift.currentCashTotal)) : 0;
  const physical = declaredCash === '' ? 0 : Number(declaredCash);
  const delta = physical - theoretical;

  const handleCloseShift = async () => {
     if (!shift) return;
     
     if (declaredCash === '' || isNaN(physical) || physical < 0) {
        setErrorMsg("Saisissez le montant physique exact compté dans votre tiroir.");
        return;
     }

     if (delta !== 0) {
        if (!window.confirm(`Vous avez un écart de caisse de ${delta > 0 ? '+' : ''}${(delta).toFixed(2)} €. Ce rapport sera envoyé à la direction. Continuer ?`)) {
           return;
        }
     } else {
        if (!window.confirm('La caisse est juste ! Voulez-vous clôturer votre shift ?')) return;
     }

     // Close shift in database
     try {
       await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/shift/${shift._id}/close`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           actualCashCount: physical,
           signature: shift.agentName
         })
       });
     } catch (e) {
       console.error("Failed to close shift in DB", e);
     }
     
     // Generate Z-Report for PDF Download (Print)
     const printContent = `
        <html>
           <head>
              <title>Rapport Z - ${shift.agentName}</title>
              <style>
                 body { font-family: monospace; padding: 20px; line-height: 1.6; }
                 h2 { text-transform: uppercase; border-bottom: 2px dashed #000; padding-bottom: 10px; }
                 .total { font-weight: bold; font-size: 1.2em; border-top: 1px dashed #000; padding-top: 10px; margin-top: 10px; }
                 .gap { color: ${delta === 0 ? 'black' : delta > 0 ? 'green' : 'red'}; }
              </style>
           </head>
           <body>
              <h2>Rapport Z - Clôture de Caisse</h2>
              <p><strong>Agent :</strong> ${shift.agentName}</p>
              <p><strong>Ouverture :</strong> ${new Date(shift.startTime).toLocaleString('fr-FR')}</p>
              <p><strong>Fermeture :</strong> ${new Date().toLocaleString('fr-FR')}</p>
              <br/>
              <p>Fond de caisse initial : ${shift.initialCashFloat.toFixed(2)} €</p>
              <p>Paiements espèces perçus : + ${shift.currentCashTotal.toFixed(2)} €</p>
              <p class="total">Total Attendu (Système) : ${theoretical.toFixed(2)} €</p>
              <p class="total">Total Déclaré (Physique) : ${physical.toFixed(2)} €</p>
              <p class="total gap">Écart Constaté : ${delta > 0 ? '+' : ''}${delta.toFixed(2)} €</p>
              <br/><br/><br/>
              <p>Signature de l'agent :</p>
              <p>_______________________</p>
           </body>
        </html>
     `;
     const printWindow = window.open('', '', 'width=600,height=800');
     if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
     }

     // For this MVP, we can simulate the closure by emptying the visual state
     setShift(null);
     setDeclaredCash('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Tiroir-Caisse & Shift (Relève)</h1>
          <p className="text-slate-400">Responsabilité financière : gérez vos encaissements d'espèces et vos écarts.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
         {!shift ? (
            <div className="glass-card bg-slate-900 border border-slate-800 p-10 rounded-3xl text-center shadow-xl">
               <span className="text-6xl mb-6 block opacity-50">🔐</span>
               <h2 className="text-2xl font-serif text-white mb-2">Ouvrir un Nouveau Shift</h2>
               <p className="text-slate-400 mb-8">Avant de pouvoir encaisser les Check-ins, déclarez votre fond de caisse (monnaie).</p>
               
               <form onSubmit={handleStartShift} className="max-w-sm mx-auto space-y-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-bold">Fond de caisse initial (Espèces)</label>
                    <div className="relative">
                       <input autoFocus required type="number" min="0" step="1" value={declaredCash} onChange={e => setDeclaredCash(Number(e.target.value))} className="w-full bg-slate-800 border-2 border-slate-700 focus:border-sky-500 rounded-xl px-12 py-4 text-center text-white text-2xl font-bold" placeholder="0.00" />
                       <span className="absolute left-6 top-5 text-slate-500 text-xl font-bold border-r border-slate-700 pr-4">€</span>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 text-lg font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all">
                     Ouvrir le Shift
                  </button>
               </form>
            </div>
         ) : (
            <div className="glass-card bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
               <div className="p-8 bg-sky-500/10 border-b border-sky-500/20 flex justify-between items-center">
                  <div>
                     <span className="text-sky-400 text-[10px] font-bold tracking-widest uppercase mb-1 block">Session V2 Active</span>
                     <h2 className="text-2xl font-serif text-white">Caisse de {shift.agentName}</h2>
                     <p className="text-slate-400 text-sm">Ouverte le {new Date(shift.startTime).toLocaleString('fr-FR')}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-black animate-pulse shadow-[0_0_15px_rgba(14,165,233,0.4)]">
                     ON
                  </div>
               </div>

               <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">Rapport Théorique (Système)</h3>
                     
                     <div className="flex justify-between items-center">
                        <span className="text-slate-400">Fond de caisse (Initial)</span>
                        <span className="text-white font-bold">{shift.initialCashFloat.toFixed(2)} €</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-400">Paiements Perçus (CASH)</span>
                        <span className="text-emerald-400 font-bold">+ {shift.currentCashTotal.toFixed(2)} €</span>
                     </div>
                     
                     <div className="pt-4 border-t border-slate-800 flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                        <span className="text-white font-bold uppercase tracking-wider text-sm">Total Espèces Attendu :</span>
                        <span className="text-sky-400 font-black text-2xl">{theoretical.toFixed(2)} €</span>
                     </div>
                  </div>

                  <div className="space-y-6 md:border-l border-slate-800 md:pl-10">
                     <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2 flex justify-between items-center">
                       <span>Clôture (Relève)</span>
                       {errorMsg && <span className="text-red-500 text-[10px]">{errorMsg}</span>}
                     </h3>

                     <div>
                        <label className="block text-xs text-slate-400 mb-2">Montant Physique Compté (Tiroir) :</label>
                        <div className="relative mb-6">
                           <input type="number" step="0.01" value={declaredCash} onChange={e => {setDeclaredCash(e.target.value === '' ? '' : Number(e.target.value)); setErrorMsg('');}} className="w-full bg-slate-800 border-2 border-slate-700 focus:border-amber-500 rounded-xl px-12 py-3 text-white text-xl font-bold" placeholder="0.00" />
                           <span className="absolute left-4 top-3 text-slate-500 text-xl border-r border-slate-700 pr-3">€</span>
                        </div>

                        {declaredCash !== '' && !isNaN(Number(declaredCash)) && (
                           <div className={`p-4 rounded-xl border mb-6 text-center ${delta === 0 ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : delta > 0 ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
                              <span className="block mb-1">
                                {delta === 0 ? 'Caisse Juste :' : delta > 0 ? 'Excédent de Caisse (Trop perçu) :' : 'Déficit de Caisse (Manquant) :'}
                              </span>
                              <span className="font-bold block text-xl">
                                {delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)} €
                              </span>
                           </div>
                        )}

                        <button onClick={handleCloseShift} className="w-full bg-slate-100 hover:bg-white text-slate-950 font-black py-4 rounded-xl transition-all shadow-lg uppercase tracking-widest">
                           Imprimer Z & Clôturer
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
