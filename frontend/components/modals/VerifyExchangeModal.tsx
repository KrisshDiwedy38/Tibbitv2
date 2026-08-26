"use client";

import { useState } from "react";
import BaseModal from "./BaseModal";
import { api, extractDRFError } from "@/lib/api";
import { ShieldCheck, KeyRound, Loader2, Check } from "lucide-react";

interface VerifyExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: number;
  partnerName: string;
  onSuccess: (updatedTransaction: any) => void;
}

export default function VerifyExchangeModal({
  isOpen,
  onClose,
  transactionId,
  partnerName,
  onSuccess
}: VerifyExchangeModalProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit code.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post(`/api/transactions/${transactionId}/verify_otp/`, {
        otp: otp.trim()
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setOtp("");
        onSuccess(res.data.transaction);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(extractDRFError(err?.response?.data) || "Invalid verification code.");
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
          <KeyRound className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-on-surface">
            Verify Exchange
          </h3>
          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
            Enter the 6-digit code given to you in person by <strong className="text-on-surface">{partnerName}</strong> to confirm the handoff.
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
            <p className="text-base">Code Verified Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                className="w-full text-center text-3xl tracking-[0.6em] font-black py-4 px-4 bg-surface border-4 border-black rounded-2xl text-primary focus:outline-none focus:border-primary-container font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-container text-on-primary-container border-4 border-black rounded-2xl font-black uppercase tracking-tighter text-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Confirm & Complete Trade
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </BaseModal>
  );
}
