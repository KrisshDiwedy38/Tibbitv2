"use client";

import Link from "next/link";
import HeroRibbon from "./HeroRibbon";
import { useAuth } from "@/contexts/AuthContext";

export default function HeroSection() {
  const { user } = useAuth();
  const ctaHref = user ? "/marketplace/profile" : "/register";

  return (
    <section className="relative min-h-[90vh] sm:min-h-[70vh] lg:min-h-[819px] flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-20 py-12 sm:py-16 lg:py-20 overflow-hidden text-center" id="home">
      {/* Background Graphic */}
      <HeroRibbon />

      <div className="max-w-4xl space-y-6 sm:space-y-8 flex flex-col items-center z-10 relative pointer-events-none">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter">
          TIBBIT: <br />
          <span className="text-primary-container">TRADE. BUILD. HUSTLE.</span> <br />
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-3 sm:pt-8 justify-center items-center w-full">
          <Link
            href={ctaHref}
            className="w-full sm:w-auto bg-primary-container text-on-primary-container px-5 sm:px-8 lg:px-10 py-3 sm:py-5 border-[3px] sm:border-4 border-black text-base sm:text-xl lg:text-2xl font-black uppercase tracking-tighter neo-shadow-secondary hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-75 pointer-events-auto inline-block"
          >
            Start Hustling
          </Link>
        </div>
      </div>
    </section>
  );
}
