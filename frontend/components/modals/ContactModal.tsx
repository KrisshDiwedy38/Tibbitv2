"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import BaseModal from "./BaseModal";
import SuccessToast from "./SuccessToast";
import { apiPost } from "@/lib/api";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
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
      setError("MESSAGE IS REQUIRED");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("INVALID EMAIL FORMAT");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiPost("/api/users/contact", { email, message });
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
      containerClassName="max-w-2xl bg-tertiary-contact-container"
      closeIconClassName="text-black"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic text-black">
            GET IN TOUCH
          </h2>
          <p className="text-sm font-bold text-black/70 uppercase tracking-widest">
            Direct line to the founder.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-black/50">
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
            <label className="text-xs font-black uppercase tracking-widest text-black/50">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="WHAT'S ON YOUR MIND? HIT ENTER TO SEND"
              rows={4}
              maxLength={2000}
              className="w-full bg-white border-4 border-black p-3 sm:p-4 font-bold text-black focus:outline-none focus:ring-4 focus:ring-black transition-all placeholder:text-black/20 text-sm sm:text-base resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-black font-black text-xs uppercase animate-shake bg-white border-2 border-black p-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-fit px-8 py-3 sm:px-12 sm:py-4 bg-black text-tertiary border-4 border-black font-black uppercase tracking-tighter text-base sm:text-lg transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-900"
                }`}
            >
              {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </div>
        </form>
      </div>

      {isSuccess && (
        <SuccessToast
          bgClassName="bg-tertiary"
          textClassName="text-black"
          title="SENT!"
          subtitle="I'LL GET BACK TO YOU SOON."
        />
      )}
    </BaseModal>
  );
}
