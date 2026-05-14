"use client";

import { useTypewriter } from "@/hooks/useTypewriter";

const CAMPUS_STATS = [
  "102 CAMPUSES JOINING SOON",
  "1000+ STUDENTS BY NEXT SEMESTER",
  "YOUR FIRST 100 USERS ARE WAITING"
];

export default function DynamicHUD() {
  const campusText = useTypewriter(CAMPUS_STATS, 50, 30, 2000);

  return (
    <div className="w-full bg-surface-container-lowest border-t-2 border-primary-container py-2 sm:py-3 px-4 sm:px-8 flex justify-between items-center overflow-hidden">
      <div className="flex items-center gap-4 sm:gap-6 whitespace-normal sm:whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse flex-shrink-0"></span>
          <span className="text-primary-container font-black uppercase text-[8px] sm:text-[10px] tracking-widest font-mono leading-tight">
            SYSTEM_STABLE: {campusText}<span className="opacity-70 animate-pulse">_</span>
          </span>
        </div>
      </div>
    </div>
  );
}
