'use html';
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { auth } from '../../lib/db';

export default function ChangePassword() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const activeSession = auth.getSession();
    if (!activeSession) {
      router.push('/login');
    } else {
      setSession(activeSession);
    }
  }, [router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await auth.changePassword(password);
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'An error occurred while changing your password.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <ShieldAlert className="h-10 w-10 text-muted mx-auto animate-bounce" />
          <p className="text-sm font-semibold text-muted">Checking authorization session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card-bg border border-border-color p-8 sm:p-10 rounded-2xl shadow-lg relative">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Change Password
          </h2>
          <p className="text-xs text-muted">
            Update your administrative security credentials.
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-2 text-[#0F7A35] bg-green-50 dark:bg-green-950/20 dark:text-green-400 p-4 rounded-xl border border-green-200/50">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                Your administrative password has been changed successfully! 
              </div>
            </div>
            <Link
              href="/admin"
              className="w-full flex items-center justify-center space-x-1.5 py-3 bg-primary text-white font-bold rounded-xl text-sm transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
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
                <span>Changing password...</span>
              ) : (
                <span>Change Password</span>
              )}
            </button>
            
            <Link
              href="/admin"
              className="w-full flex items-center justify-center space-x-1.5 py-3 text-xs font-bold text-muted hover:text-foreground transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to dashboard</span>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
