"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastState, setToastState] = useState<"success" | null>(null);

  // Focus trap and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset form on close
      setEmail("");
      setMessage("");
      setError(null);
      setToastState(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
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
      const isProd = process.env.NODE_ENV === "production";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const endpoint = isProd ? "/api/users/contact/" : `${apiUrl || "http://localhost:8000"}/api/users/contact/`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.detail || data.message || "SUBMISSION FAILED. TRY AGAIN.");
      }

      setToastState("success");

      // Auto-close after toast
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "SUBMISSION FAILED. TRY AGAIN.");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 sm:p-12 md:p-16">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-tertiary-contact-container border-4 border-black p-5 sm:p-8 neo-shadow-primary animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-black/10 transition-colors"
        >
          <X className="w-6 h-6 text-black" />
        </button>

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
                className="w-full bg-white border-4 border-black p-3 sm:p-4 font-bold text-black focus:outline-none focus:ring-4 focus:ring-black transition-all placeholder:text-black/20 text-sm sm:text-base resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-black font-black text-xs uppercase animate-shake bg-white border-2 border-black p-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-black text-tertiary p-4 sm:p-6 border-4 border-black font-black uppercase tracking-tighter text-lg sm:text-xl transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-900"
                }`}
            >
              {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </form>
        </div>

        {/* Success Toast Overlay */}
        {toastState && (
          <div className="absolute inset-0 bg-tertiary flex flex-col items-center justify-center text-center p-8 border-4 border-black animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CheckCircle className="w-20 h-20 text-black mb-4 animate-bounce" />
            <h3 className="text-3xl font-black uppercase tracking-tighter italic text-black">
              SENT!
            </h3>
            <p className="font-bold opacity-90 mt-2 text-black">
              I'LL GET BACK TO YOU SOON.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
