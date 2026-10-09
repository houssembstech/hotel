"use client";
import React, { useEffect, useState, useRef } from 'react';

export default function DirectorServicesPage() {
  const [extras, setExtras] = useState<any[]>([]);
  const [policies, setPolicies] = useState({
    cityTax: 0,
    earlyCheckInFee: 0,
    lateCheckOutFee: 0,
    cancellationPercentage: 0
  });

  const [savingPolicies, setSavingPolicies] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [extraData, setExtraData] = useState({
    name: '',
    category: 'SPA',
    price: 0,
    pricingType: 'UNITAIRE',
    description: '',
    photo: ''
  });

  const fetchData = async () => {
    try {
      const [extrasRes, policiesRes] = await Promise.all([
        fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/services'),
        fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/services/policies')
      ]);
      const ex = await extrasRes.json();
      const pol = await policiesRes.json();
      setExtras(ex);
      setPolicies(pol);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const savePolicies = async () => {
    setSavingPolicies(true);
    await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/services/policies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policies)
    });
    setSavingPolicies(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const data = new FormData();
    data.append('photo', e.target.files[0]);
    data.append('type', 'services');

    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.url) {
         setExtraData(prev => ({ ...prev, photo: result.url }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExtraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(extraData)
    });
    setShowExtraModal(false);
    setExtraData({ name: '', category: 'SPA', price: 0, pricingType: 'UNITAIRE', description: '', photo: '' });
    fetchData();
  };

  const handleDeleteExtra = async (id: string) => {
    if(!window.confirm('Supprimer ce service extra du catalogue ?')) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/services/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Services Additionnels & Frais</h1>
          <p className="text-slate-400">Catalogue des extras (Spa, navette) et paramétrage dynamique des taxes et pénalités.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Policies Configuration */}
        <div className="lg:col-span-1 glass-card p-8 border border-slate-800 rounded-2xl h-max">
           <div className="mb-6">
              <span className="text-4xl mb-4 block text-slate-400">⚖️</span>
              <h2 className="text-xl text-white font-serif mb-2">Centre des Politiques Tarifaires</h2>
              <p className="text-sm text-slate-400">Configurez les frais de séjour standards applicables au client.</p>
           </div>
           
           <div className="space-y-6">
              <div>
                <label className="flex items-center justify-between text-sm text-slate-300 font-medium mb-2">
                   Taxe de Séjour <span className="text-xs font-normal text-slate-500">Par nuit & par personne</span>
                </label>
                <div className="relative">
                  <input type="number" step="0.10" value={policies.cityTax} onChange={e => setPolicies({...policies, cityTax: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
                  <span className="absolute left-3 top-3 text-slate-500">€</span>
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between text-sm text-slate-300 font-medium mb-2">
                   Frais "Early Check-in" <span className="text-xs font-normal text-slate-500">Arrivée matinale</span>
                </label>
                <div className="relative">
                  <input type="number" value={policies.earlyCheckInFee} onChange={e => setPolicies({...policies, earlyCheckInFee: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-4 py-3 text-[#D4AF37] font-bold focus:outline-none focus:border-[#D4AF37]" />
                  <span className="absolute left-3 top-3 text-[#D4AF37]">€</span>
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between text-sm text-slate-300 font-medium mb-2">
                   Frais "Late Check-out" <span className="text-xs font-normal text-slate-500">Départ tardif</span>
                </label>
                <div className="relative">
                  <input type="number" value={policies.lateCheckOutFee} onChange={e => setPolicies({...policies, lateCheckOutFee: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-4 py-3 text-[#D4AF37] font-bold focus:outline-none focus:border-[#D4AF37]" />
                  <span className="absolute left-3 top-3 text-[#D4AF37]">€</span>
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between text-sm text-slate-300 font-medium mb-2">
                   Pénalité d'Annulation <span className="text-xs font-normal text-slate-500">% du total retenu</span>
                </label>
                <div className="relative">
                  <input type="number" value={policies.cancellationPercentage} onChange={e => setPolicies({...policies, cancellationPercentage: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-4 pr-8 py-3 text-red-400 font-bold focus:outline-none focus:border-[#D4AF37]" />
                  <span className="absolute right-4 top-3 text-red-500">%</span>
                </div>
              </div>
           </div>

           <button onClick={savePolicies} disabled={savingPolicies} className="mt-8 w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
             <span>{savingPolicies ? 'Sauvegarde...' : 'Appliquer Nouvelles Règles'}</span>
           </button>
        </div>

        {/* Right Col: Catalog of Services */}
        <div className="lg:col-span-2">
           <div className="flex justify-between items-end mb-6">
              <div>
                 <h2 className="text-xl text-white font-serif mb-1">Catalogue des Prestations</h2>
                 <p className="text-sm text-slate-400">Ces services pourront être ajoutés sur la note de chambre du client lors de son séjour.</p>
              </div>
              <button onClick={() => setShowExtraModal(true)} className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition-all">
                + Ajouter Prestation
              </button>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {extras.length === 0 ? (
                 <div className="sm:col-span-2 bg-slate-900/50 p-10 rounded-2xl border border-slate-800 text-center text-slate-500">
                   Le catalogue est vide.
                 </div>
              ) : (
                 extras.map(extra => (
                    <div key={extra._id} className="glass-card bg-slate-900 border border-slate-800 rounded-2xl flex flex-col hover:border-sky-500/50 transition-colors overflow-hidden relative">
                       {extra.photo && (
                         <div className="h-28 w-full relative">
                           <img src={extra.photo} alt={extra.name} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                         </div>
                       )}
                       
                       <div className={`p-5 flex flex-col flex-1 ${extra.photo ? 'pt-0 z-10' : ''}`}>
                         <div className="flex justify-between items-start mb-2 group">
                            <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${extra.category==='SPA'?'bg-purple-500/20 text-purple-400' : extra.category==='TRANSPORT'?'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'}`}>
                              {extra.category}
                            </span>
                            <button onClick={() => handleDeleteExtra(extra._id)} className="text-slate-600 hover:text-red-500 transition-colors">X</button>
                         </div>
                         <h3 className="text-white font-medium mb-1">{extra.name}</h3>
                         <p className="text-xs text-slate-400 mb-4 line-clamp-2 min-h-[30px]">{extra.description}</p>
                         <div className="mt-auto flex justify-between items-end pt-3 border-t border-slate-800/50">
                            <span className="text-[#D4AF37] font-bold text-lg">{extra.price} €</span>
                            <span className="text-[10px] text-slate-500">
                               {extra.pricingType === 'UNITAIRE' && 'Une fois'}
                               {extra.pricingType === 'PAR_NUIT' && 'Par Nuit (Récurrent)'}
                               {extra.pricingType === 'PAR_PERSONNE' && 'Par Personne'}
                            </span>
                         </div>
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>

      </div>

      {showExtraModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="glass-card bg-slate-900 p-8 rounded-3xl w-full max-w-lg border border-slate-800">
            <h2 className="text-2xl font-serif text-white mb-6">Ajouter un Service / Extra</h2>
            <form onSubmit={handleExtraSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Form Elements */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Nom de la Prestation</label>
                    <input required type="text" value={extraData.name} onChange={e => setExtraData({...extraData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Ex: Massage Thaï / Navette aéroport..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Catégorie</label>
                      <select value={extraData.category} onChange={e => setExtraData({...extraData, category: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                        <option value="SPA">Spa & Bien-être</option>
                        <option value="TRANSPORT">Transport</option>
                        <option value="CHAMBRE">Supplément Chambre</option>
                        <option value="AUTRE">Autre Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Type de facturation</label>
                      <select value={extraData.pricingType} onChange={e => setExtraData({...extraData, pricingType: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                        <option value="UNITAIRE">Acte Unitaire</option>
                        <option value="PAR_NUIT">Récurrent Par Nuit</option>
                        <option value="PAR_PERSONNE">Par Personne</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Prix (€)</label>
                    <input required type="number" min="0" value={extraData.price} onChange={e => setExtraData({...extraData, price: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-emerald-400 font-bold focus:outline-none focus:border-[#D4AF37]" />
                  </div>

                  <div>
                     <label className="block text-sm text-slate-400 mb-1">Petite Description</label>
                     <textarea value={extraData.description} onChange={e => setExtraData({...extraData, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" rows={2} />
                  </div>
                </div>

                {/* Photo Element */}
                <div className="w-full md:w-48 flex flex-col mb-4 md:mb-0 space-y-2">
                   <label className="block text-sm text-slate-400 mb-1">Image Illustrative</label>
                   {extraData.photo ? (
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-slate-700 group">
                         <img src={extraData.photo} alt="Service" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" onClick={() => setExtraData({...extraData, photo: ''})} className="bg-red-500 text-white font-bold px-3 py-1 text-xs rounded hover:bg-red-600 transition-colors">Supprimer</button>
                         </div>
                      </div>
                   ) : (
                      <div onClick={() => fileInputRef.current?.click()} className={`w-full aspect-square bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-slate-800 transition-colors ${uploading ? 'opacity-50' : ''}`}>
                         <span className="text-3xl mb-1">🌄</span>
                         <span className="text-xs text-slate-400 font-medium px-4 text-center">
                           {uploading ? 'Upload...' : 'Ajouter Image'}
                         </span>
                      </div>
                   )}
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-800 mt-4">
                <button type="button" onClick={() => setShowExtraModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all">Annuler</button>
                <button type="submit" disabled={uploading} className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50">Ajouter Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
