import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStoreState } from '../services/store';

interface Props {
  initialMode?: 'login' | 'register';
  navigate: (route: string) => void;
}

export const AuthPage: React.FC<Props> = ({ initialMode = 'login', navigate }) => {
  const { setUser } = useStoreState();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'forgot') {
      setSuccessMessage('Password reset link sent to your email address.');
      setTimeout(() => setSuccessMessage(''), 4000);
      return;
    }

    const isAdmin = email.toLowerCase().includes('admin');
    setUser({
      id: `usr-${Date.now()}`,
      email: email || (isAdmin ? 'admin@hsgames.tech' : 'developer@voicechat.app'),
      fullName: fullName || (isAdmin ? 'HSGames Administrator' : 'Muhammad Rashid'),
      companyName: companyName || 'Voice Studio Ltd',
      role: isAdmin ? 'admin' : 'customer',
      createdAt: '2026-11-25'
    });

    if (isAdmin) {
      navigate('admin-dashboard');
    } else {
      navigate('customer-dashboard');
    }
  };

  const handleFastDemoLogin = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setUser({
        id: 'usr-admin-demo',
        email: 'admin@hsgames.tech',
        fullName: 'HSGames Administrator',
        companyName: 'HSGames Media Ltd',
        role: 'admin',
        createdAt: '2026-11-20'
      });
      navigate('admin-dashboard');
    } else {
      setUser({
        id: 'usr-customer-demo',
        email: 'developer@voicechat.app',
        fullName: 'Muhammad Rashid',
        companyName: 'Social Voice Chat Ltd',
        role: 'customer',
        createdAt: '2026-11-22'
      });
      navigate('customer-dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-hsg-card border border-hsg-border rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-hsg-purple/20 border border-hsg-purple/40 flex items-center justify-center mx-auto text-hsg-purple">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {mode === 'login' && 'Sign in to HSGames'}
            {mode === 'register' && 'Create Client Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-hsg-muted">
            {mode === 'login' && 'Access your purchased source code archives & license keys.'}
            {mode === 'register' && 'Register to manage orders and integration support.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {successMessage && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs text-center">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-hsg-muted block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Haider Ali"
                  className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple"
                />
              </div>

              <div>
                <label className="text-hsg-muted block mb-1">Company / Studio (Optional)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Yalla Voice Group"
                  className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-hsg-muted block mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-hsg-muted">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-hsg-cyan hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-hsg-surface border border-hsg-border text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-hsg-purple"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-hsg-purple hover:bg-hsg-purpleDark text-white font-extrabold text-xs shadow-purple-glow transition"
          >
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot' && 'Send Reset Link'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-hsg-muted pt-2 border-t border-hsg-border/60">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-hsg-cyan font-bold hover:underline">
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-hsg-cyan font-bold hover:underline">
                Sign in
              </button>
            </p>
          )}
        </div>

        {/* Instant One-Click Demo Role Login Shortcuts for Testing */}
        <div className="bg-hsg-surface border border-hsg-border p-3 rounded-2xl text-[11px] space-y-2">
          <span className="text-hsg-muted font-bold block text-center uppercase tracking-wider text-[10px]">
            ⚡ Instant Testing Shortcuts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFastDemoLogin('customer')}
              className="py-1.5 px-2 rounded-lg bg-hsg-card hover:bg-white/10 text-white border border-hsg-border text-center font-bold"
            >
              Login as Customer
            </button>
            <button
              onClick={() => handleFastDemoLogin('admin')}
              className="py-1.5 px-2 rounded-lg bg-hsg-purple/30 hover:bg-hsg-purple/50 text-hsg-purple border border-hsg-purple/40 text-center font-bold"
            >
              Login as Admin 🛡️
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
