"use client";
import React, { useEffect, useState } from 'react';

export default function CheckOutPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [folio, setFolio] = useState<any>(null);
  
  const [paymentData, setPaymentData] = useState({
     amountPaidNow: 0,
     paymentMethod: 'CARD', // Different standard for checkout (cards usually)
     shiftCashDrawerId: '65f600000000000000000001',
     agentName: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOccupiedRooms = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data.filter((r: any) => r.status === 'OCCUPIED')));
  };

  useEffect(() => {
    const usr = localStorage.getItem('hotel_user');
    if (usr) {
       const parsed = JSON.parse(usr);
       setPaymentData(p => ({ ...p, agentName: parsed.name }));
    }
    fetchOccupiedRooms();
  }, []);

  const handleSelectRoom = async (room: any) => {
     setErrorMsg('');
     setSelectedRoom(room);
     setFolio(null);
     
     try {
       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/folios/room/${room._id}`);
       const result = await res.json();
       
       if (!res.ok) {
          setErrorMsg(result.error || "Folio introuvable.");
          return;
       }
       
       setFolio(result);
       
       // Calculate remaining balance to prepopulate payment
       const totalCharges = result.items.reduce((sum: number, item: any) => sum + item.amount, 0);
       const totalPayments = result.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
       const balance = totalCharges - totalPayments;
       
       setPaymentData(prev => ({ ...prev, amountPaidNow: balance > 0 ? balance : 0 }));

     } catch (e) {
       setErrorMsg("Erreur réseau de récupération du Folio.");
     }
  };

  const calculateBalance = () => {
     if (!folio) return { charges: 0, paid: 0, balance: 0 };
     const charges = folio.items.reduce((sum: number, item: any) => sum + item.amount, 0);
     const paid = folio.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
     return { charges, paid, balance: charges - paid };
  };

  const handleCheckout = async () => {
     setLoading(true);
     setErrorMsg('');
     try {
       const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/check-out', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             folioId: folio._id,
             payment: paymentData
          })
       });
       
       const result = await res.json();
       if (!res.ok) {
          setErrorMsg(result.error || "Checkout refusé.");
          setLoading(false);
          return;
       }
       
       alert(result.message);
       setSelectedRoom(null);
       setFolio(null);
       fetchOccupiedRooms();
       
     } catch (e) {
       setErrorMsg("Erreur critique serveur.");
     } finally {
       setLoading(false);
     }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Check-out & Facturation</h1>
          <p className="text-slate-400">Départ des résidents, régularisation du folio et bascule au statut "À nettoyer".</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Target Room Selection */}
        <div className="lg:col-span-1 border-r border-slate-800 pr-0 lg:pr-8">
           <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Sélection du Départ</h2>
           {rooms.length === 0 ? (
              <div className="text-slate-500 text-sm p-4 bg-slate-900/50 rounded-xl border border-slate-800">Aucune chambre occupée !</div>
           ) : (
              <div className="space-y-3">
                 {rooms.map(room => (
                    <div 
                      key={room._id} 
                      onClick={() => handleSelectRoom(room)}
                      className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${selectedRoom?._id === room._id ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
                    >
                       <div>
                          <p className={`font-bold text-lg ${selectedRoom?._id === room._id ? 'text-amber-400' : 'text-white'}`}>{room.roomNumber}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">{room.type}</p>
                       </div>
                       <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></span>
                    </div>
                 ))}
              </div>
           )}
        </div>

        {/* Right Col: Folio Rendering */}
        <div className="lg:col-span-2">
           {errorMsg && (
             <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 font-bold">{errorMsg}</div>
           )}

           {!selectedRoom && !errorMsg && (
             <div className="h-full flex flex-col items-center justify-center text-slate-500 glass-card bg-slate-900/30 rounded-3xl border border-slate-800 p-10">
                <span className="text-6xl mb-4 opacity-50">🧾</span>
                <p>Sélectionnez une chambre pour éditer son Folio</p>
             </div>
           )}

           {folio && (
              <div className="glass-card bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col h-full shadow-2xl">
                 <div className="p-6 bg-slate-800/50 border-b border-slate-800 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1 block">Folio Actif</span>
                      <h2 className="text-2xl font-serif text-white">{folio.guestName}</h2>
                      <p className="text-sm text-slate-400">Chambre {selectedRoom?.roomNumber} • Date d'édition: {new Date().toLocaleDateString('fr-FR')}</p>
                    </div>
                 </div>

                 <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    {/* Consommation */}
                    <div>
                       <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Lignes de Facturation</h3>
                       <table className="w-full text-left text-sm border-collapse">
                          <thead>
                             <tr className="text-slate-500 border-b border-slate-800">
                               <th className="pb-2 font-medium">Description</th>
                               <th className="pb-2 font-medium text-right">Montant</th>
                             </tr>
                          </thead>
                          <tbody className="text-slate-200">
                             {folio.items.map((item: any) => (
                                <tr key={item._id} className="border-b border-slate-800/30">
                                   <td className="py-3 flex flex-col">
                                      <span>{item.label}</span>
                                      <span className="text-[10px] text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
                                   </td>
                                   <td className="py-3 text-right">{(item.amount).toFixed(2)} €</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>

                    {/* Paiements existants */}
                    <div>
                       <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Paiements Reçus (Acomptes)</h3>
                       {folio.payments.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">Aucun acompte versé.</p>
                       ) : (
                          <div className="space-y-2">
                             {folio.payments.map((p: any) => (
                                <div key={p._id} className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg flex justify-between items-center">
                                   <div>
                                      <span className="text-xs text-emerald-400 font-bold block">{p.method} (Via {p.agentName})</span>
                                      <span className="text-[10px] text-slate-400">{new Date(p.date).toLocaleString()}</span>
                                   </div>
                                   <span className="text-emerald-400 font-bold">- {p.amount.toFixed(2)} €</span>
                                </div>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="p-6 bg-slate-950 border-t border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-slate-400 text-lg uppercase tracking-widest font-bold">Reste à Payer</span>
                       <span className={`text-4xl font-black ${calculateBalance().balance <= 0 ? 'text-emerald-400' : 'text-amber-500'}`}>
                          {calculateBalance().balance.toFixed(2)} €
                       </span>
                    </div>

                    {calculateBalance().balance > 0 && (
                       <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6">
                           <label className="block text-xs font-bold text-slate-400 mb-2">Montant du Paiement Final</label>
                           <div className="flex gap-4">
                              <input type="number" step="0.01" min="0" value={paymentData.amountPaidNow} onChange={e => setPaymentData({...paymentData, amountPaidNow: Number(e.target.value)})} className="w-1/3 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-bold focus:outline-none focus:border-amber-500" />
                              <div className="flex-1 flex gap-2">
                                 {['CASH', 'CARD'].map(method => (
                                    <button 
                                      key={method} type="button"
                                      onClick={() => setPaymentData({...paymentData, paymentMethod: method})}
                                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${paymentData.paymentMethod === method ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                      {method}
                                    </button>
                                 ))}
                              </div>
                           </div>
                       </div>
                    )}

                    <button onClick={handleCheckout} disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-lg font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50">
                       {loading ? 'Fermeture Folio...' : 'Clôturer le Séjour & Libérer la Chambre'}
                    </button>
                 </div>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}
