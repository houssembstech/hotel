"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In production, this would be an environment variable like process.env.NEXT_PUBLIC_API_URL
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token in localStorage
      localStorage.setItem('hotel_token', data.token);
      localStorage.setItem('hotel_user', JSON.stringify(data.user));

      // Redirect based on role
      switch (data.user.role) {
        case 'SUPER_ADMIN':
          router.push('/admin');
          break;
        case 'DIRECTOR':
          router.push('/director');
          break;
        case 'RECEPTIONIST':
          router.push('/reception');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-950 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl text-white font-serif mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to access your portal</p>
        </div>

        <div className="glass-card p-8 bg-slate-900/60 border border-slate-800 rounded-3xl shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" 
                placeholder="director@lumina.com" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
                <span>Password</span>
                <Link href="#" className="text-xs text-[#D4AF37] hover:underline">Forgot?</Link>
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" 
                placeholder="••••••••" 
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
