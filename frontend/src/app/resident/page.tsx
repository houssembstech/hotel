"use client";
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ResidentPortalContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'demo';

  // State
  const [activeTab, setActiveTab] = useState('home');
  const [dndActive, setDndActive] = useState(false);
  const [folioMode, setFolioMode] = useState(false);
  
  const [guestName, setGuestName] = useState('Invité(e)');
  const [stayData, setStayData] = useState<any>(null);

  useEffect(() => {
     if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('hotel_user');
        if (userStr) {
           try {
              const u = JSON.parse(userStr);
              if (u.name) setGuestName(u.name);
              
              fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/my-stay?userId=${u.id}`)
                 .then(res => res.json())
                 .then(data => {
                    if (data.booking) {
                       setStayData(data);
                       // Rule for Late Checkout: Same Date as CheckOut, and strictly after 13:00.
                       const checkOutDate = new Date(data.booking.checkOutDate);
                       const now = new Date();
                       
                       // Reset checkout time to 13:00
                       const lateThreshold = new Date(checkOutDate);
                       lateThreshold.setHours(13, 0, 0, 0);
                       
                       if (now > lateThreshold) {
                          setLateCheckout(true);
                       }
                    }
                 })
                 .catch(err => console.error("Error fetching stay", err));
           } catch(e) {}
        }
     }
  }, []);

  // Mock Identity Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [identityUrl, setIdentityUrl] = useState('');
  
  // Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const data = new FormData();
    data.append('photo', e.target.files[0]);
    data.append('type', 'identity');

    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      if (result.url) setIdentityUrl(result.url);
    } catch {} finally {
      setUploading(false);
    }
  };

  const [incidentCategory, setIncidentCategory] = useState('');
  const [incidentDesc, setIncidentDesc] = useState('');
  const [incidentReported, setIncidentReported] = useState(false);

  const handleServiceRequest = async (title: string, desc: string, isIncident = false) => {
    try {
      await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/logbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: `${guestName} (APP)`,
          content: `${isIncident ? '🚨 INCIDENT' : '🛎️ SERVICE'} - ${title} : ${desc}`,
          roomNumber: '204',
          priority: isIncident ? 'URGENT' : 'NORMAL'
        })
      });
    } catch(e) {}
  };

  const submitIncident = () => {
    if(!incidentCategory) return;
    setIncidentReported(true);
    handleServiceRequest(incidentCategory, incidentDesc || 'Pas de description supplémentaire', true);
  };

  const [totalRoomService, setTotalRoomService] = useState(0); 
  const [folioOrders, setFolioOrders] = useState<{name: string, price: number}[]>([]);
  const [lateCheckoutFee, setLateCheckoutFee] = useState(50); // Configurable by Director
  const [lateCheckout, setLateCheckout] = useState(false);

  const [rating, setRating] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const requestLateCheckout = () => {
    if (lateCheckout) {
      alert("Le départ tardif a déjà été enregistré sur votre dossier (Auto après 13h00 ou validation manuelle). Seul un agent de réception ou la direction peut procéder à son annulation.");
      return;
    }
    if (confirm(`Souhaitez-vous prolonger votre séjour (Départ Tardif) ? Un supplément de ${lateCheckoutFee}€ sera appliqué.`)) {
      setLateCheckout(true);
      handleServiceRequest('Départ Tardif', `Demande validée par le résident. Frais associés: ${lateCheckoutFee}€`, false);
    }
  };
  
  const [cart, setCart] = useState<{name: string, price: number}[]>([]);
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const placeRoomServiceOrder = async () => {
    if (cart.length === 0) return;
    const items = cart.map(c => c.name).join(', ');
    await handleServiceRequest('🍽️ ROOM SERVICE', `${items} (Total: ${cartTotal}€)`, false);
    
    // Auto-create a charge on the Folio via the logbook/or dedicated endpoint long-term
    // fetch('/api/guest/folio/charge', ...)
    
    setTotalRoomService(prev => prev + cartTotal);
    setFolioOrders(prev => [...prev, ...cart]);
    setCart([]);
    alert(`Merveilleux choix. Votre commande de ${cartTotal}€ vient d'être transmise avec succès aux cuisines du Chef.`);
  };


  return (
    <div className="min-h-screen flex justify-center selection:text-white selection:bg-[#D4AF37] relative overflow-hidden bg-slate-950">
      
      {/* Desktop Luxury Background (Hidden on very small screens, visible on tablet/desktop) */}
      <div className="absolute inset-0 z-0 hidden md:block">
         <img src="https://images.unsplash.com/photo-1542314831-c6a4d14d8373?q=80&w=2070&auto=format&fit=crop" alt="Luxury Hotel" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
         <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] opacity-90"></div>
         {/* Decorative text on the empty desktop sides */}
         <div className="absolute left-10 top-1/3 max-w-sm hidden lg:block opacity-60">
            <h1 className="text-[#D4AF37] font-serif text-5xl mb-4">Lumina Respite</h1>
            <p className="text-white font-light tracking-widest uppercase text-sm leading-loose">L'expérience premium commence ici. Flashez le QR Code pour l'obtenir sur votre mobile.</p>
         </div>
      </div>

      {/* Luxury Background Effects for Mobile Area */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center z-10 w-full">
         <div className="w-full max-w-md relative h-full">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37] opacity-[0.1] rounded-full blur-[100px]"></div>
            <div className="absolute top-[40%] -right-40 w-96 h-96 bg-indigo-500 opacity-[0.08] rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-40 left-10 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.06] rounded-full blur-[120px]"></div>
         </div>
      </div>

      {/* The Actual "Mobile App" Container */}
      <div className="w-full max-w-md relative min-h-screen md:min-h-[85vh] md:my-10 md:rounded-[3rem] shadow-2xl flex flex-col font-sans overflow-hidden bg-[#050505]/90 backdrop-blur-xl md:border-4 md:border-white/10 z-20">
        
        {/* TOP HEADER */}
        <header className="px-6 pt-10 pb-6 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <span className="font-serif text-xl text-[#D4AF37] font-bold tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">Lumina</span>
            {activeTab !== 'precheckin' && (
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border transition-all duration-500 ${dndActive ? 'bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'}`}>
                {dndActive ? 'Ne pas déranger' : 'En Ligne'}
              </span>
            )}
          </div>
          <div className="transition-all animate-bounce-in fade-in duration-700 fill-mode-forwards" style={{animationDelay: '100ms'}}>
             <div className="flex justify-between items-start">
               <div>
                 <h1 className="text-sm font-light tracking-widest text-[#D4AF37] uppercase mb-1">Bienvenue,</h1>
                 <h2 className="text-4xl font-serif text-white mb-2 leading-tight">{guestName}</h2>
                 <p className="text-xs text-white/50 tracking-wide">
                    {stayData?.room ? `Chambre ${stayData.room.roomNumber} (${stayData.room.type})` : 'En attente de Check-In'}
                 </p>
               </div>
               
               <button 
                  onClick={() => {
                     if (confirm("Voulez-vous vraiment vous déconnecter de votre espace résident ?")) {
                         window.location.href = '/login';
                     }
                  }} 
                  className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] group" 
                  title="Déconnexion"
               >
                  <svg className="transform group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
               </button>
             </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto px-6 py-2 pb-32 no-scrollbar relative z-10 scroll-smooth">
          
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              
              {/* Check-out Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-between group hover:bg-white/[0.07] transition-all cursor-pointer animate-bounce-in fade-in duration-700 fill-mode-forwards" style={{animationDelay: '200ms'}} onClick={() => setFolioMode(true)}>
                <div>
                  <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.2em] mb-2">Départ Prévu</p>
                  <p className="text-2xl font-light text-white tracking-wide">
                     {stayData?.booking ? new Date(stayData.booking.checkOutDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Non défini'}
                     <span className="opacity-20 mx-2">|</span> 
                     {stayData?.booking ? new Date(stayData.booking.checkOutDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '11:00'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/50 transition-all bg-white/5">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>

              {/* Wi-Fi Card */}
              <div className="bg-gradient-to-br from-[#1a1c29] to-[#0d0e15] rounded-[2rem] p-6 text-white border border-white/5 shadow-2xl relative overflow-hidden transition-all animate-bounce-in fade-in duration-700 fill-mode-forwards" style={{animationDelay: '300ms'}}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
                <h3 className="text-sm text-white/70 tracking-widest uppercase font-bold mb-5 flex items-center gap-2">
                   <span className="text-[#D4AF37]">📡</span> Connexion Wi-Fi
                </h3>
                
                <div className="space-y-3">
                   <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center backdrop-blur-md border border-white/5">
                     <div>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Réseau (SSID)</p>
                        <p className="font-medium text-white tracking-wide">Lumina_Guest_5G</p>
                     </div>
                   </div>
                   <div className="bg-[#D4AF37]/10 rounded-2xl p-4 flex justify-between items-center backdrop-blur-md border border-[#D4AF37]/30">
                     <div>
                        <p className="text-[9px] text-[#D4AF37] uppercase font-bold tracking-widest mb-1">Mot de passe</p>
                        <p className="font-mono tracking-[0.3em] font-bold text-white">LUX204!XY</p>
                     </div>
                     <button onClick={() => alert('Copié dans le presse-papier !')} className="text-[10px] uppercase tracking-widest bg-[#D4AF37] text-black font-bold px-4 py-2.5 rounded-xl hover:bg-[#F3E5AB] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">Copier</button>
                   </div>
                </div>
              </div>


              {/* Évaluation Rapide (Home) */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 text-center transition-all animate-bounce-in fade-in duration-700 fill-mode-forwards" style={{animationDelay: '400ms'}}>
                  {!ratingSubmitted ? (
                      <>
                         <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold mb-4">Comment se passe votre séjour ?</p>
                         <div className="flex justify-center gap-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                               <button 
                                  key={star} 
                                  onClick={() => {
                                     setRating(star);
                                     setRatingSubmitted(true);
                                     handleServiceRequest('Évaluation', `Le résident a attribué ${star} étoiles depuis l'accueil.`, false);
                                  }}
                                  className="text-3xl cursor-pointer hover:scale-125 transition-transform filter grayscale hover:grayscale-0 hover:drop-shadow-[0_0_15px_rgba(253,184,19,0.8)] opacity-60"
                               >
                                  ⭐
                               </button>
                            ))}
                         </div>
                      </>
                  ) : (
                      <div className="animate-bounce-in">
                          <div className="flex justify-center gap-2 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                 <span key={star} className={`text-3xl filter drop-shadow-[0_0_10px_rgba(253,184,19,0.5)] transition-all ${star <= (rating || 0) ? '' : 'grayscale opacity-10'}`}>⭐</span>
                              ))}
                          </div>
                          <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">Avis Enregistré ({rating}/5)</p>
                          <p className="text-[9px] text-white/50 mt-1 uppercase tracking-widest">Merci pour votre retour.</p>
                      </div>
                  )}
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 text-white flex justify-between items-center transition-all animate-bounce-in fade-in duration-700 fill-mode-forwards" style={{animationDelay: '500ms'}}>
                 <div>
                    <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mb-2">Conditions Locales</p>
                    <p className="text-xl font-light tracking-wide mb-1">24°C • Ciel Dégagé</p>
                    <p className="text-[11px] text-white/50 tracking-wide italic">Parfait pour le Spa aujourd'hui.</p>
                 </div>
                 <div className="text-5xl drop-shadow-[0_0_20px_rgba(253,184,19,0.4)]">☀️</div>
              </div>

            </div>
          )}

          {/* TAB 3: ROOM SERVICE */}
          {activeTab === 'roomservice' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end transition-all animate-bounce-in fade-in duration-500 fill-mode-forwards">
                 <div>
                    <h2 className="text-2xl font-serif text-white mb-2">Gastronomie</h2>
                    <p className="text-white/50 text-xs leading-relaxed">La haute cuisine directement en suite.</p>
                 </div>
              </div>

              {/* Status Banner */}
              <div className="bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 p-5 rounded-2xl flex items-center justify-between shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-all animate-bounce-in fade-in duration-500 fill-mode-forwards" style={{animationDelay: '100ms'}}>
                 <div className="flex items-center gap-4">
                    <div className="relative">
                       <span className="text-3xl block filter drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">🛎️</span>
                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-1">En Préparation</p>
                       <p className="text-xs text-white/80">Votre dîner arrive dans 12 minutes.</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-5">
                 {[
                    {name: "Salade César Royale", desc: "Suprême de volaille, parmesan vieilli, sauce", price: 18, img: "🥗" , tags: "SIGNATURE"},
                    {name: "Filet de Boeuf Wagyu", desc: "Caviar de truffe, réduction de porto", price: 65, img: "🥩" , tags: "PREMIUM"},
                    {name: "Élixir d'Or (Mocktail)", desc: "Fruits exotiques, perles de yuzu", price: 16, img: "🍸" , tags: "SANS ALCOOL"},
                 ].map((item, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-4 border border-white/10 flex gap-5 transition-all animate-bounce-in fade-in duration-500 fill-mode-forwards shadow-lg" style={{animationDelay: `${(i+2)*100}ms`}}>
                       <div className="w-24 h-24 bg-[#0a0a0a] rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner shrink-0 border border-white/5 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[#D4AF37] opacity-[0.05]"></div>
                          <span className="filter drop-shadow-xl">{item.img}</span>
                       </div>
                       <div className="flex-1 py-1 flex flex-col justify-between">
                          <div>
                             <div className="flex justify-between items-start mb-1">
                                <h4 className="font-serif font-bold text-white tracking-wide text-lg">{item.name}</h4>
                             </div>
                             <p className="text-[10px] text-white/50 leading-relaxed max-w-[90%]">{item.desc}</p>
                          </div>
                          <div className="flex justify-between items-end mt-3">
                             <div className="flex gap-2 items-center">
                                <span className="font-light text-[#D4AF37] text-lg">{item.price}€</span>
                                <span className="text-[7px] text-[#D4AF37]/50 border border-[#D4AF37]/30 px-1.5 py-0.5 rounded uppercase tracking-[0.2em]">{item.tags}</span>
                             </div>
                             <button onClick={() => setCart([...cart, item])} className="bg-white/10 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] border border-[#D4AF37]/30 rounded-xl w-8 h-8 flex items-center justify-center font-light text-lg transition-colors active:scale-95">
                                +
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}

                 {cart.length > 0 && (
                     <div className="bg-[#D4AF37] text-black rounded-[1.5rem] p-5 shadow-[0_0_30px_rgba(212,175,55,0.3)] mt-4 transition-all animate-bounce-in">
                       <div className="flex justify-between items-center mb-3 border-b border-black/10 pb-3">
                          <span className="font-serif font-bold text-lg">Panier ({cart.length})</span>
                          <span className="font-mono text-xl">{cartTotal} €</span>
                       </div>
                       
                       {/* Detail des articles avec suppression */}
                       <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 no-scrollbar">
                           {cart.map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center text-xs border-b border-black/5 pb-2">
                                  <span className="font-medium truncate flex-1 text-sm">{item.name}</span>
                                  <div className="flex items-center gap-4">
                                     <span className="font-mono opacity-80 text-sm">{item.price}€</span>
                                     <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-red-700 bg-red-900/10 hover:bg-red-900/20 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-colors active:scale-90">×</button>
                                  </div>
                               </div>
                           ))}
                       </div>

                       <div className="flex gap-2">
                         <button onClick={() => setCart([])} className="bg-black/10 text-black/60 font-bold tracking-widest text-[10px] uppercase py-3 px-4 rounded-xl hover:bg-black/20 transition-colors">
                            Vider
                         </button>
                         <button onClick={placeRoomServiceOrder} className="flex-1 bg-black text-white font-bold tracking-widest text-[10px] uppercase py-3 rounded-xl hover:bg-zinc-800 transition-colors">
                            Transmettre
                         </button>
                       </div>
                     </div>
                 )}
              </div>
            </div>
          )}

          {/* TAB 4: CONCIERGE */}
          {activeTab === 'concierge' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end transition-all animate-bounce-in fade-in duration-500 fill-mode-forwards">
                 <div>
                    <h2 className="text-2xl font-serif text-white mb-2">Conciergerie</h2>
                    <p className="text-white/50 text-xs leading-relaxed">Pilotez votre confort d'un simple toucher.</p>
                 </div>
                 
                 {/* Modern Minimalist DND Toggle */}
                 <div className="flex flex-col items-center gap-2">
                    <button onClick={() => setDndActive(!dndActive)} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${dndActive ? 'bg-red-500/20 border border-red-500/50' : 'bg-white/10 border border-white/20'}`}>
                       <span className={`absolute top-[3px] w-[16px] h-[16px] rounded-full transition-all duration-300 shadow-sm ${dndActive ? 'left-[26px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'left-[3px] bg-white/50'}`}></span>
                    </button>
                    <span className="text-[7px] tracking-[0.2em] uppercase text-white/40">{dndActive ? 'Privé' : 'Libre'}</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {[
                    {icon: '🧖‍♀️', title: 'Serviettes', subtitle: 'Linge Frais'},
                    {icon: '✨', title: 'Cosmétiques', subtitle: 'Recharge'},
                    {icon: '🥂', title: 'Glace', subtitle: 'Seau Prêt'},
                    {icon: '👔', title: 'Dressing', subtitle: 'Défroissage'},
                 ].map((act, i) => (
                    <button key={i} onClick={() => { handleServiceRequest(act.title, act.subtitle, false); alert(`Demande de ${act.title} envoyée à la conciergerie.`); }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 text-left active:scale-95 transition-all flex flex-col justify-between h-32 hover:bg-white/10 group transition-all animate-bounce-in fade-in duration-500 fill-mode-forwards" style={{animationDelay: `${i*100 + 100}ms`}}>
                       <span className="text-2xl mb-auto opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all origin-left">{act.icon}</span>
                       <div>
                          <h4 className="font-medium text-white text-sm mb-0.5">{act.title}</h4>
                          <p className="text-[9px] text-[#D4AF37] uppercase tracking-widest">{act.subtitle}</p>
                       </div>
                    </button>
                 ))}
                 
                 <div className="col-span-2 bg-gradient-to-r from-[#D4AF37] to-[#8C7A35] p-6 rounded-[2rem] text-black shadow-lg relative overflow-hidden mt-2 transition-all animate-bounce-in fade-in duration-700 fill-mode-forwards" style={{animationDelay: '500ms'}}>
                    <div className="absolute -right-10 -bottom-10 text-9xl opacity-20 filter blur-[2px]">💆‍♀️</div>
                    <div className="relative z-10">
                       <h4 className="font-serif font-bold text-xl mb-1">Sanctuaire Spa</h4>
                       <p className="text-xs font-medium opacity-80 mb-5 max-w-[70%]">Réservez un rituel de relaxation signature.</p>
                       <button onClick={() => { handleServiceRequest('Sanctuaire Spa', 'Demande de renseignements pour réservation', false); alert('Le Spa vous contactera sur votre WhatsApp dans quelques minutes.'); }} className="bg-black/90 text-white text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full backdrop-blur-md">Découvrir</button>
                    </div>
                 </div>
              </div>

               {/* Modern Technical Incident */}
               <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 p-6 rounded-[2rem] mt-6 transition-all animate-bounce-in fade-in duration-700 fill-mode-forwards" style={{animationDelay: '600ms'}}>
                   <div className="flex items-center gap-3 mb-4">
                      <span className="text-red-400 bg-red-500/10 w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-[0_0_15px_rgba(239,68,68,0.2)]">🛠️</span>
                      <h4 className="font-medium text-white tracking-wide">Assistance Rapide</h4>
                   </div>
                   
                   {incidentReported ? (
                      <div className="text-center py-4">
                         <div className="w-12 h-12 border-2 border-red-500/50 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
                         <p className="text-xs text-red-400 font-bold tracking-widest uppercase mb-1">Équipe en route</p>
                         <p className="text-[10px] text-white/50">Un technicien interviendra d'ici quelques minutes.</p>
                      </div>
                   ) : (
                      <div className="space-y-3">
                         <select value={incidentCategory} onChange={e => setIncidentCategory(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white/80 outline-none focus:border-red-500/50 transition-colors appearance-none">
                            <option value="">Sélectionnez le désagrément...</option>
                            <option value="CLIM">Thermostat / Climatisation</option>
                            <option value="EAU">Eau / Baignoire</option>
                            <option value="TV_WIFI">Divertissement (TV/Wi-Fi)</option>
                         </select>
                         <div className="flex gap-2">
                            <button className="bg-[#0a0a0a] border border-white/10 text-white/50 hover:text-white rounded-xl px-4 py-3 text-lg flex items-center justify-center transition-colors">📷</button>
                            <button onClick={submitIncident} disabled={!incidentCategory} className="flex-1 bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl text-[10px] font-bold tracking-widest uppercase py-3 disabled:opacity-30 transition-all hover:bg-red-500 hover:text-white">Signaler</button>
                         </div>
                      </div>
                   )}
               </div>
            </div>
          )}
          
        </main>

         {/* FULL SCREEN FOLIO MODAL (Glassmorphism Overlay) */}
        {folioMode && (
             <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-2xl z-50 transition-all duration-300">
                <div className="px-6 pt-12">
                   <button onClick={() => setFolioMode(false)} className="text-[#D4AF37] font-medium text-xs tracking-widest uppercase mb-8 flex items-center gap-2 group">
                      <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Retour au portail
                   </button>
                   
                   <h2 className="text-4xl font-serif text-white mb-2">Ma Note & Bilan</h2>
                     <p className="text-white/40 text-xs tracking-wide mb-10">Transparence totale sur votre majestueux séjour.</p>
                   
                   <div className="space-y-6">
                      
                      <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[50px] rounded-full"></div>
                         
                         {/* Lignes */}
                          <div className="space-y-4 mb-6">
                             <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <div>
                                  <p className="text-white font-medium mb-1">Hébergement Séjour</p>
                                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Base Période</p>
                                </div>
                                <span className="font-mono text-white/90">{stayData?.booking ? stayData.booking.totalPrice : 0} €</span>
                             </div>
                             
                             <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <div>
                                  <p className="text-white/80 text-sm mb-1">Taxes de Tourisme</p>
                                </div>
                                <span className="font-mono text-white/70 text-sm">24 €</span>
                             </div>

                             {folioOrders.length > 0 && (
                               <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                  <div>
                                    <p className="text-[#D4AF37] font-medium mb-2">Room Service</p>
                                    <div className="space-y-1">
                                       {folioOrders.map((order, i) => (
                                          <p key={i} className="text-[10px] text-white/40 uppercase tracking-widest block">• {order.name}</p>
                                       ))}
                                    </div>
                                  </div>
                                  <span className="font-mono text-[#D4AF37]">{totalRoomService} €</span>
                               </div>
                             )}
                          </div>
                          
                          {/* Paiements */}
                          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl flex justify-between items-center mb-6">
                             <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Acompte Restant</span>
                             <span className="font-mono text-emerald-400 font-bold">- {stayData?.folio?.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0} €</span>
                          </div>
                          
                          {/* Total */}
                          <div className="flex justify-between items-end pt-2">
                             <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Reste à régler</span>
                             <span className="text-4xl font-serif text-white">{(stayData?.booking ? stayData.booking.totalPrice : 0) + 24 - (stayData?.folio?.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0) + totalRoomService + (lateCheckout ? lateCheckoutFee : 0)} €</span>
                          </div>
                       </div>

                       <button onClick={requestLateCheckout} className={`w-full py-5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-3 border ${lateCheckout ? 'bg-red-500/10 border-red-500/30 text-white shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}>
                          Départ Tardif <span className={`${lateCheckout ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-[#D4AF37] border border-white/5'} px-2 py-1 rounded text-[10px] font-bold tracking-widest`}>{lateCheckout ? 'NON ANNULABLE' : `+${lateCheckoutFee}€`}</span>
                       </button>
                      
                      <button className="w-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-black py-5 rounded-[1.5rem] font-bold text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all transform hover:scale-[1.02]">
                         Payer & Clôturer
                      </button>

                       {!ratingSubmitted ? (
                          <div className="pt-6">
                             <p className="text-center text-[10px] text-white/40 uppercase tracking-widest mb-3">Évaluez votre expérience</p>
                             <div className="flex justify-center gap-6 opacity-80">
                                {[1, 2, 3, 4, 5].map((star, i) => (
                                  <button 
                                     key={i} 
                                     onClick={() => {
                                        setRating(star);
                                        setRatingSubmitted(true);
                                        handleServiceRequest('Évaluation Séjour', `Le résident a évalué le séjour : ${star} étoiles.`, false);
                                     }}
                                     className="text-3xl cursor-pointer hover:scale-125 transition-transform filter grayscale hover:grayscale-0 hover:drop-shadow-[0_0_15px_rgba(253,184,19,0.8)]"
                                  >
                                     ⭐
                                  </button>
                                ))}
                             </div>
                          </div>
                       ) : (
                          <div className="pt-6 text-center animate-bounce-in">
                             <span className="text-3xl filter drop-shadow-[0_0_15px_rgba(253,184,19,0.8)]">⭐</span>
                             <p className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest mt-2">Merci pour votre note de {rating}/5 !</p>
                             <p className="text-[9px] text-white/50 mt-1">À très bientôt chez Lumina.</p>
                          </div>
                       )}

                   </div>
                </div>
             </div>
          )}

        {/* BOTTOM LUXURY NAVIGATION */}
        <nav className="absolute inset-x-4 bottom-6 bg-white/5 backdrop-blur-[30px] border border-white/10 px-2 py-2 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-[2rem] z-40">
           <button onClick={() => {setActiveTab('home'); setFolioMode(false);}} className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 ${activeTab === 'home' && !folioMode ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              <span className={`text-xl mb-1 transition-transform ${activeTab === 'home' && !folioMode ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'opacity-50'}`}>🏛️</span>
              <span className={`text-[7px] font-bold tracking-[0.2em] uppercase ${activeTab === 'home' && !folioMode ? 'text-white' : 'text-white/30'}`}>Accueil</span>
           </button>
           

           
           {/* Center Glowing Action */}
           <button onClick={() => {setActiveTab('roomservice'); setFolioMode(false);}} className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 ${activeTab === 'roomservice' && !folioMode ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'hover:bg-white/5'}`}>
              <span className={`text-xl mb-1 transition-transform ${activeTab === 'roomservice' && !folioMode ? 'scale-125' : 'opacity-50 grayscale'}`}>🍽️</span>
              <span className={`text-[7px] font-bold tracking-[0.2em] uppercase ${activeTab === 'roomservice' && !folioMode ? 'text-[#D4AF37]' : 'text-white/30'}`}>Repas</span>
           </button>
           
           <button onClick={() => {setActiveTab('concierge'); setFolioMode(false);}} className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 ${activeTab === 'concierge' && !folioMode ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              <span className={`text-xl mb-1 transition-transform ${activeTab === 'concierge' && !folioMode ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'opacity-50'}`}>🛎️</span>
              <span className={`text-[7px] font-bold tracking-[0.2em] uppercase ${activeTab === 'concierge' && !folioMode ? 'text-white' : 'text-white/30'}`}>Service</span>
           </button>
           
           <button onClick={() => setFolioMode(true)} className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 ${folioMode ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              <span className={`text-xl mb-1 transition-transform ${folioMode ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'opacity-50'}`}>🧾</span>
              <span className={`text-[7px] font-bold tracking-[0.2em] uppercase ${folioMode ? 'text-white' : 'text-white/30'}`}>Facture</span>
           </button>
        </nav>

      </div>
    </div>
  );
}

export default function ResidentPortal() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-[#D4AF37] font-serif text-2xl animate-pulse">Lumina Portal...</div>}>
      <ResidentPortalContent />
    </Suspense>
  );
}
