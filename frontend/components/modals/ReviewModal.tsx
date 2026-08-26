"use client";

import { useState } from "react";
import BaseModal from "./BaseModal";
import { api, extractDRFError } from "@/lib/api";
import { Star, Loader2, Check, Sparkles } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: number;
  partnerName: string;
  onSuccess: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  transactionId,
  partnerName,
  onSuccess
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      await api.post("/api/transactions/reviews/", {
        transaction: transactionId,
        rating,
        comment: comment.trim()
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setComment("");
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(extractDRFError(err?.response?.data) || "Failed to submit review.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      containerClassName="max-w-md bg-surface-container border-4 border-black rounded-3xl"
    >
      <div className="space-y-6 text-center">
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto text-primary">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-on-surface">
            Rate Your Experience
          </h3>
          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
            How was your transaction with <strong className="text-on-surface">{partnerName}</strong>? Your feedback builds trust in our campus community.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-error/10 border border-error/30 rounded-xl text-error text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {isSuccess ? (
          <div className="p-6 bg-primary/20 border-2 border-primary rounded-2xl text-primary font-black text-center space-y-2 animate-in zoom-in">
            <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <p className="text-base">Review Submitted! Thank you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating Picker */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating !== null ? hoverRating : rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-9 h-9 transition-colors ${
                        active
                          ? "fill-primary text-primary"
                          : "text-outline-variant/40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="text-left">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Feedback / Comment (Optional)
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Item condition as described, friendly meetup at the library..."
                className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-2xl text-xs font-medium text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-container text-on-primary-container border-4 border-black rounded-2xl font-black uppercase tracking-tighter text-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        )}
      </div>
    </BaseModal>
  );
}
