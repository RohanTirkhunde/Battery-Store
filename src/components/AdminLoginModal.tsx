import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { X, ShieldAlert, KeyRound, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginModalOpen, setIsAdminLoginModalOpen, setActiveView } = useStore();
  const { loginAdmin, adminEmail } = useAuth();

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isAdminLoginModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = loginAdmin(password);
    if (success) {
      setIsAdminLoginModalOpen(false);
      setActiveView('admin-dashboard');
    } else {
      setError('Invalid owner password. Please enter the authorized shop passkey.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-indigo-200 overflow-hidden my-8">
        <button
          onClick={() => setIsAdminLoginModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Restricted Owner Gate
            </span>
            <h2 className="text-2xl font-black font-display text-neutral-900 mt-2">
              New Bharat Battery Admin
            </h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
              This administrative control panel is strictly reserved for the shop owner:
              <strong className="block text-neutral-800 font-mono mt-0.5">{adminEmail}</strong>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Owner Secret Passkey
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret passkey..."
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-indigo-600 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authenticate as Owner</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
