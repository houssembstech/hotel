"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EventCalendarPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    eventRoomId: '',
    clientName: '',
    eventName: '',
    startDate: '',
    endDate: '',
    billingType: 'FULL_DAY',
    totalPrice: 0,
    color: '#38bdf8'
  });

  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  });

  const fetchData = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/events')
      .then(res => res.json())
      .then(data => {
         setRooms(data);
         if (data.length > 0) setFormData(prev => ({ ...prev, eventRoomId: data[0]._id }));
      });
      
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/events/bookings')
      .then(res => res.json())
      .then(data => setBookings(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); // reset standard

    const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/events/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await res.json();
    
    if (!res.ok) {
       setErrorMsg(result.error || "Une erreur est survenue.");
       return;
    }

    setShowModal(false);
    fetchData();
  };

  const handleDeleteBooking = async (id: string) => {
    if(!window.confirm('Annuler cette réservation ?')) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/events/bookings/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const getDaysOfWeek = (startDate: Date) => {
    const daysArr = [];
    const daysNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    for (let i = 0; i < 7; i++) {
       const d = new Date(startDate);
       d.setDate(startDate.getDate() + i);
       daysArr.push({
         name: daysNames[i],
         dateNumber: d.getDate(),
         month: d.toLocaleString('fr-FR', { month: 'short' }),
         fullDate: d
       });
    }
    return daysArr;
  };

  const daysArr = getDaysOfWeek(currentDate);

  const prevWeek = () => {
    setCurrentDate(prev => {
      const newD = new Date(prev);
      newD.setDate(newD.getDate() - 7);
      return newD;
    });
  };

  const nextWeek = () => {
    setCurrentDate(prev => {
      const newD = new Date(prev);
      newD.setDate(newD.getDate() + 7);
      return newD;
    });
  };

  const getWeekNumber = (d: Date) => {
      const date = new Date(d.getTime());
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
      const week1 = new Date(date.getFullYear(), 0, 4);
      return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <Link href="/director/events" className="text-sky-400 hover:text-sky-300 text-sm mb-2 inline-block transition-colors font-medium">
             ← Retour aux Salles
          </Link>
          <h1 className="text-3xl font-serif text-white mb-2">Planning Événementiel</h1>
          <p className="text-slate-400">Calendrier interactif des réservations de vos espaces polyvalents.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-slate-800 rounded-lg p-1 items-center">
             <button onClick={prevWeek} className="px-4 py-2 text-xl font-medium text-slate-400 hover:text-white transition-colors cursor-pointer select-none">&lt;</button>
             <div className="px-4 py-2 text-sm font-medium text-white bg-slate-700/50 rounded shadow min-w-[200px] text-center select-none text-slate-300">
               Semaine {getWeekNumber(currentDate)} ({daysArr[0].dateNumber} {daysArr[0].month} - {daysArr[6].dateNumber} {daysArr[6].month})
             </div>
             <button onClick={nextWeek} className="px-4 py-2 text-xl font-medium text-slate-400 hover:text-white transition-colors cursor-pointer select-none">&gt;</button>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-2 rounded-xl transition-all shadow-lg flex items-center gap-2">
            <span>+</span> Réserver
          </button>
        </div>
      </div>

      <div className="glass-card bg-slate-900 border border-slate-800 overflow-x-auto rounded-2xl shadow-xl wzglę">
        <div className="min-w-[1000px] p-6 relative">
          
          <div className="grid grid-cols-8 gap-4 border-b border-slate-800/60 pb-4 mb-4 relative z-0">
            <div className="col-span-1 text-slate-500 font-medium text-sm pt-4 uppercase tracking-wider pl-2">Espaces</div>
            {daysArr.map((day, idx) => (
              <div key={idx} className="col-span-1 text-center font-medium text-white text-sm">
                {day.name} <br/> <span className="text-slate-400 text-xs">{day.dateNumber} {day.month}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6 relative z-10">
            {rooms.length === 0 ? (
               <div className="text-center py-10 text-slate-500">Aucun espace événementiel trouvé.</div>
            ) : (
               rooms.map(room => {
                 return (
                 <div key={room._id} className="grid grid-cols-8 gap-4 relative group h-16">
                    <div className="col-span-1 flex items-center pr-2">
                      <div className="flex flex-col">
                        <span className="text-slate-300 text-sm font-bold truncate">{room.name}</span>
                        <span className="text-xs text-sky-400">{room.type}</span>
                      </div>
                    </div>

                    <div className="col-span-1 h-16 border-l border-r border-slate-800/30 group-hover:bg-slate-800/20"></div>
                    <div className="col-span-1 h-16 border-r border-slate-800/30 group-hover:bg-slate-800/20"></div>
                    <div className="col-span-1 h-16 border-r border-slate-800/30 group-hover:bg-slate-800/20"></div>
                    <div className="col-span-1 h-16 border-r border-slate-800/30 group-hover:bg-slate-800/20"></div>
                    <div className="col-span-1 h-16 border-r border-slate-800/30 group-hover:bg-slate-800/20"></div>
                    <div className="col-span-1 h-16 border-r border-slate-800/30 group-hover:bg-slate-800/20"></div>
                    <div className="col-span-1 h-16 border-r border-slate-800/30 group-hover:bg-slate-800/20"></div>
                    
                    {room.status === 'MAINTENANCE' ? (
                       <div className="absolute top-1 bottom-1 left-[12.5%] right-0 bg-red-500/10 border-2 border-dashed border-red-500/50 rounded-lg flex items-center justify-center pointer-events-none z-20">
                         <span className="text-red-500 font-bold opacity-50 uppercase text-xs">Maintenance (Bloqué)</span>
                       </div>
                    ) : (
                       bookings.filter(b => b.eventRoomId === room._id).map(booking => {
                           // Basic mapping to the week days logic
                           const start = new Date(booking.startDate);
                           const end = new Date(booking.endDate);
                           const startIdx = (start.getDay() + 6) % 7;
                           const endIdx = (end.getDay() + 6) % 7;
                           const leftPercent = (startIdx / 7) * 100;
                           const widthPercent = ((Math.max(endIdx, startIdx) - startIdx + 1) / 7) * 100;
                           
                           return (
                             <div key={booking._id} 
                               className="absolute top-1 bottom-1 rounded-lg p-2 flex flex-col justify-center cursor-pointer hover:brightness-125 transition-all z-20 opacity-90 shadow-lg group/event"
                               style={{ 
                                 left: `calc(12.5% + ${leftPercent * 0.875}%)`, 
                                 width: `calc(${widthPercent * 0.875}% - 8px)`,
                                 backgroundColor: `${booking.color}30`, // hex with opacity
                                 border: `2px solid ${booking.color}`
                               }}
                             >
                               <span className="text-xs font-bold truncate" style={{ color: booking.color }}>{booking.eventName}</span>
                               <span className="text-[10px] text-slate-200 truncate">{booking.clientName}</span>
                               <button 
                                 onClick={() => handleDeleteBooking(booking._id)} 
                                 className="absolute right-2 top-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/event:opacity-100 transition-opacity"
                                 title="Supprimer"
                               >X</button>
                             </div>
                           )
                       })
                    )}
                 </div>
               )})
            )}
          </div>

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="glass-card bg-slate-900 p-8 rounded-3xl w-full max-w-lg border border-slate-800">
            <h2 className="text-2xl font-serif text-white mb-6">Bloquer une Salle</h2>
            
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-4">
                 {errorMsg}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Salle Événementielle</label>
                <select required value={formData.eventRoomId} onChange={e => setFormData({...formData, eventRoomId: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                  {rooms.filter(r => r.status !== 'MAINTENANCE').map(room => (
                    <option key={room._id} value={room._id}>{room.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nom de l'Événement</label>
                <input required type="text" value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Ex: Congrès Médical" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Personne/Client Contact</label>
                <input required type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Dr. Dupont / ESN Corp" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type de Réservation</label>
                <select required value={formData.billingType} onChange={e => setFormData({...formData, billingType: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                  <option value="HOURLY">À l'heure</option>
                  <option value="HALF_DAY">Demi-journée (Matin/Aprem)</option>
                  <option value="FULL_DAY">Journée complète / Multi-jours</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Date & Heure Début</label>
                  <input required type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] color-scheme-dark" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Date & Heure Fin</label>
                  <input required type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] color-scheme-dark" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Couleur UI</label>
                <div className="flex gap-4">
                   {['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#D4AF37'].map(c => (
                     <div key={c} onClick={() => setFormData({...formData, color: c})} className={`w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform ${formData.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 border border-white' : ''}`} style={{ backgroundColor: c }}></div>
                   ))}
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all">Annuler</button>
                <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 rounded-xl transition-all">Valider Réservation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .color-scheme-dark::-webkit-calendar-picker-indicator {
           filter: invert(1);
        }
      `}} />
    </div>
  );
}
