"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, extractDRFError } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, Loader2, Lock, KeyRound } from "lucide-react";

function PasswordResetConfirmContent() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.post("/api/users/password-reset-confirm/", { email, otp, password });
      setSuccess(true);
    } catch (err: any) {
      setError(extractDRFError(err?.response?.data));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-surface-container shadow-xl border-2 border-primary/20 rounded-2xl p-10 backdrop-blur-sm text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-4">Password Reset!</h2>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          Your password has been changed successfully. You can now log in with your new password.
        </p>
        <Link 
          href="/login"
          className="inline-flex items-center justify-center py-3 px-6 border-2 border-transparent rounded-xl shadow-sm text-sm font-bold text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-container shadow-xl border-2 border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Reset Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-on-surface-variant" />
            </div>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="block w-full pl-10 pr-3 py-3 border-2 border-primary/20 rounded-xl bg-surface focus:ring-0 focus:border-primary transition-colors text-on-surface text-center tracking-[0.5em] font-bold text-lg"
              placeholder="000000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-on-surface-variant" />
            </div>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border-2 border-primary/20 rounded-xl bg-surface focus:ring-0 focus:border-primary transition-colors text-on-surface font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6 || password.length < 8}
          className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-transparent rounded-xl shadow-sm text-sm font-bold text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Change Password
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function PasswordResetConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-surface to-surface" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black tracking-tighter text-primary hover:scale-105 transition-transform duration-200">
            TIBBIT
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-on-surface">
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter the 6-digit code sent to your email and your new password.
          </p>
        </div>
        
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
          <PasswordResetConfirmContent />
        </Suspense>
      </div>
    </div>
  );
}
