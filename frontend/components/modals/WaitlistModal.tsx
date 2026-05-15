"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import BaseModal from "./BaseModal";
import SuccessToast from "./SuccessToast";
import { apiPost } from "@/lib/api";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [uniName, setUniName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastState, setToastState] = useState<"success" | "already_in" | null>(null);

  const resetForm = () => {
    setEmail("");
    setUniName("");
    setError(null);
    setToastState(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!uniName.trim()) {
      setError("UNIVERSITY NAME IS REQUIRED");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("INVALID EMAIL FORMAT");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiPost("/api/users/waitlist", { email, university_name: uniName });
      setToastState("success");
      setTimeout(handleClose, 3000);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "SUBMISSION FAILED. TRY AGAIN.";
      if (errorMsg.includes("ALREADY ON THE WAITLIST") || errorMsg.includes("ALREADY REGISTERED")) {
        setToastState("already_in");
        setTimeout(handleClose, 4000);
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      outerClassName="p-10 sm:p-12 md:p-16"
      containerClassName="max-w-md bg-waitlist-container"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic">
            JOIN THE <br /> WAITLIST
          </h2>
          <p className="text-sm font-bold opacity-70 uppercase tracking-widest">
            Securing early access for builders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-black/50">
              University Name
            </label>
            <input
              type="text"
              value={uniName}
              onChange={(e) => setUniName(e.target.value.toUpperCase())}
              placeholder="UNIVERSITY OF VIBES"
              maxLength={200}
              className="w-full bg-white border-4 border-black p-3 sm:p-4 font-bold text-black focus:outline-none focus:ring-4 focus:ring-secondary transition-all placeholder:text-black/20 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-black/50">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR.EMAIL@VIBES.EDU"
              maxLength={200}
              className="w-full bg-white border-4 border-black p-3 sm:p-4 font-bold text-black focus:outline-none focus:ring-4 focus:ring-secondary transition-all placeholder:text-black/20 text-sm sm:text-base"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-error font-black text-xs uppercase animate-shake">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-black text-primary-container p-4 sm:p-6 border-4 border-black font-black uppercase tracking-tighter text-lg sm:text-xl transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-900"
            }`}
          >
            {isSubmitting ? "SYNCING..." : "LOCK IT IN"}
          </button>
        </form>
      </div>

      {toastState && (
        <SuccessToast
          bgClassName="bg-primary-container"
          textClassName="text-black"
          title={toastState === "success" ? "YOU\u2019RE IN!" : "YOU\u2019RE ALREADY IN!"}
          subtitle={
            toastState === "success"
              ? "WE\u2019LL PING YOU WHEN WE LAND ON CAMPUS."
              : "WE\u2019VE GOT YOUR DETAILS. HANG TIGHT!"
          }
        />
      )}
    </BaseModal>
  );
}
