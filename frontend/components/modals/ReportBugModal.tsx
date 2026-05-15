"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import BaseModal from "./BaseModal";
import SuccessToast from "./SuccessToast";
import { apiPost } from "@/lib/api";

interface ReportBugModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportBugModal({ isOpen, onClose }: ReportBugModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resetForm = () => {
    setEmail("");
    setMessage("");
    setError(null);
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError("BUG DESCRIPTION IS REQUIRED");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("INVALID EMAIL FORMAT");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiPost("/api/users/report-bug", { email, message });
      setIsSuccess(true);
      setTimeout(handleClose, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "SUBMISSION FAILED. TRY AGAIN.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      outerClassName="p-8 sm:p-12 md:p-16"
      containerClassName="max-w-2xl bg-error-dim"
      closeIconClassName="text-white"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic text-white">
            REPORT A BUG
          </h2>
          <p className="text-sm font-bold text-white/80 uppercase tracking-widest">
            Spotted an issue? Let us know.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-black/70">
              Your Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOU@EMAIL.COM"
              className="w-full bg-white border-4 border-black p-3 sm:p-4 font-bold text-black focus:outline-none focus:ring-4 focus:ring-black transition-all placeholder:text-black/20 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-black/70">
              Bug Description
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="WHAT WENT WRONG? BE SPECIFIC. HIT ENTER TO SEND"
              rows={4}
              maxLength={2000}
              className="w-full bg-white border-4 border-black p-3 sm:p-4 font-bold text-black focus:outline-none focus:ring-4 focus:ring-black transition-all placeholder:text-black/20 text-sm sm:text-base resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-white font-black text-xs uppercase animate-shake bg-black p-2 border-2 border-white/20">
              <AlertCircle className="w-4 h-4 text-[#ff3333]" />
              {error}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-fit px-8 py-3 sm:px-12 sm:py-4 bg-black text-[#ff3333] border-4 border-black font-black uppercase tracking-tighter text-base sm:text-lg transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-900"
              }`}
            >
              {isSubmitting ? "SENDING..." : "SUBMIT REPORT"}
            </button>
          </div>
        </form>
      </div>

      {isSuccess && (
        <SuccessToast
          bgClassName="bg-[#ff3333]"
          textClassName="text-white"
          title="SQUASHED!"
          subtitle="THANKS FOR REPORTING. WE'LL LOOK INTO IT."
        />
      )}
    </BaseModal>
  );
}
