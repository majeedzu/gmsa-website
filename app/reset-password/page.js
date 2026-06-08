'use html';
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error: updateErr } = await supabase.auth.updateUser({ password });
        if (updateErr) throw updateErr;
      } else {
        console.log('Password successfully reset in mock mode.');
      }
      setSuccess(true);
      setPassword('');
      confirmPassword('');
    } catch (err) {
      setError(err.message || 'An error occurred during password updates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card-bg border border-border-color p-8 sm:p-10 rounded-2xl shadow-lg relative">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-muted">
            Enter your new administrative password below.
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-2 text-[#0F7A35] bg-green-50 dark:bg-green-950/20 dark:text-green-400 p-4 rounded-xl border border-green-200/50">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                Your password has been successfully reset! You can now log in using your new credentials.
              </div>
            </div>
            <Link
              href="/login"
              className="w-full flex items-center justify-center space-x-1.5 py-3 bg-primary text-white font-bold rounded-xl text-sm transition-all"
            >
              <span>Go to Login</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="mt-8 space-y-5">
            {error && (
              <div className="text-xs font-semibold text-red-655 bg-red-50 dark:bg-red-950/20 dark:text-red-400 p-4 rounded-xl border border-red-200/50">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="pass" className="text-xs font-bold text-foreground/80 uppercase">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  id="pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:border-primary w-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm" className="text-xs font-bold text-foreground/80 uppercase">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  id="confirm"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Updating password...</span>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
