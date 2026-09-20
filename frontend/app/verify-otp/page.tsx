"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, extractDRFError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ArrowRight, Loader2, CheckCircle2, GraduationCap, BellRing, ArrowLeft } from "lucide-react";
import { getPostAuthDestination } from "@/lib/utils";

function VerifyOTPContent() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [universityName, setUniversityName] = useState("");

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirect = searchParams.get("redirect");
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
      const response = await api.post("/api/users/verify-otp/", { email: email.trim().toLowerCase(), otp });

      if (response.data.university_approved === false || (response.data.message && response.data.message.includes("not yet approved"))) {
        // Unapproved University Gating Screen
        setIsWaitlisted(true);
        setUniversityName(response.data.university_name || "Your University");
        setSuccessMessage(response.data.message);
      } else {
        // University is approved -> Log in and access Marketplace
        await checkAuth();
        router.push(getPostAuthDestination(redirect));
      }
    } catch (err: any) {
      setError(extractDRFError(err?.response?.data));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/api/users/resend-otp/", { email: email.trim().toLowerCase() });
      setError("");
      setSuccessMessage("A new OTP has been sent to your email.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      setError(extractDRFError(err?.response?.data));
    }
  };

  if (isWaitlisted) {
    return (
      <div className="bg-surface-container border-4 border-black neo-shadow-primary p-8 sm:p-10 text-center space-y-6">
        {/* Badge & Icon */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 bg-primary-container/20 rounded-full animate-ping opacity-50"></div>
          <div className="relative w-20 h-20 bg-primary-container/10 border-2 border-primary-container flex items-center justify-center text-primary-container">
            <GraduationCap className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-primary-container bg-primary-container/10 text-xs font-black text-primary-container uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-on-surface">
            Campus Awaiting Approval
          </h2>
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed max-w-md mx-auto font-medium">
          Your account is confirmed! However, <span className="font-bold text-on-surface">{universityName}</span> is currently pending verification before campus marketplace trading is activated.
        </p>

        {/* Reassurance Info Box */}
        <div className="p-4 border-2 border-outline-variant/40 bg-surface flex items-start gap-3 text-left">
          <BellRing className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-on-surface">You're on the priority list</p>
            <p className="text-xs text-on-surface-variant">
              We will notify you at <span className="font-bold text-primary-container">{email}</span> as soon as your university is approved by the Tibbit team.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-8 border-4 border-black text-xs font-black uppercase tracking-tighter text-on-primary-container bg-primary-container neo-shadow-secondary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-75"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container border-4 border-black neo-shadow-primary p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-on-surface">Verify your email</h2>
        <p className="text-sm text-on-surface-variant mt-2">
          We sent a 6-digit code to <span className="font-bold text-primary-container">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 border-2 border-error bg-error/10 text-error text-sm font-medium animate-shake">
            {error}
          </div>
        )}
        {successMessage && !isWaitlisted && (
          <div className="p-4 border-2 border-primary-container bg-primary-container/10 text-primary-container text-sm font-medium">
            {successMessage}
          </div>
        )}

        <div>
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="w-full text-center text-3xl sm:text-4xl font-black tracking-[0.35em] py-4 px-4 border-4 border-black bg-surface text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full flex items-center justify-center py-3.5 px-4 border-4 border-black text-sm font-black uppercase tracking-tighter text-on-primary-container bg-primary-container neo-shadow-secondary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#8e94ff] group"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Verify & Enter
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-on-surface-variant">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            className="text-primary-container hover:text-primary underline font-bold"
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
    <main className="relative min-h-screen flex flex-col justify-center px-4 py-16 sm:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center hover:scale-105 transition-transform duration-200">
          <img src="/images/tibbit-logo-big.png" alt="Tibbit" className="h-[100px] w-auto" />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={
          <div className="bg-surface-container border-4 border-black neo-shadow-primary p-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-container" />
          </div>
        }>
          <VerifyOTPContent />
        </Suspense>
      </div>
    </main>
  );
}
