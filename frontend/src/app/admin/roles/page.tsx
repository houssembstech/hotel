"use client";
import React, { useEffect, useState } from 'react';

export default function AdminRolesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'DIRECTOR'
  });

  const fetchUsers = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setShowModal(false);
    fetchUsers();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Global Staff Audit</h1>
          <p className="text-slate-400">Directory of all hotel personnel (Director, Reception, etc.) and security management.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 px-6 py-3 rounded-xl font-bold transition-all shadow-lg">
          + Add Staff Member
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 text-sm bg-slate-900/50">
              <th className="font-medium pb-4 pt-4 pl-6">Name</th>
              <th className="font-medium pb-4 pt-4">Email</th>
              <th className="font-medium pb-4 pt-4">Role</th>
              <th className="font-medium pb-4 pt-4 text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">No staff added yet.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pl-6 font-medium text-white flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.role === 'SUPER_ADMIN' ? 'bg-red-500/20 text-red-500' : 'bg-[#D4AF37]/20 text-[#D4AF37]'}`}>
                      {user.name.substring(0,2).toUpperCase()}
                    </div>
                    {user.name}
                  </td>
                  <td className="py-4 text-slate-400">{user.email}</td>
                  <td className="py-4 font-mono text-xs">
                    <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded">{user.role}</span>
                  </td>
                  <td className="py-4 text-right pr-6">
                    <button className="text-sky-400 hover:text-sky-300 text-sm font-medium mr-4">Edit</button>
                    <button className="text-red-400 hover:text-red-300 text-sm font-medium">Reset Pwd</button>
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
            <h2 className="text-2xl font-serif text-white mb-6">Create Staff Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Login Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="director@lumina.com" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Temporary Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Assign Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                  <option value="DIRECTOR">Director</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold py-3 rounded-xl transition-all">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
