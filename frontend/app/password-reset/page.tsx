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
      const normalizedEmail = email.trim().toLowerCase();
      await api.post("/api/users/password-reset/", { email: normalizedEmail });
      // Go to confirm page and pass email
      router.push(`/password-reset-confirm?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (err: any) {
      setError(extractDRFError(err?.response?.data));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center hover:scale-105 transition-transform duration-200">
            <img src="/images/tibbit-logo-big.png" alt="Tibbit" className="h-[100px] w-auto" />
          </Link>
          <h1 className="mt-6 text-3xl sm:text-4xl font-black uppercase tracking-tighter text-on-surface">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter your university email to receive a password reset code.
          </p>
        </div>

        <div className="bg-surface-container border-4 border-black neo-shadow-primary p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border-2 border-error bg-error/10 text-error text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
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
                  className="block w-full pl-10 pr-3 py-3 border-2 border-outline-variant bg-surface focus:outline-none focus:border-primary-container transition-colors text-on-surface placeholder:text-on-surface-variant/50 font-medium"
                  placeholder="student@university.edu"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full flex items-center justify-center py-3.5 px-4 border-4 border-black text-sm font-black uppercase tracking-tighter text-on-primary-container bg-primary-container neo-shadow-secondary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#8e94ff] group"
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
            <Link href="/login" className="text-sm font-bold text-primary-container hover:text-primary transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
