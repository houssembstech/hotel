"use client";
import React, { useEffect, useState, useRef } from 'react';

export default function CheckInPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    bookingId: '',
    guestData: { fullName: '', email: '', phone: '', identityType: 'PASSPORT', identityNumber: '', identityDocumentUrl: '' },
    stayDetails: { checkInDate: '', checkOutDate: '', adults: 1, children: 0 },
    payment: { amountPaidNow: 0, paymentMethod: 'CASH', shiftCashDrawerId: '65f600000000000000000001', agentName: '' }
  });

  const [agentName, setAgentName] = useState('System');

  useEffect(() => {
    const usr = localStorage.getItem('hotel_user');
    if (usr) {
       const parsed = JSON.parse(usr);
       setAgentName(parsed.name);
       setFormData(p => ({
         ...p,
         payment: { ...p.payment, agentName: parsed.name }
       }));
    }
    fetchRooms();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRooms = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data.filter((r: any) => r.status === 'AVAILABLE' || r.status === 'CLEANING_NEEDED')));
  };

  const handleLockAndStartCheckIn = async (room: any) => {
    setErrorMsg("");
    
    // Soft-Lock the room on the backend
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/rooms/${room._id}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName })
      });
      
      const result = await res.json();
      if (!res.ok) {
         setErrorMsg(result.error || "Impossible de verrouiller la chambre.");
         return;
      }
      
      // Successfully locked
      setSelectedRoom(room);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setFormData(prev => ({
        ...prev,
        stayDetails: {
           ...prev.stayDetails,
           checkInDate: today.toISOString().slice(0, 16),
           checkOutDate: tomorrow.toISOString().slice(0, 16)
        }
      }));
      setShowModal(true);
      
    } catch (e) {
      setErrorMsg("Erreur réseau");
    }
  };

  const cancelCheckIn = async () => {
    if (selectedRoom) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/rooms/${selectedRoom._id}/unlock`, { method: 'DELETE' });
    }
    setShowModal(false);
    setSelectedRoom(null);
    fetchRooms();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const data = new FormData();
    data.append('photo', e.target.files[0]);
    data.append('type', 'identity');

    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload', {
         method: 'POST', body: data
      });
      const result = await res.json();
      if (result.url) {
         setFormData(prev => ({ ...prev, guestData: { ...prev.guestData, identityDocumentUrl: result.url } }));
      }
    } catch (err) {} finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
         roomId: selectedRoom._id,
         ...formData
      };
      
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/check-in', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (!res.ok) {
         setErrorMsg(result.error || "Erreur durant le Check-in");
         return;
      }
      
      alert(result.message);
      setShowModal(false);
      setSelectedRoom(null);
      fetchRooms(); // refresh available rooms
      
    } catch (e) {
       setErrorMsg("Erreur critique.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Check-in Express (Arrivées)</h1>
          <p className="text-slate-400">Attribution atomique de chambres, scan de pièces d'identité et encaissements liés au coffre.</p>
        </div>
      </div>

      {errorMsg && (
         <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 font-bold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="text-white">X</button>
         </div>
      )}

      {/* Room Selection Grid (Only show available rooms to prevent clutter) */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 mb-8">
        <h2 className="text-lg font-serif text-white mb-1">Étape 1 : Choisir une chambre libre</h2>
        <p className="text-xs text-slate-500 mb-6">Les chambres ci-dessous sont physiquement prêtes (ou nettoyées) à recevoir un voyageur.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {rooms.map(room => {
             const isLocked = room.currentLock && room.currentLock.expiresAt && new Date(room.currentLock.expiresAt) > new Date();
             
             return (
               <div 
                 key={room._id} 
                 onClick={() => !isLocked && handleLockAndStartCheckIn(room)}
                 className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all relative ${isLocked ? 'bg-slate-900 border-red-900/50 cursor-not-allowed opacity-60' : 'bg-slate-800/50 border-emerald-500/50 cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}
               >
                 {isLocked && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl">VERROUILLÉ</div>
                 )}
                 <h3 className="text-xl font-bold text-white mb-1">{room.roomNumber}</h3>
                 <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-3">{room.type}</span>
                 
                 <div className="text-xs text-slate-300 bg-slate-900/50 px-2 py-1 rounded w-full border border-slate-700 font-medium">
                    {room.pricePerNight} € / nuit
                 </div>
                 
                 {isLocked && (
                    <p className="text-[9px] text-red-400 mt-2">Par: {room.currentLock.agentName}</p>
                 )}
               </div>
             )
          })}
          {rooms.length === 0 && <span className="text-slate-500">Aucune chambre disponible actuellement.</span>}
        </div>
      </div>

      {showModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card bg-slate-900 p-8 rounded-3xl w-full max-w-4xl border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)] max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-white">
                  Check-in : Chambre <span className="text-emerald-400">{selectedRoom.roomNumber}</span>
                </h2>
                <div className="bg-emerald-500/10 border border-emerald-500/50 px-3 py-1 rounded text-emerald-400 text-xs font-bold animate-pulse">
                  Verrouillée (3 min)
                </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Left Side: Guest Info */}
                   <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Identité Client (Walk-in)</h3>
                      <div>
                        <input required type="text" value={formData.guestData.fullName} onChange={e => setFormData(p => ({...p, guestData: {...p.guestData, fullName: e.target.value}}))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" placeholder="Nom Complet" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="email" value={formData.guestData.email} onChange={e => setFormData(p => ({...p, guestData: {...p.guestData, email: e.target.value}}))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" placeholder="Email (Folio pdf)" />
                        <input type="text" value={formData.guestData.phone} onChange={e => setFormData(p => ({...p, guestData: {...p.guestData, phone: e.target.value}}))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" placeholder="Téléphone" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                         <div className="col-span-1">
                            <select value={formData.guestData.identityType} onChange={e => setFormData(p => ({...p, guestData: {...p.guestData, identityType: e.target.value}}))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
                               <option value="PASSPORT">Passeport</option>
                               <option value="CIN">C.I.N</option>
                               <option value="PERMIS">Permis de Conduire</option>
                            </select>
                         </div>
                         <div className="col-span-2">
                            <input required type="text" value={formData.guestData.identityNumber} onChange={e => setFormData(p => ({...p, guestData: {...p.guestData, identityNumber: e.target.value}}))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-mono tracking-widest uppercase" placeholder="Numéro du document" />
                         </div>
                      </div>
                      
                      <div>
                         <p className="text-xs text-slate-400 mb-2">Scan Pièce d'Identité (Obligatoire)</p>
                         {formData.guestData.identityDocumentUrl ? (
                            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-emerald-500 group">
                               <img src={formData.guestData.identityDocumentUrl} alt="ID" className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button type="button" onClick={() => setFormData(p => ({...p, guestData: {...p.guestData, identityDocumentUrl: ''}}))} className="text-white bg-red-500 px-3 py-1 rounded text-xs">Supprimer</button>
                               </div>
                            </div>
                         ) : (
                            <div onClick={() => fileInputRef.current?.click()} className={`w-full h-24 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 ${uploading ? 'opacity-50' : ''}`}>
                               <span className="text-xl mb-1">🛂</span>
                               <span className="text-xs text-slate-400">{uploading ? 'Upload...' : 'Capturer ou Uploader le Passeport'}</span>
                            </div>
                         )}
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </div>
                   </div>

                   {/* Right Side: Stay & Payment */}
                   <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Séjour & Paiement</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">Check-in Prévu</label>
                          <input required type="datetime-local" value={formData.stayDetails.checkInDate} onChange={e => setFormData(p => ({...p, stayDetails: {...p.stayDetails, checkInDate: e.target.value}}))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-white text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">Check-out Prévu</label>
                          <input required type="datetime-local" value={formData.stayDetails.checkOutDate} onChange={e => setFormData(p => ({...p, stayDetails: {...p.stayDetails, checkOutDate: e.target.value}}))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-white text-sm" />
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mt-4">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-slate-300">Total Est. Nuitées</span>
                            <span className="text-lg font-bold text-white">À calculer €</span>
                         </div>
                         
                         <label className="block text-xs font-bold text-emerald-400 mb-2">Acompte / Encaissement Immédiat (€)</label>
                         <input type="number" min="0" value={formData.payment.amountPaidNow} onChange={e => setFormData(p => ({...p, payment: {...p.payment, amountPaidNow: Number(e.target.value)}}))} className="w-full bg-slate-800 border-2 border-emerald-500/50 rounded-lg px-4 py-3 text-emerald-400 font-bold text-xl mb-4 focus:outline-none" />

                         <label className="block text-xs font-bold text-slate-400 mb-2">Mode de paiement</label>
                         <div className="flex gap-2">
                            {['CASH', 'CARD', 'BANK_TRANSFER'].map(method => (
                               <button 
                                 key={method} type="button"
                                 onClick={() => setFormData(p => ({...p, payment: {...p.payment, paymentMethod: method}}))}
                                 className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.payment.paymentMethod === method ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                               >
                                 {method}
                               </button>
                            ))}
                         </div>
                         {formData.payment.paymentMethod === 'CASH' && (
                            <p className="text-[10px] text-amber-500 mt-2 font-bold text-center">💸 Sera perçu dans la caisse de : {formData.payment.agentName}</p>
                         )}
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-800">
                   <button type="button" onClick={cancelCheckIn} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-medium transition-colors">
                     Annuler le Lock
                   </button>
                   <button type="submit" disabled={uploading || formData.guestData.identityDocumentUrl === ''} className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-lg font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center justify-center gap-3">
                     Valider le Check-in Officiel
                     {formData.guestData.identityDocumentUrl === '' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full ml-2">ID Manquant</span>}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
