"use client";

import { useState } from "react";

interface NavbarProps {
  onJoinClick: () => void;
}

export default function Navbar({ onJoinClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0e0e0e]/80 border-b border-white/5">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 py-4 max-w-[1440px] mx-auto">
        <a className="text-2xl font-black italic tracking-tighter text-primary-container font-['Space_Grotesk'] uppercase" href="#home">
          TIBBIT
        </a>
        <div className="flex items-center gap-4 sm:gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-white/70 hover:text-primary-container hover:bg-[#262626] transition-none font-['Space_Grotesk'] uppercase tracking-tighter text-sm font-bold px-2 py-1" href="#ecosystem">Ecosystem</a>
            <a className="text-white/70 hover:text-primary-container hover:bg-[#262626] transition-none font-['Space_Grotesk'] uppercase tracking-tighter text-sm font-bold px-2 py-1" href="#manifesto">Manifesto</a>
          </nav>
          <button
            onClick={onJoinClick}
            className="hidden sm:block bg-primary-container text-on-primary-container px-6 py-2 border-4 border-black font-black uppercase tracking-tighter hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-75"
          >
            Join
          </button>
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[6px]"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[3px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
            <span className={`block w-6 h-[3px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-[3px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Overlay Nav */}
      <div
        className={`fixed inset-0 top-[73px] bg-[#0e0e0e]/98 backdrop-blur-md z-40 flex flex-col items-center justify-start pt-16 gap-8 transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <a
          onClick={() => setMenuOpen(false)}
          className="text-white/80 hover:text-primary-container font-['Space_Grotesk'] uppercase tracking-tighter text-3xl font-black px-4 py-2 transition-colors"
          href="#ecosystem"
        >
          Ecosystem
        </a>
        <a
          onClick={() => setMenuOpen(false)}
          className="text-white/80 hover:text-primary-container font-['Space_Grotesk'] uppercase tracking-tighter text-3xl font-black px-4 py-2 transition-colors"
          href="#manifesto"
        >
          Manifesto
        </a>
        <button
          onClick={() => {
            setMenuOpen(false);
            onJoinClick();
          }}
          className="bg-primary-container text-on-primary-container px-10 py-4 border-4 border-black font-black uppercase tracking-tighter text-xl mt-4"
        >
          Join Waitlist
        </button>
      </div>
    </header>
  );
}
