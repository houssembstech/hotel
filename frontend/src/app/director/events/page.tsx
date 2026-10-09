"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function DirectorEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Conference',
    capacityTheatre: 0,
    capacityBanquet: 0,
    capacityUShape: 0,
    pricingHourly: 0,
    pricingHalfDay: 0,
    pricingFullDay: 0,
    equipment: [] as string[],
    photos: [] as string[],
    status: 'AVAILABLE'
  });

  const availableEquipment = ['Vidéoprojecteur 4K', 'Sonorisation Bose', 'Micros sans fil', 'Tableau interactif', 'Estrade', 'Climatisation dédiée'];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchEvents = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Calculate how many more we can upload (Max 3)
    const files = Array.from(e.target.files);
    const availableSlots = 3 - formData.photos.length;
    const filesToUpload = files.slice(0, availableSlots);

    if (filesToUpload.length === 0) return;

    setUploading(true);
    let newPhotos: string[] = [];

    try {
      for (const file of filesToUpload) {
        const data = new FormData();
        data.append('photo', file);
        data.append('type', 'events');

        const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload', {
          method: 'POST',
          body: data
        });
        const result = await res.json();
        if (result.url) {
           newPhotos.push(result.url);
        }
      }
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePhoto = (idxToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== idxToRemove)
    }));
  };

  const toggleEquipment = (eq: string) => {
    setFormData(prev => {
      const exists = prev.equipment.includes(eq);
      return {
        ...prev,
        equipment: exists ? prev.equipment.filter(i => i !== eq) : [...prev.equipment, eq]
      };
    });
  };

  const openAddModal = () => {
    setEditingEventId(null);
    setFormData({
      name: '', type: 'Conference', capacityTheatre: 0, capacityBanquet: 0, capacityUShape: 0,
      pricingHourly: 0, pricingHalfDay: 0, pricingFullDay: 0, equipment: [], photos: [], status: 'AVAILABLE'
    });
    setShowModal(true);
  };

  const openEditModal = (room: any) => {
    setEditingEventId(room._id);
    setFormData({
      name: room.name,
      type: room.type,
      capacityTheatre: room.capacity?.theatre || 0,
      capacityBanquet: room.capacity?.banquet || 0,
      capacityUShape: room.capacity?.uShape || 0,
      pricingHourly: room.pricing?.hourly || 0,
      pricingHalfDay: room.pricing?.halfDay || 0,
      pricingFullDay: room.pricing?.fullDay || 0,
      equipment: room.equipment || [],
      photos: room.photos || [],
      status: room.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de supprimer cette salle d'événement ?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/events/${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingEventId ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/events/${editingEventId}` : '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/events';
    const method = editingEventId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        type: formData.type,
        capacity: { theatre: formData.capacityTheatre, banquet: formData.capacityBanquet, uShape: formData.capacityUShape },
        pricing: { hourly: formData.pricingHourly, halfDay: formData.pricingHalfDay, fullDay: formData.pricingFullDay },
        equipment: formData.equipment,
        photos: formData.photos,
        status: formData.status
      })
    });
    
    setShowModal(false);
    fetchEvents();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Salles & Événementiel</h1>
          <p className="text-slate-400">Gérez le catalogue des salles, configurations, tarifs et plannings.</p>
        </div>
        <button onClick={openAddModal} className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hidden md:flex items-center gap-2">
          <span>+</span> Nouvelle Salle
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 p-6 mb-8 text-center flex flex-col md:flex-row items-center justify-between bg-slate-900/50">
         <div className="flex items-center gap-4">
           <span className="text-4xl text-slate-400">🗓️</span>
           <div className="text-left">
             <h3 className="text-white font-medium">Planning d'Occupation des Salles</h3>
             <p className="text-slate-400 text-sm">Le calendrier interactif pour prévenir des chevauchements.</p>
           </div>
         </div>
         <Link href="/director/events/calendar" className="mt-4 md:mt-0 bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all">Accéder au Calendrier</Link>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 text-sm bg-slate-900/30">
              <th className="font-medium pb-4 pt-4 pl-6">Espace</th>
              <th className="font-medium pb-4 pt-4">Visuel (S)</th>
              <th className="font-medium pb-4 pt-4">Type</th>
              <th className="font-medium pb-4 pt-4">Capacités Max</th>
              <th className="font-medium pb-4 pt-4">Tarif Complet (J)</th>
              <th className="font-medium pb-4 pt-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {events.length === 0 ? (
               <tr><td colSpan={6} className="py-8 text-center text-slate-500">Aucune salle polyvalente créée.</td></tr>
            ) : (
               events.map(room => (
                  <tr key={room._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-4 pl-6 font-medium text-white">{room.name}</td>
                    <td className="py-2">
                       {room.photos && room.photos.length > 0 ? (
                           <div className="relative w-16 h-12">
                              <img src={room.photos[0]} alt="Room" className="w-full h-full object-cover rounded-md border border-slate-700 relative z-10" />
                              {room.photos.length > 1 && <div className="absolute -inset-y-1 -inset-x-1 border border-slate-700 bg-slate-800 rounded-md -z-10 rotate-3"></div>}
                           </div>
                       ) : (
                           <div className="w-16 h-12 bg-slate-800 rounded-md border border-slate-700 flex items-center justify-center text-xs text-slate-500">Vide</div>
                       )}
                    </td>
                    <td className="py-4"><span className="bg-sky-500/20 text-sky-400 px-2 py-1 rounded text-xs">{room.type}</span></td>
                    <td className="py-4 text-xs space-y-1 text-slate-400">
                       <span className="block border border-slate-700 bg-slate-800 px-1 rounded w-max">Théâtre: <span className="font-bold text-white">{room.capacity.theatre}</span></span>
                       <span className="block border border-slate-700 bg-slate-800 px-1 rounded w-max">Banquet: <span className="font-bold text-white">{room.capacity.banquet}</span></span>
                    </td>
                    <td className="py-4 text-emerald-400 font-bold">{room.pricing.fullDay} €</td>
                    <td className="py-4 text-right pr-6 space-x-3">
                       <button onClick={() => openEditModal(room)} className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors">Modifier</button>
                       <button onClick={() => handleDelete(room._id)} className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors">Suppr</button>
                    </td>
                  </tr>
               ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="glass-card bg-slate-900 p-8 rounded-3xl w-full max-w-4xl border border-slate-800 max-h-[95vh] overflow-y-auto shrink-0 flex gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-serif text-white mb-6">
                {editingEventId ? "Modifier l'Espace" : "Créer un Nouvel Espace Événementiel"}
              </h2>
              <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Nom de la Salle</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Salle Crystal" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Type d'Événement</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                      <option value="Conference">Conférence / Séminaire</option>
                      <option value="Mariage">Fêtes & Mariages</option>
                      <option value="Reunion">Réunion Exécutive</option>
                      <option value="Exposition">Exposition (Salon)</option>
                    </select>
                  </div>
                </div>

                <div className="border border-slate-800 p-4 rounded-xl bg-slate-900/50">
                  <h3 className="text-white text-sm font-medium mb-3">Capacité par configuration (Nombre de Pers.)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">En Théâtre</label>
                      <input required type="number" min="0" value={formData.capacityTheatre} onChange={e => setFormData({...formData, capacityTheatre: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37]" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">En Banquet (Tables)</label>
                      <input required type="number" min="0" value={formData.capacityBanquet} onChange={e => setFormData({...formData, capacityBanquet: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37]" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Configuration en U</label>
                      <input required type="number" min="0" value={formData.capacityUShape} onChange={e => setFormData({...formData, capacityUShape: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37]" />
                    </div>
                  </div>
                </div>

                <div className="border border-slate-800 p-4 rounded-xl bg-slate-900/50">
                  <h3 className="text-white text-sm font-medium mb-3">Tarification (€)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">A l'Heure</label>
                      <input required type="number" min="0" value={formData.pricingHourly} onChange={e => setFormData({...formData, pricingHourly: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Demi-Journée</label>
                      <input required type="number" min="0" value={formData.pricingHalfDay} onChange={e => setFormData({...formData, pricingHalfDay: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Journée Complète</label>
                      <input required type="number" min="0" value={formData.pricingFullDay} onChange={e => setFormData({...formData, pricingFullDay: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 text-sm font-bold" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="w-[300px] flex flex-col space-y-6 border-l border-slate-800 pl-8">
               <div>
                  <h3 className="text-white text-sm font-medium mb-3">Équipements Inclus</h3>
                  <div className="space-y-2">
                    {availableEquipment.map(eq => (
                       <label key={eq} className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" checked={formData.equipment.includes(eq)} onChange={() => toggleEquipment(eq)} className="w-4 h-4 rounded text-sky-500 bg-slate-800 border-slate-700 border" />
                         <span className="text-sm text-slate-300">{eq}</span>
                       </label>
                    ))}
                  </div>
               </div>

               <div>
                 <label className="block text-sm text-slate-400 mb-2 flex justify-between">
                    <span>Photos Espace</span>
                    <span className="text-xs font-bold text-sky-400">{formData.photos.length} / 3 Max.</span>
                 </label>
                 {formData.photos.length < 3 ? (
                  <div onClick={() => fileInputRef.current?.click()} className={`w-full h-16 bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] hover:bg-slate-800 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span className="text-sm font-medium text-slate-400">
                      {uploading ? 'Upload...' : 'Uploader image'}
                    </span>
                  </div>
                 ) : null}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
                 
                 {formData.photos.length > 0 && (
                   <div className="mt-3 grid grid-cols-2 gap-2">
                     {formData.photos.map((url, idx) => (
                        <div key={idx} className="group relative w-full h-16 rounded-lg overflow-hidden border border-[#D4AF37]">
                           <img src={url} className="w-full h-full object-cover" alt="Event" />
                           <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                        </div>
                     ))}
                   </div>
                 )}
               </div>

               <div className="pt-4 border-t border-slate-800 flex flex-col gap-3 mt-auto">
                 <button form="event-form" disabled={uploading} type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg">Enregistrer</button>
                 <button type="button" onClick={() => setShowModal(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all">Annuler</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
