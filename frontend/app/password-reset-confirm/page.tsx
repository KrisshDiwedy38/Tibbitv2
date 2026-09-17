"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, extractDRFError } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, Loader2, Lock, Eye, EyeOff } from "lucide-react";

function PasswordResetConfirmContent() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const passwordsMatch = password === confirmPassword;
  const showMismatch = confirmPassword.length > 0 && !passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/users/password-reset-confirm/", {
        email: email.trim().toLowerCase(),
        otp,
        password,
        password2: confirmPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(extractDRFError(err?.response?.data));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-surface-container border-4 border-black neo-shadow-primary p-10 text-center">
        <div className="w-16 h-16 bg-primary-container/10 border-2 border-primary-container flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-primary-container" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-on-surface mb-4">Password reset</h2>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          Your password has been changed. Sign in with your new password.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center py-3 px-6 border-4 border-black text-sm font-black uppercase tracking-tighter text-on-primary-container bg-primary-container neo-shadow-secondary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-75"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-container border-4 border-black neo-shadow-primary p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 border-2 border-error bg-error/10 text-error text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 text-center">
            Reset code
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full text-center text-3xl sm:text-4xl font-black tracking-[0.35em] py-4 px-4 border-4 border-black bg-surface text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-on-surface-variant" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 border-2 border-outline-variant bg-surface focus:outline-none focus:border-primary-container transition-colors text-on-surface font-medium"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-primary-container"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-on-surface-variant" />
            </div>
            <input
              type={showPassword2 ? "text" : "password"}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`block w-full pl-10 pr-12 py-3 border-2 bg-surface focus:outline-none transition-colors text-on-surface font-medium ${showMismatch
                  ? "border-error focus:border-error"
                  : "border-outline-variant focus:border-primary-container"
                }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword2((visible) => !visible)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-primary-container"
              aria-label={showPassword2 ? "Hide confirm password" : "Show confirm password"}
            >
              {showPassword2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {showMismatch && (
            <p className="mt-2 text-xs font-bold text-error">
              Passwords do not match.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            otp.length !== 6 ||
            password.length < 8 ||
            confirmPassword.length < 8 ||
            !passwordsMatch
          }
          className="w-full flex items-center justify-center py-3.5 px-4 border-4 border-black text-sm font-black uppercase tracking-tighter text-on-primary-container bg-primary-container neo-shadow-secondary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#8e94ff] group"
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
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center hover:scale-105 transition-transform duration-200">
            <img src="/images/tibbit-logo-big.png" alt="Tibbit" className="h-[100px] w-auto" />
          </Link>
          <h1 className="mt-6 text-3xl sm:text-4xl font-black uppercase tracking-tighter text-on-surface">
            Set new password
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter the 6-digit code sent to your email and your new password.
          </p>
        </div>

        <Suspense fallback={<div className="flex justify-center p-12 border-4 border-black bg-surface-container"><Loader2 className="h-8 w-8 animate-spin text-primary-container" /></div>}>
          <PasswordResetConfirmContent />
        </Suspense>
      </div>
    </main>
  );
}
