"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, extractDRFError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowRight, Loader2, KeyRound, CheckCircle2, GraduationCap, BellRing, ArrowLeft } from "lucide-react";

function VerifyOTPContent() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [universityName, setUniversityName] = useState("");
  
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
      
      if (response.data.university_approved === false || (response.data.message && response.data.message.includes("not yet approved"))) {
        // Unapproved University Gating Screen
        setIsWaitlisted(true);
        setUniversityName(response.data.university_name || "Your University");
        setSuccessMessage(response.data.message);
      } else {
        // University is approved -> Log in and access Marketplace
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
      <div className="bg-surface-container shadow-2xl border-2 border-outline-variant/30 rounded-3xl p-8 sm:p-10 text-center space-y-6 animate-fade-in-up">
        {/* Animated Badge & Icon */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-50"></div>
          <div className="relative w-20 h-20 bg-primary/20 border-2 border-primary/40 rounded-full flex items-center justify-center text-primary">
            <GraduationCap className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-black text-primary uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-on-surface uppercase tracking-tight">
            Campus Awaiting Approval
          </h2>
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed max-w-md mx-auto font-medium">
          Your account is confirmed! However, <span className="font-bold text-on-surface">{universityName}</span> is currently pending verification before campus marketplace trading is activated.
        </p>

        {/* Reassurance Info Box */}
        <div className="p-4 rounded-2xl bg-surface border-2 border-outline-variant/20 flex items-start gap-3 text-left">
          <BellRing className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-on-surface">You're on the priority list</p>
            <p className="text-xs text-on-surface-variant">
              We will notify you at <span className="font-bold text-primary">{email}</span> as soon as your university is approved by the Tibbit team.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-8 border-4 border-black rounded-xl text-xs font-black uppercase tracking-tight text-on-primary-container bg-primary-container hover:translate-x-[1px] hover:translate-y-[1px] transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container shadow-xl border-2 border-outline-variant/30 rounded-2xl p-8 backdrop-blur-sm">
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
          <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
            6-Digit OTP Code
          </label>
          <div className="relative">
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 px-4 rounded-xl bg-surface border-2 border-outline-variant/30 text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-colors"
            />
            <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-transparent rounded-xl shadow-sm text-sm font-bold text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Verify & Enter
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-on-surface-variant">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            className="text-primary hover:underline font-bold"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <span className="text-3xl font-black tracking-tight text-on-surface font-['Space_Grotesk']">
            tibbit<span className="text-primary">.</span>
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={
          <div className="bg-surface-container shadow-xl border-2 border-primary/20 rounded-2xl p-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }>
          <VerifyOTPContent />
        </Suspense>
      </div>
    </div>
  );
}
