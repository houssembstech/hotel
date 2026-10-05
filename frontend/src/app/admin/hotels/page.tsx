"use client";
import React, { useEffect, useState } from 'react';

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', currency: 'USD', maxRooms: 50
  });

  const fetchHotels = () => {
    fetch('http://localhost:5000/api/admin/hotels')
      .then(res => res.json())
      .then(data => setHotels(data));
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/admin/hotels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setShowModal(false);
    fetchHotels();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Multi-Hotel Management</h1>
          <p className="text-slate-400">Add, configure, and manage limits for your hotel properties (Tenancy).</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 px-6 py-3 rounded-xl font-bold transition-all shadow-lg">
          + Add New Property
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 text-sm bg-slate-900/50">
              <th className="font-medium pb-4 pt-4 pl-6">Establishment</th>
              <th className="font-medium pb-4 pt-4">Email</th>
              <th className="font-medium pb-4 pt-4">Currency</th>
              <th className="font-medium pb-4 pt-4">Room Quota</th>
              <th className="font-medium pb-4 pt-4 text-right pr-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {hotels.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">No hotels created yet.</td>
              </tr>
            ) : (
              hotels.map(hotel => (
                <tr key={hotel._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pl-6 font-medium text-white flex items-center gap-3">
                    <span className="text-2xl">🏨</span> {hotel.name}
                  </td>
                  <td className="py-4 text-slate-400">{hotel.email}</td>
                  <td className="py-4 font-mono">{hotel.currency}</td>
                  <td className="py-4">
                    <div className="w-full bg-slate-800 rounded-full h-2.5 max-w-[100px] mt-1 overflow-hidden">
                      <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">Max {hotel.limits?.maxRooms || 0}</span>
                  </td>
                  <td className="py-4 text-right pr-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${hotel.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {hotel.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="glass-card bg-slate-900 p-8 rounded-3xl w-full max-w-lg border border-slate-800">
            <h2 className="text-2xl font-serif text-white mb-6">Register New Hotel</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Hotel Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="The Grand Plaza" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Contact Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="contact@grandplaza.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Currency</label>
                  <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Max Rooms Limits</label>
                  <input required type="number" min="1" value={formData.maxRooms} onChange={e => setFormData({...formData, maxRooms: parseInt(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold py-3 rounded-xl transition-all">Setup Hotel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
