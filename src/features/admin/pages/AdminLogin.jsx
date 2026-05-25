import React, { useState } from 'react';
import { authService } from '../../../services/authService';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await authService.signIn(email, password);
      if (data?.session) onLoginSuccess();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050914] flex items-center justify-center px-6">
      <div className="bg-[#0b1224] border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Core Access Validation</h2>
          <p className="text-xs font-mono text-emerald-400 mt-1">// ADMIN_PORTAL_AUTH</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-mono text-center">
            Error: {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-mono text-sm">
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Email Node</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 outline-none focus:border-emerald-500/40" 
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Access Token (Password)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 outline-none focus:border-emerald-500/40" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 text-xs uppercase tracking-wider"
          >
            {loading ? 'Validating Session...' : 'Establish Connection'}
          </button>
        </form>
      </div>
    </div>
  );
}
