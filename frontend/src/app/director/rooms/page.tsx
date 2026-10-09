"use client";
import React, { useEffect, useState, useRef } from 'react';

export default function SuitesManagementPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'Standard',
    pricePerNight: 150,
    adults: 2,
    children: 0,
    status: 'AVAILABLE',
    photos: [] as string[]
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRooms = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
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
        data.append('type', 'rooms');

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

  const openAddModal = () => {
    setEditingRoomId(null);
    setFormData({ roomNumber: '', type: 'Standard', pricePerNight: 150, adults: 2, children: 0, status: 'AVAILABLE', photos: [] });
    setShowModal(true);
  };

  const openEditModal = (room: any) => {
    setEditingRoomId(room._id);
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      pricePerNight: room.pricePerNight,
      adults: room.capacity.adults,
      children: room.capacity.children,
      status: room.status,
      photos: room.photos || []
    });
    setShowModal(true);
  };

  const handleDelete = async (roomId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette chambre ? L'action est irréversible.")) return;
    
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/rooms/${roomId}`, { method: 'DELETE' });
    fetchRooms();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingRoomId 
      ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/rooms/${editingRoomId}`
      : '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/rooms';
      
    const method = editingRoomId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomNumber: formData.roomNumber,
        type: formData.type,
        pricePerNight: formData.pricePerNight,
        capacity: { adults: formData.adults, children: formData.children },
        photos: formData.photos,
        status: formData.status
      })
    });
    
    setShowModal(false);
    fetchRooms();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Gestion de l'Hébergement</h1>
          <p className="text-slate-400">Inventaire du parc, création des chambres et gestion de maintenance technique.</p>
        </div>
        <button onClick={openAddModal} className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg">
          + Ajouter une Chambre
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 text-sm bg-slate-900/30">
              <th className="font-medium pb-4 pt-4 pl-6">Chambre</th>
              <th className="font-medium pb-4 pt-4">Visuel (S)</th>
              <th className="font-medium pb-4 pt-4">Catégorie</th>
              <th className="font-medium pb-4 pt-4">Capacité / Tarif</th>
              <th className="font-medium pb-4 pt-4">Statut Technique</th>
              <th className="font-medium pb-4 pt-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {rooms.length === 0 ? (
               <tr><td colSpan={6} className="py-8 text-center text-slate-500">Aucune chambre dans l'inventaire.</td></tr>
            ) : (
               rooms.map(room => (
                  <tr key={room._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-4 pl-6 font-medium text-xl text-[#D4AF37]">{room.roomNumber}</td>
                    <td className="py-2">
                       {room.photos && room.photos.length > 0 ? (
                           <div className="relative w-16 h-12">
                              <img src={room.photos[0]} alt="Room" className="w-full h-full object-cover rounded-md border border-slate-700 relative z-10" />
                              {room.photos.length > 1 && (
                                <div className="absolute -inset-y-1 -inset-x-1 border border-slate-700 bg-slate-800 rounded-md -z-10 rotate-3"></div>
                              )}
                              {room.photos.length > 2 && (
                                <div className="absolute -inset-y-2 -inset-x-2 border border-slate-700 bg-slate-900 rounded-md -z-20 -rotate-3"></div>
                              )}
                           </div>
                       ) : (
                           <div className="w-16 h-12 bg-slate-800 rounded-md border border-slate-700 flex items-center justify-center text-xs text-slate-500">Aucune Image</div>
                       )}
                    </td>
                    <td className="py-4">{room.type}</td>
                    <td className="py-4">
                       <span className="block text-sm">{room.capacity.adults} Ad. {room.capacity.children} Enf.</span>
                       <span className="text-emerald-400 font-bold text-sm">{room.pricePerNight} € / nuit</span>
                    </td>
                    <td className="py-4">
                       {room.status === 'AVAILABLE' ? (
                          <span className="bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-2 py-1 rounded text-xs font-bold w-full max-w-[100px] inline-block text-center shadow-[0_0_8px_rgba(16,185,129,0.2)]">Disponible</span>
                       ) : room.status === 'MAINTENANCE' ? (
                          <span className="bg-red-900/50 text-red-400 border border-red-800 px-2 py-1 rounded text-xs font-bold w-full max-w-[100px] inline-block text-center shadow-[0_0_8px_rgba(239,68,68,0.2)]">🛠️ En Panne</span>
                       ) : (
                          <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2 py-1 rounded text-xs font-bold w-full max-w-[100px] inline-block text-center">{room.status}</span>
                       )}
                    </td>
                    <td className="py-4 text-right pr-6 space-x-3">
                       <button onClick={() => openEditModal(room)} className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors">Modifier</button>
                       <button onClick={() => handleDelete(room._id)} className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors">Supprimer</button>
                    </td>
                  </tr>
               ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="glass-card bg-slate-900 p-8 rounded-3xl w-full max-w-2xl border border-slate-800 max-h-[90vh] overflow-y-auto shrink-0">
            <h2 className="text-2xl font-serif text-white mb-6">
              {editingRoomId ? "Modifier la Chambre" : "Ajouter une Chambre à l'inventaire"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">N° de Chambre</label>
                  <input required type="text" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="ex: 101" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Catégorie</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Statut Technique</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                    <option value="AVAILABLE">Disponible</option>
                    <option value="OCCUPIED">Occupée (Géré auto)</option>
                    <option value="CLEANING">En cours de ménage</option>
                    <option value="MAINTENANCE">En Maintenance / Panne</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Adultes</label>
                    <input required type="number" min="1" value={formData.adults} onChange={e => setFormData({...formData, adults: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Enfants</label>
                    <input required type="number" min="0" value={formData.children} onChange={e => setFormData({...formData, children: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
                  </div>
                </div>
              </div>

              <div>
                 <label className="block text-sm text-slate-400 mb-1">Prix par Nuit (€)</label>
                 <input required type="number" min="0" value={formData.pricePerNight} onChange={e => setFormData({...formData, pricePerNight: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="150" />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 flex justify-between">
                   <span>Visuels de la Chambre (Dossier Cloudinary)</span>
                   <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">{formData.photos.length} / 3 Max.</span>
                </label>
                
                {formData.photos.length < 3 ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-24 bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] hover:bg-slate-800 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <span className="text-2xl mb-1">📸</span>
                    <span className="text-sm font-medium text-slate-400">
                      {uploading ? 'Enregistrement Cloudinary en cours...' : 'Cliquez pour sélectionner (Max 3 Images)'}
                    </span>
                  </div>
                ) : (
                  <div className="w-full p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm mb-4">
                     La limite maximale de 3 photos est atteinte.
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
                
                {formData.photos.length > 0 && (
                   <div className="mt-4 flex gap-4 overflow-x-auto pb-4">
                     {formData.photos.map((url, idx) => (
                        <div key={idx} className="group relative w-32 h-24 shrink-0 rounded-lg overflow-hidden border-2 border-[#D4AF37]">
                           <img src={url} className="w-full h-full object-cover" alt="Uploaded Room" />
                           <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                        </div>
                     ))}
                   </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-all">Annuler</button>
                <button type="submit" disabled={uploading} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                  {editingRoomId ? "Mettre à jour" : "Confirmer la Chambre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
