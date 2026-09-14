"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, extractDRFError } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { getPostAuthDestination } from "@/lib/utils";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      await api.post("/api/users/register/", { ...formData, email: normalizedEmail });
      // Redirect to OTP Verification page and pass email
      const redirect = getPostAuthDestination(new URLSearchParams(window.location.search).get("redirect"));
      const redirectQuery = redirect !== "/marketplace"
        ? `&redirect=${encodeURIComponent(redirect)}`
        : "";
      router.push(`/verify-otp?email=${encodeURIComponent(normalizedEmail)}${redirectQuery}`);
    } catch (err: any) {
      setError(extractDRFError(err?.response?.data));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black italic uppercase tracking-tighter text-primary-container hover:scale-105 transition-transform duration-200">
            TIBBIT
          </Link>
          <h1 className="mt-6 text-3xl sm:text-4xl font-black uppercase tracking-tighter text-on-surface">
            Apply for access
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant max-w-sm mx-auto">
            Join the waitlist. Only students with a valid university email are permitted.
          </p>
        </div>

        <div className="bg-surface-container border-4 border-black neo-shadow-primary p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border-2 border-error bg-error/10 text-error text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-outline-variant bg-surface focus:outline-none focus:border-primary-container transition-colors text-on-surface font-medium"
                    placeholder="Satoshi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <input
                    type="text"
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-outline-variant bg-surface focus:outline-none focus:border-primary-container transition-colors text-on-surface font-medium"
                    placeholder="Nakamoto"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                University Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-outline-variant bg-surface focus:outline-none focus:border-primary-container transition-colors text-on-surface placeholder:text-on-surface-variant/50 font-medium"
                  placeholder="student@university.edu"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
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
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <input
                    type={showPassword2 ? "text" : "password"}
                    name="password2"
                    required
                    minLength={8}
                    value={formData.password2}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border-2 border-outline-variant bg-surface focus:outline-none focus:border-primary-container transition-colors text-on-surface font-medium"
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
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary-container hover:text-primary transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
