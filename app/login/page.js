'use html';
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, LogIn, AlertCircle } from 'lucide-react';
import { auth } from '../../lib/db';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If session is already active, redirect directly to admin dashboard
    const session = auth.getSession();
    if (session) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await auth.login(email, password);
      // Success, trigger redirect
      window.location.href = '/admin';
    } catch (err) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card-bg border border-border-color p-8 sm:p-10 rounded-2xl shadow-lg relative overflow-hidden">
        
        {/* Decorative Watermark */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center text-primary/10 text-5xl font-bold select-none">
          لوح
        </div>

        {/* Heading */}
        <div className="text-center space-y-2 relative">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Admin Portal Access
          </h2>
          <p className="text-xs text-muted">
            Authenticate to manage website content, settings, and updates.
          </p>
        </div>

        {error && (
          <div className="flex items-start space-x-2 text-red-650 bg-red-50 dark:bg-red-950/20 dark:text-red-400 p-4 rounded-xl border border-red-200/50">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-bold text-foreground/80 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmsahtu.com"
                className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:border-primary w-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-bold text-foreground/80 uppercase">Password</label>
              <Link 
                href="/forgot-password" 
                className="text-xs font-bold text-primary dark:text-secondary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:border-primary w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-xl shadow hover:scale-[1.01] active:scale-[0.99] hover:bg-primary/95 dark:hover:bg-secondary/95 transition-all cursor-pointer mt-4"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-[10px] text-muted">
          <p>Predefined Admin: <span className="font-semibold text-foreground">admin@gmsahtu.com</span> / <span className="font-semibold text-foreground">Admin@123</span></p>
        </div>
      </div>
    </div>
  );
}
