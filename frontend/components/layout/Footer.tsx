"use client";

import Link from "next/link";

interface FooterProps {
  onContactClick: () => void;
  onBugClick: () => void;
}

export default function Footer({ onContactClick, onBugClick }: FooterProps) {
  return (
    <footer className="bg-[#0e0e0e] border-t-4 border-primary-container w-full px-4 sm:px-8 py-8 sm:py-12 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
      <div className="flex flex-col items-center md:items-start gap-2 md:flex-1 w-full md:w-auto">
        <div className="text-xl font-black text-primary-container font-['Space_Grotesk']">TIBBIT</div>
        <div className="text-[#ffffff80] font-['Space_Grotesk'] text-xs font-bold uppercase text-center md:text-left">Copyright © 2026 TIBBIT. All rights reserved.</div>
      </div>
      <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 md:flex-shrink-0">
        <Link className="text-white/50 hover:text-tertiary font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150" href="/privacy">Privacy</Link>
        <Link className="text-white/50 hover:text-tertiary font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150" href="/terms">Terms</Link>
        <button onClick={onContactClick} className="text-white/50 hover:text-tertiary font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150">Contact</button>
      </nav>
      <div className="flex justify-center md:justify-end gap-4 md:flex-1 w-full md:w-auto">
        <button onClick={onBugClick} className="text-white/50 hover:text-[#ff3333] font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">bug_report</span>
          Report Bug
        </button>
      </div>
    </footer>
  );
}
