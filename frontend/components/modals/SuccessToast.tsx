"use client";

import { CheckCircle } from "lucide-react";

interface SuccessToastProps {
  /** Background class for the overlay — e.g. "bg-primary-container" */
  bgClassName: string;
  /** Text color class — e.g. "text-black" or "text-white" */
  textClassName: string;
  /** Main heading — e.g. "YOU'RE IN!" */
  title: string;
  /** Subtext — e.g. "WE'LL PING YOU WHEN WE LAND ON CAMPUS." */
  subtitle: string;
}

export default function SuccessToast({
  bgClassName,
  textClassName,
  title,
  subtitle,
}: SuccessToastProps) {
  return (
    <div
      className={`absolute inset-0 ${bgClassName} flex flex-col items-center justify-center text-center p-8 border-4 border-black animate-in fade-in slide-in-from-bottom-4 duration-300`}
    >
      <CheckCircle className={`w-20 h-20 ${textClassName} mb-4 animate-bounce`} />
      <h3 className={`text-3xl font-black uppercase tracking-tighter italic ${textClassName}`}>
        {title}
      </h3>
      <p className={`font-bold opacity-90 mt-2 ${textClassName}`}>{subtitle}</p>
    </div>
  );
}
