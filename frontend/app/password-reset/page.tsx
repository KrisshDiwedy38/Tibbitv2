"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, extractDRFError } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, Loader2, Mail } from "lucide-react";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.post("/api/users/password-reset/", { email });
      // Go to confirm page and pass email
      router.push(`/password-reset-confirm?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(extractDRFError(err?.response?.data));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-surface to-surface" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black tracking-tighter text-primary hover:scale-105 transition-transform duration-200">
            TIBBIT
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-on-surface">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter your university email to receive a password reset code.
          </p>
        </div>

        <div className="bg-surface-container shadow-xl border-2 border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-primary/20 rounded-xl bg-surface focus:ring-0 focus:border-primary transition-colors text-on-surface placeholder:text-on-surface-variant/50 font-medium"
                  placeholder="student@university.edu"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-transparent rounded-xl shadow-sm text-sm font-bold text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Send Code
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm font-bold text-primary hover:text-primary-container transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
