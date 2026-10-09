"use client";
import React, { useEffect, useState, useRef } from 'react';

export default function DirectorDiningPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultAllergens = ['Gluten', 'Lait', 'Oeufs', 'Arachides', 'Fruits à Coque', 'Crustacés', 'Soja', 'Céleri'];

  const [formData, setFormData] = useState({
    name: '',
    category: 'Plat',
    price: 0,
    ingredients: '',
    allergens: [] as string[],
    photo: '',
    isAvailable: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dining')
      .then(res => res.json())
      .then(data => setItems(data));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const data = new FormData();
    data.append('photo', e.target.files[0]);
    data.append('type', 'dining');

    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.url) {
         setFormData(prev => ({ ...prev, photo: result.url }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleAllergen = (al: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(al) 
        ? prev.allergens.filter(x => x !== al) 
        : [...prev.allergens, al]
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Plat', price: 0, ingredients: '', allergens: [], photo: '', isAvailable: true });
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      ingredients: item.ingredients,
      allergens: item.allergens || [],
      photo: item.photo || '',
      isAvailable: item.isAvailable
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Supprimer définitivement cet élément de la carte ?')) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dining/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dining/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: !currentStatus })
    });
    fetchItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dining/${editingId}` : '${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dining';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setShowModal(false);
    fetchItems();
  };

  const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Restauration & Room-Service</h1>
          <p className="text-slate-400">Cartes des menus, formules pension et gestion dynamique de disponibilité en cuisine.</p>
        </div>
        <button onClick={openAddModal} className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2">
          <span>+</span> Ajouter Plat/Formule
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-8 border-b border-slate-800 pb-4">
        {['All', 'Formule Pension', 'Entrée', 'Plat', 'Dessert', 'Boisson'].map(cat => (
           <button 
             key={cat} 
             onClick={() => setFilter(cat)}
             className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${filter === cat ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
           >
             {cat === 'All' ? 'Toute la Carte' : cat}
             <span className="ml-2 opacity-60 text-xs">
               ({cat === 'All' ? items.length : items.filter(i => i.category === cat).length})
             </span>
           </button>
        ))}
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredItems.map(item => (
           <div key={item._id} className={`glass-card rounded-2xl border ${item.isAvailable ? 'border-slate-800' : 'border-red-900/50'} overflow-hidden flex flex-col group relative`}>
              <div className="h-48 relative overflow-hidden bg-slate-900">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!item.isAvailable && 'grayscale opacity-50'}`} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                     <span className="text-4xl">🍽️</span>
                     <span className="text-xs mt-2 uppercase tracking-widest">Sans Image</span>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 text-xs rounded-full border border-white/10 uppercase tracking-wide">
                  {item.category}
                </div>
                
                {/* Out of Stock Overlay */}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-red-900/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg translate-y-4 shadow-xl border border-red-400 uppercase tracking-widest text-sm">Épuisé (Cuisine)</span>
                  </div>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="text-lg font-serif text-white leading-tight pr-2">{item.name}</h3>
                   <span className="text-[#D4AF37] font-bold text-lg whitespace-nowrap">{item.price} €</span>
                 </div>
                 
                 <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                   {item.ingredients}
                 </p>
                 
                 {item.allergens && item.allergens.length > 0 && (
                   <div className="flex flex-wrap gap-1 mb-6 mt-auto">
                     {item.allergens.map((al: string) => (
                       <span key={al} className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded tracking-wider uppercase">
                         ⚠️ {al}
                       </span>
                     ))}
                   </div>
                 )}
                 
                 {/* Action Bar */}
                 <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                   <div className="flex items-center gap-2">
                      {/* CSS Toggle switch for availability */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={item.isAvailable} onChange={() => toggleAvailability(item._id, item.isAvailable)} />
                        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        <span className="ml-2 text-xs font-medium text-slate-300">{item.isAvailable ? 'En Service' : 'Rupture'}</span>
                      </label>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => openEditModal(item)} className="p-2 text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 rounded transition-colors" title="Modifier">✏️</button>
                     <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors" title="Supprimer">🗑️</button>
                   </div>
                 </div>
              </div>
           </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
         <div className="text-center py-20 glass-card rounded-2xl border border-slate-800">
           <span className="text-6xl mb-4 block opacity-50">👨‍🍳</span>
           <h3 className="text-xl text-white font-serif mb-2">Cette catégorie est vide</h3>
           <p className="text-slate-400 mb-6">Ajoutez des plats ou formules pour garnir la carte M-Room.</p>
           <button onClick={openAddModal} className="text-[#D4AF37] border border-[#D4AF37]/50 px-6 py-2 rounded-lg hover:bg-[#D4AF37]/10 transition-colors">Démarrer le Menu</button>
         </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card bg-slate-900 p-8 rounded-3xl w-full max-w-4xl border border-slate-800 max-h-[90vh] overflow-y-auto shrink-0 flex flex-col md:flex-row gap-8">
            
            {/* Form Left Side */}
            <div className="flex-1 space-y-6">
              <h2 className="text-2xl font-serif text-white mb-6">
                {editingId ? "Modifier l'Élément" : "Nouvel Élément à la Carte"}
              </h2>
              <form id="dining-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Nom du Plat / Formule</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Ex: Risotto aux Truffes" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Catégorie</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                      <option value="Formule Pension">Formule Pension</option>
                      <option value="Entrée">Entrée</option>
                      <option value="Plat">Plat Principal</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Boisson">Boisson / Bar</option>
                    </select>
                  </div>
                  <div>
                     <label className="block text-sm text-slate-400 mb-1">Prix TTC (€)</label>
                     <input required type="number" min="0" step="0.5" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-[#D4AF37] font-bold text-lg focus:outline-none focus:border-[#D4AF37]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Ingrédients (Description Client)</label>
                  <textarea required value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] resize-none" placeholder="Riz arborio, cèpes frais, parmesan affiné 24 mois, filet d'huile de truffe blanche..." />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Sélection des Allergènes</label>
                  <div className="flex flex-wrap gap-2">
                    {defaultAllergens.map(al => {
                       const active = formData.allergens.includes(al);
                       return (
                         <span key={al} onClick={() => toggleAllergen(al)} className={`cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-medium transition-all select-none flex items-center gap-1 ${active ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                           {active && <span>❌</span>}
                           <span>{al}</span>
                         </span>
                       )
                    })}
                  </div>
                </div>
              </form>
            </div>

            {/* Visuals Right Side */}
            <div className="w-full md:w-[320px] flex flex-col space-y-6 md:border-l border-slate-800 md:pl-8">
               <div>
                 <label className="block text-sm text-slate-400 mb-2">Photographie (Cloudinary)</label>
                 
                 {formData.photo ? (
                   <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-[#D4AF37] mb-4 group">
                      <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button type="button" onClick={() => setFormData({...formData, photo: ''})} className="bg-red-500 text-white font-bold p-3 rounded-full hover:bg-red-600 transition-colors">🗑️ Retirer</button>
                      </div>
                   </div>
                 ) : (
                   <div onClick={() => fileInputRef.current?.click()} className={`w-full aspect-square bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] hover:bg-slate-800 transition-colors mb-4 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <span className="text-4xl mb-3">📸</span>
                      <span className="text-sm font-medium text-slate-400 px-4 text-center">
                        {uploading ? 'Téléversement Cloudinary...' : 'Cliquez pour sélectionner une photo appétissante'}
                      </span>
                   </div>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
               </div>

               <div className="pt-4 border-t border-slate-800 flex flex-col gap-3 mt-auto">
                 <button form="dining-form" disabled={uploading} type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl transition-all shadow-lg text-lg uppercase tracking-wider disabled:opacity-50">
                    {editingId ? 'Valider Modifs' : 'Mettre à la Carte'}
                 </button>
                 <button type="button" onClick={() => setShowModal(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all">Annuler</button>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
