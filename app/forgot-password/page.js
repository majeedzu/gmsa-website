'use html';
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (isSupabaseConfigured) {
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (resetErr) throw resetErr;
      } else {
        // Mock success simulation
        console.log(`Mock reset email triggered for: ${email}`);
      }
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.message || 'An error occurred while requesting password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card-bg border border-border-color p-8 sm:p-10 rounded-2xl shadow-lg relative">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Forgot Password
          </h2>
          <p className="text-xs text-muted">
            Enter your admin email address to receive a recovery reset link.
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-2 text-[#0F7A35] bg-green-50 dark:bg-green-950/20 dark:text-green-400 p-4 rounded-xl border border-green-200/50">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                Reset link sent! Please check your email inbox for instructions to reset your password.
              </div>
            </div>
            <Link
              href="/login"
              className="w-full flex items-center justify-center space-x-1 py-3 border border-border-color text-foreground hover:bg-light-gray font-semibold rounded-xl text-sm transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="mt-8 space-y-5">
            {error && (
              <div className="text-xs font-semibold text-red-650 bg-red-50 dark:bg-red-950/20 dark:text-red-400 p-4 rounded-xl border border-red-200/50">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-bold text-foreground/80 uppercase">Registered Email</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-xl shadow hover:scale-[1.01] active:scale-[0.99] hover:bg-primary/95 dark:hover:bg-secondary/95 transition-all cursor-pointer mt-4"
            >
              {loading ? (
                <span>Sending link...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Reset Instructions</span>
                </>
              )}
            </button>

            <Link
              href="/login"
              className="w-full flex items-center justify-center space-x-1 py-3 text-xs font-bold text-muted hover:text-foreground transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to login portal</span>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
