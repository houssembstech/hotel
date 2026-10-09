"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Password reset flow states
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempUser, setTempUser] = useState<any>(null);

  const redirectUser = (user: any) => {
      switch (user.role) {
        case 'SUPER_ADMIN': router.push('/admin'); break;
        case 'DIRECTOR': router.push('/director'); break;
        case 'RECEPTIONIST': router.push('/reception'); break;
        case 'GUEST': router.push('/resident'); break;
        default: router.push('/dashboard');
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifiant, password }) // email field in backend is used as generic identifier
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('hotel_token', data.token);
      localStorage.setItem('hotel_user', JSON.stringify(data.user));

      if (data.user.needsPasswordChange) {
         setUserId(data.user.id);
         setTempUser(data.user);
         setNeedsPasswordChange(true);
      } else {
         redirectUser(data.user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
     e.preventDefault();
     if (newPassword !== confirmPassword) {
         setError("Les mots de passe ne correspondent pas.");
         return;
     }

     setLoading(true);
     setError('');
     
     try {
       const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/change-password', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ userId, newPassword })
       });

       const data = await res.json();
       if (!res.ok) throw new Error(data.error || 'Failed to update password');
       
       setSuccess("Mot de passe mis à jour ! Redirection...");
       
       // Update local user object
       const updatedUser = { ...tempUser, needsPasswordChange: false };
       localStorage.setItem('hotel_user', JSON.stringify(updatedUser));
       
       setTimeout(() => {
          redirectUser(updatedUser);
       }, 1500);

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
          <h1 className="text-4xl text-white font-serif mb-2">Lumina Portail</h1>
          <p className="text-slate-400">{needsPasswordChange ? "Sécurité de votre compte" : "Connectez-vous à votre espace"}</p>
        </div>

        <div className="glass-card p-8 bg-slate-900/60 border border-slate-800 rounded-3xl shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium">
              {success}
            </div>
          )}

          {!needsPasswordChange ? (
             <form onSubmit={handleLogin} className="space-y-6">
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">Email ou N° Pièce d'Identité</label>
                 <input 
                   type="text" 
                   value={identifiant}
                   onChange={(e) => setIdentifiant(e.target.value)}
                   required
                   className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" 
                   placeholder="Ex: P12345678" 
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
                   <span>Mot de passe</span>
                   <Link href="#" className="text-xs text-[#D4AF37] hover:underline">Oublié ?</Link>
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
                   {loading ? 'Connexion en cours...' : 'Se Connecter'}
                 </button>
               </div>
             </form>
          ) : (
             <form onSubmit={handleChangePassword} className="space-y-6 animate-fade-in-up">
               <div className="bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/30 mb-6 text-xs text-[#D4AF37] leading-relaxed">
                  C'est votre première connexion. Par mesure de confidentialité, veuillez définir un nouveau mot de passe personnel pour protéger votre séjour.
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">Nouveau Mot de Passe</label>
                 <input 
                   type="password" 
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   required
                   className="w-full bg-slate-800 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                   placeholder="Nouveau secret" 
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">Confirmer le Mot de Passe</label>
                 <input 
                   type="password" 
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   required
                   className="w-full bg-slate-800 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                   placeholder="Retapez le secret" 
                 />
               </div>

               <div className="pt-4">
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                 >
                   {loading ? 'Création...' : 'Valider & Entrer'}
                 </button>
               </div>
             </form>
          )}
        </div>
      </div>
    </div>
  );
}
