"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Classes for the outer wrapper — controls padding around the modal */
  outerClassName?: string;
  /** Classes for the modal container — controls bg, max-width, text color */
  containerClassName?: string;
  /** Classes for the X close icon */
  closeIconClassName?: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  outerClassName = "p-6 sm:p-8 md:p-12",
  containerClassName = "",
  closeIconClassName = "",
}: BaseModalProps) {
  useBodyScrollLock(isOpen);

  // Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${outerClassName}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className={`relative w-full border-4 border-black p-5 sm:p-8 neo-shadow-primary animate-in fade-in zoom-in duration-200 ${containerClassName}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-black/10 transition-colors"
        >
          <X className={`w-6 h-6 ${closeIconClassName}`} />
        </button>

        {children}
      </div>
    </div>
  );
}
