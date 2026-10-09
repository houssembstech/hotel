"use client";
import React, { useEffect, useState } from 'react';

export default function LogbookPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [formData, setFormData] = useState({
     content: '',
     roomNumber: '',
     priority: 'NORMAL',
     authorName: ''
  });
  const [loading, setLoading] = useState(false);
  const [agentName, setAgentName] = useState('System');

  const fetchLogs = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/logbook')
      .then(res => res.json())
      .then(data => setLogs(data));
  };

  useEffect(() => {
    const usr = localStorage.getItem('hotel_user');
    if (usr) {
       const parsed = JSON.parse(usr);
       setAgentName(parsed.name);
       setFormData(prev => ({ ...prev, authorName: parsed.name }));
    }
    fetchLogs();
    
    // Simulate real-time SSE for logbook updates
    const interval = setInterval(() => {
       fetchLogs();
    }, 15000); // Polling every 15s to simulate instant comms
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/logbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
     });
     setFormData({ ...formData, content: '', roomNumber: '', priority: 'NORMAL' });
     fetchLogs();
     setLoading(false);
  };

  const handleResolve = async (id: string) => {
     await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reception/logbook/${id}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName })
     });
     fetchLogs();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Main Courante & Consignes</h1>
          <p className="text-slate-400">Fil d'actualité partagé entre tous les réceptionnistes de l'hôtel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Write Log */}
         <div className="lg:col-span-1">
            <div className="glass-card bg-slate-900 border border-slate-800 rounded-3xl p-6 sticky top-6">
               <h2 className="text-lg font-serif text-white mb-6 border-b border-slate-800 pb-2">✏️ Nouvelle Note</h2>
               
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-400 mb-2">Message / Consigne</label>
                     <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500" placeholder="Ex: Le client de la 302 a demandé un réveil à 05h00..." />
                  </div>

                  <div className="flex gap-4">
                     <div className="flex-1">
                       <label className="block text-xs font-bold text-slate-400 mb-2">N° Chambre (Optionnel)</label>
                       <input type="text" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-sky-500" placeholder="Ex: 302" />
                     </div>
                     <div className="flex-1">
                       <label className="block text-xs font-bold text-slate-400 mb-2">Urgence</label>
                       <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-sky-500">
                          <option value="NORMAL">Normale</option>
                          <option value="URGENT">🚨 Urgente</option>
                       </select>
                     </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full mt-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg">
                     Publier pour l'équipe
                  </button>
               </form>
            </div>
         </div>

         {/* Feed List */}
         <div className="lg:col-span-2 space-y-4">
            {logs.length === 0 ? (
               <div className="text-center p-10 text-slate-500 glass-card bg-slate-900/50 rounded-3xl border border-slate-800">
                  <span className="text-4xl mb-4 block">📝</span>
                  La main courante est vide.
               </div>
            ) : (
               logs.map(log => (
                  <div key={log._id} className={`p-5 rounded-2xl border transition-all ${log.isResolved ? 'bg-slate-900/50 border-slate-800 opacity-60' : log.priority === 'URGENT' ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-slate-900 border-slate-700'}`}>
                     
                     <div className="flex justify-between items-start mb-3 border-b border-slate-800/50 pb-3">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${log.priority === 'URGENT' ? 'bg-red-500 text-white' : 'bg-slate-700 text-white'}`}>
                              {log.authorName.charAt(0)}{log.authorName.split(' ')[1]?.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-white">{log.authorName}</p>
                              <p className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleString('fr-FR')}</p>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           {log.roomNumber && (
                              <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded">Ch. {log.roomNumber}</span>
                           )}
                           {log.priority === 'URGENT' && !log.isResolved && (
                              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">URGENT</span>
                           )}
                        </div>
                     </div>

                     <p className={`text-sm mb-4 ${log.isResolved ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {log.content}
                     </p>

                     <div className="flex justify-end gap-2">
                        {log.isResolved ? (
                           <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                              ✓ Traité par {log.resolvedBy}
                           </span>
                        ) : (
                           <button onClick={() => handleResolve(log._id)} className="bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-400 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-slate-700 hover:border-emerald-500">
                              Marquer comme traité
                           </button>
                        )}
                     </div>

                  </div>
               ))
            )}
         </div>

      </div>
    </div>
  );
}
