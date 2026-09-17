"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, extractDRFError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { getPostAuthDestination } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { checkAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.post("/api/users/login/", { email: email.trim().toLowerCase(), password });
      await checkAuth(); // Reload user state
      router.push(getPostAuthDestination(new URLSearchParams(window.location.search).get("redirect")));
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
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter your credentials to access the marketplace
          </p>
        </div>

        <div className="bg-surface-container border-4 border-black neo-shadow-primary p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border-2 border-error bg-error/10 text-error text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
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

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-on-surface">
                    Password
                  </label>
                  <Link href="/password-reset" className="text-xs font-bold text-primary-container hover:text-primary transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 border-4 border-black text-sm font-black uppercase tracking-tighter text-on-primary-container bg-primary-container neo-shadow-secondary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#8e94ff] group"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-on-surface-variant">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-primary-container hover:text-primary transition-colors">
                Apply for access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
