"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, extractDRFError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowRight, Loader2, KeyRound, CheckCircle2 } from "lucide-react";

function VerifyOTPContent() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();
  const { checkAuth } = useAuth();

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/users/verify-otp/", { email, otp });
      
      const message = response.data.message;
      if (message && message.includes("notify you once your university is allowed")) {
        // Waitlist logic!
        setIsWaitlisted(true);
        setSuccessMessage(message);
      } else {
        // Success logic (allowed)
        await checkAuth();
        router.push("/marketplace");
      }
    } catch (err: any) {
      setError(extractDRFError(err?.response?.data));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/api/users/resend-otp/", { email });
      setError("");
      setSuccessMessage("A new OTP has been sent to your email.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      setError(extractDRFError(err?.response?.data));
    }
  };

  if (isWaitlisted) {
    return (
      <div className="bg-surface-container shadow-xl border-2 border-primary/20 rounded-2xl p-10 backdrop-blur-sm text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-4">Email Verified!</h2>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          {successMessage}
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center py-3 px-6 border-2 border-transparent rounded-xl shadow-sm text-sm font-bold text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-container shadow-xl border-2 border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-on-surface">Verify your email</h2>
        <p className="text-sm text-on-surface-variant mt-2">
          We sent a 6-digit code to <span className="font-semibold text-primary">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium animate-shake">
            {error}
          </div>
        )}
        {successMessage && !isWaitlisted && (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            {successMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">
            Verification Code
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

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-transparent rounded-xl shadow-sm text-sm font-bold text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Verify & Continue
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-on-surface-variant">
          Didn't receive the code?{" "}
          <button 
            type="button"
            onClick={handleResend}
            className="font-bold text-primary hover:text-primary-container transition-colors"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-surface to-surface" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black tracking-tighter text-primary hover:scale-105 transition-transform duration-200">
            TIBBIT
          </Link>
        </div>
        
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
          <VerifyOTPContent />
        </Suspense>
      </div>
    </div>
  );
}
