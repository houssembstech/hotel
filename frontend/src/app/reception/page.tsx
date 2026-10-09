"use client";
import React, { useEffect, useState } from 'react';

export default function ReceptionRackPage() {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data));
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-emerald-500';
      case 'OCCUPIED': return 'bg-amber-500';
      case 'CLEANING_NEEDED': return 'bg-red-500';
      case 'MAINTENANCE': return 'bg-slate-700';
      default: return 'bg-slate-500';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return 'Libre & Propre';
      case 'OCCUPIED': return 'Occupée';
      case 'CLEANING_NEEDED': return 'Sale / À Nettoyer';
      case 'MAINTENANCE': return 'Hors Service';
      default: return status;
    }
  };

  const groupedRooms = rooms.reduce((acc, room) => {
    const floor = room.floor || 1;
    const type = room.type || 'Standard';
    if (!acc[floor]) acc[floor] = {};
    if (!acc[floor][type]) acc[floor][type] = [];
    acc[floor][type].push(room);
    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  return (
    <div>
      <div className="flex justify-between items-end mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Rack de Chambres</h1>
          <p className="text-slate-400">Suivi en temps réel interactif de l'inventaire hébergement.</p>
        </div>
        <div className="text-right">
           <p className="text-sm text-slate-400 mb-1">Occupation Actuelle</p>
           <p className="text-3xl text-white font-bold">{Math.round((rooms.filter(r => r.status === 'OCCUPIED').length / (rooms.length || 1)) * 100)} %</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
         <div className="flex items-center gap-2 text-sm text-slate-400"><div className="w-3 h-3 rounded bg-emerald-500"></div> Libre & Propre</div>
         <div className="flex items-center gap-2 text-sm text-slate-400"><div className="w-3 h-3 rounded bg-amber-500"></div> Occupée (Résident)</div>
         <div className="flex items-center gap-2 text-sm text-slate-400"><div className="w-3 h-3 rounded bg-red-500"></div> En Nettoyage / Départ</div>
         <div className="flex items-center gap-2 text-sm text-slate-400"><div className="w-3 h-3 rounded bg-slate-700"></div> Maintenance</div>
      </div>

      {rooms.length === 0 ? (
        <div className="py-10 text-center text-slate-500">Aucune chambre dans l'inventaire logiciel.</div>
      ) : (
        Object.keys(groupedRooms).sort().map(floor => (
          <div key={floor} className="mb-12">
            <h2 className="text-2xl font-serif text-white mb-6 border-b border-slate-800 pb-2">
              Étage {floor}
            </h2>
            
            {Object.keys(groupedRooms[floor as any]).sort().map(type => (
               <div key={type} className="mb-6 glass-card rounded-xl border border-slate-800 p-4">
                 <h3 className="text-md text-[#D4AF37] mb-4 pl-2 border-l-2 border-[#D4AF37] font-bold uppercase tracking-widest">{type}</h3>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                   {groupedRooms[floor as any][type].map((room: any) => (
                      <div key={room._id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-white transition-all relative group shadow-lg">
                         
                         {/* Dynamic Soft Locking */}
                         {room.status === 'AVAILABLE' && room.currentLock?.agentName && new Date(room.currentLock.expiresAt) > new Date() && (
                            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 border border-sky-500 p-2">
                              <span className="text-[10px] text-sky-400 text-center font-medium leading-tight">En cours de traitement par {room.currentLock.agentName}</span>
                            </div>
                         )}
                         
                         <h3 className="text-xl font-bold text-white tracking-widest">Chambre {room.roomNumber}</h3>
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">{room.type}</p>
                         
                         <div className={`px-2 py-1 rounded text-[10px] font-bold text-slate-950 uppercase tracking-wider w-full ${getStatusColor(room.status)}`}>
                            {getStatusText(room.status)}
                         </div>
                         
                         {/* Guest name snippet (faked for UI) */}
                         {room.status === 'OCCUPIED' && (
                           <div className="mt-3 text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded w-full border border-slate-700">
                             Mr. Anderson (2 nuits)
                           </div>
                         )}
                      </div>
                   ))}
                 </div>
               </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
