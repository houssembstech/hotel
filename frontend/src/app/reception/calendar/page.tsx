"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReceptionCalendarPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch bookings & rooms
    Promise.all([
      fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/bookings').then(res => res.json()),
      fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/rooms').then(res => res.json())
    ]).then(([bookingsData, roomsData]) => {
      setBookings(bookingsData || []);
      setRooms(roomsData || []);
    });
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    
    // Adjust for Monday as first day of week
    const startingDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < startingDay; i++) {
       days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
       days.push(new Date(year, month, i));
    }
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(b => {
      const start = new Date(b.checkInDate);
      const end = new Date(b.checkOutDate);
      // Strip time from dates for comparison
      const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      
      return compareDate >= startDate && compareDate < endDate;
    });
  };

  const getAvailableRoomsForDate = (date: Date) => {
    const bookedRoomIds = getBookingsForDate(date).map(b => b.roomId?._id).filter(Boolean);
    return rooms.filter(r => !bookedRoomIds.includes(r._id));
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const days = generateCalendarDays();
  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];
  const selectedDateAvailableRooms = selectedDate ? getAvailableRoomsForDate(selectedDate) : [];

  const handleReserveRoom = (roomId: string) => {
     // Assuming there's a flow to check in / pre-book in the arrivals or a new route. We can redirect to arrivals with a preselected room, or just to arrivals.
     // For now, redirecting to arrivals layout to proceed with checkin. You might want to pass roomId in query params.
     router.push(`/reception/arrivals?roomId=${roomId}&date=${selectedDate?.toISOString()}`);
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-end mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-[#D4AF37] mb-2">Calendrier des Réservations</h1>
          <p className="text-slate-400">Gérez les disponibilités et visualisez les occupations par jour.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 p-6">
        <div className="flex justify-between items-center mb-6">
           <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-800 rounded bg-slate-900 border border-slate-700 transition">
              &larr; Précédent
           </button>
           <h2 className="text-2xl font-bold font-serif">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
           </h2>
           <button onClick={handleNextMonth} className="p-2 hover:bg-slate-800 rounded bg-slate-900 border border-slate-700 transition">
              Suivant &rarr;
           </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-slate-400 text-sm font-bold">
           {weekDays.map(day => <div key={day}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
           {days.map((day, idx) => {
              if (!day) return <div key={idx} className="bg-slate-900/40 rounded-xl p-2 min-h-[100px] border border-transparent"></div>;
              
              const dayBookings = getBookingsForDate(day);
              const hasBookings = dayBookings.length > 0;
              const isToday = new Date().toDateString() === day.toDateString();

              return (
                 <div 
                   key={idx} 
                   onClick={() => handleDayClick(day)}
                   className={`bg-slate-900 border overflow-hidden rounded-xl p-2 min-h-[100px] cursor-pointer hover:border-emerald-500 transition-all flex flex-col group
                     ${isToday ? 'border-sky-500' : 'border-slate-800'}
                     ${hasBookings ? 'hover:bg-slate-800/80' : 'hover:bg-slate-800/50'}
                   `}
                 >
                    <span className={`text-sm font-bold ${isToday ? 'text-sky-400' : 'text-slate-300'}`}>{day.getDate()}</span>
                    
                    <div className="mt-auto pt-2 space-y-1">
                      {hasBookings ? (
                         <div className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 py-0.5 rounded text-center">
                            {dayBookings.length} Réservation(s)
                         </div>
                      ) : (
                         <div className="text-[10px] text-slate-500 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            Vide
                         </div>
                      )}
                    </div>
                 </div>
              );
           })}
        </div>
      </div>

      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl relative overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                 <div>
                   <h3 className="text-2xl font-serif text-[#D4AF37]">Détails du jour</h3>
                   <p className="text-slate-400 text-sm">{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-slate-800 transition">
                    &times; Fermer
                 </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-[#0a0f18]">
                 
                 {/* Reserved Rooms */}
                 <div>
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                       Chambres Réservées ({selectedDateBookings.length})
                    </h4>
                    {selectedDateBookings.length === 0 ? (
                       <p className="text-slate-500 text-sm">Aucune réservation pour ce jour.</p>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedDateBookings.map((b, i) => (
                             <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                   <div className="font-bold text-lg text-white">Chambre {b.roomId?.roomNumber || 'Inconnue'}</div>
                                   <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${b.status === 'CHECKED_IN' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                      {b.status}
                                   </span>
                                </div>
                                <div className="text-xs text-slate-400 mb-2">Type: {b.roomId?.type || 'N/A'}</div>
                                <div className="text-xs text-slate-300">
                                   <span className="text-slate-500">Arrivée: </span> {new Date(b.checkInDate).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(':', 'h')} <br/>
                                   <span className="text-slate-500">Départ (max): </span> {new Date(b.checkOutDate).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(':', 'h')}
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>

                 {/* Available Rooms */}
                 <div>
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                       Chambres Disponibles ({selectedDateAvailableRooms.length})
                    </h4>
                    {selectedDateAvailableRooms.length === 0 ? (
                       <p className="text-slate-500 text-sm">L'hôtel est complet ce jour-là.</p>
                    ) : (
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {selectedDateAvailableRooms.map((r, i) => (
                             <div key={i} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col items-center text-center justify-between hover:border-emerald-500 transition">
                                <div>
                                  <div className="font-bold text-white text-lg">Chambre {r.roomNumber}</div>
                                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">{r.type}</div>
                                </div>
                                <div className="mt-4 text-emerald-400 font-bold">{r.pricePerNight}€ / nuit</div>
                                <button 
                                   onClick={() => handleReserveRoom(r._id)}
                                   className="mt-4 w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500 text-xs font-bold py-2 rounded transition"
                                >
                                   Réserver (Check-in)
                                </button>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>

              </div>
           </div>
        </div>
      )}
    </div>
  );
}
