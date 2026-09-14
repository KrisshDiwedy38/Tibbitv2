"use client";

import BaseModal from "./BaseModal";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  isLoading?: boolean;
}

/**
 * Site-wide replacement for native window.confirm()/alert() dialogs.
 * Use for any "are you sure?" prompt so it matches the app's modal styling.
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  const isDanger = variant === "danger";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      containerClassName="max-w-md bg-surface-container border-4 border-black rounded-3xl"
    >
      <div className="space-y-6 text-center">
        <div
          className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center mx-auto ${
            isDanger
              ? "bg-error/10 border-error/30 text-error"
              : "bg-primary/10 border-primary/30 text-primary"
          }`}
        >
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-on-surface">
            {title}
          </h3>
          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-4 px-6 bg-surface text-on-surface border-4 border-black rounded-2xl font-black uppercase tracking-tighter text-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 border-4 border-black rounded-2xl font-black uppercase tracking-tighter text-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer shadow-md ${
              isDanger
                ? "bg-error text-white"
                : "bg-primary-container text-on-primary-container"
            }`}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
