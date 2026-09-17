"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User as UserIcon, Store } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0e0e0e]/80 border-b border-white/5">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 py-4 max-w-[1440px] mx-auto">
        <Link className="inline-flex items-center hover:scale-105 transition-transform duration-200" href="/">
          <img src="/images/tibbit-logo-small.png" alt="Tibbit" className="h-12 w-auto" />
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <Link
                href="/marketplace"
                className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-2 border-4 border-black font-black uppercase tracking-tighter hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-75 shadow-sm"
              >
                <Store className="w-4 h-4" />
                Go to Marketplace
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-primary-container font-black uppercase tracking-tighter text-sm px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-container text-on-primary-container px-6 py-2 border-4 border-black font-black uppercase tracking-tighter hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-75"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            type="button"
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

      {/* Mobile dropdown nav — anchored to the bottom of the header via top-full, so it follows
          the header wherever it is. Nothing here locks body scroll or touches window scroll
          position: that scroll lock was what used to jump the page to the top when the menu
          opened, not the sticky positioning. The menu just expands in place and blurs behind. */}
      <div
        className={`absolute inset-x-0 top-full z-40 bg-[#0e0e0e]/70 backdrop-blur-xl border-b border-white/10 flex flex-col items-center gap-6 overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-96 py-8 opacity-100 pointer-events-auto"
            : "max-h-0 py-0 opacity-0 pointer-events-none"
        }`}
      >
        {user ? (
          <Link
            onClick={() => setMenuOpen(false)}
            href="/marketplace"
            className="bg-primary-container text-on-primary-container px-8 py-3 border-4 border-black font-black uppercase tracking-tighter text-lg"
          >
            Go to Marketplace
          </Link>
        ) : (
          <>
            <Link
              onClick={() => setMenuOpen(false)}
              href="/login"
              className="text-white hover:text-primary-container font-['Space_Grotesk'] uppercase tracking-tighter text-2xl font-black px-4 py-2 transition-colors"
            >
              Login
            </Link>
            <Link
              onClick={() => setMenuOpen(false)}
              href="/register"
              className="bg-primary-container text-on-primary-container px-8 py-3 border-4 border-black font-black uppercase tracking-tighter text-lg"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
