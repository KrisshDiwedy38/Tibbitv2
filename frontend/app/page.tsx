"use client";

import { useState } from "react";
import BackgroundGridHover from "../components/BackgroundGridHover";
import DynamicHUD from "../components/DynamicHUD";
import WaitlistModal from "../components/WaitlistModal";
import StudentServicesExpander from "../components/StudentServicesExpander";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <BackgroundGridHover />

      {/* TopNavBar */}
      <header className="bg-[#0e0e0e] border-b-4 border-[#262626] sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 py-4 max-w-[1440px] mx-auto">
          <a className="text-2xl font-black italic tracking-tighter text-[#abfc01] font-['Space_Grotesk'] uppercase" href="#home">
            TIBBIT
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-white/70 hover:text-[#abfc01] hover:bg-[#262626] transition-none font-['Space_Grotesk'] uppercase tracking-tighter text-sm font-bold px-2 py-1" href="#ecosystem">Market</a>
            <a className="text-white/70 hover:text-[#abfc01] hover:bg-[#262626] transition-none font-['Space_Grotesk'] uppercase tracking-tighter text-sm font-bold px-2 py-1" href="#ecosystem">Services</a>
            <a className="text-white/70 hover:text-[#abfc01] hover:bg-[#262626] transition-none font-['Space_Grotesk'] uppercase tracking-tighter text-sm font-bold px-2 py-1" href="#manifesto">Manifesto</a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={openModal}
              className="hidden sm:block bg-[#abfc01] text-[#3c5c00] px-6 py-2 border-4 border-black font-black uppercase tracking-tighter hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-75"
            >
              Waitlist
            </button>
            {/* Hamburger Menu Button — mobile only */}
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
          className={`fixed inset-0 top-[73px] bg-[#0e0e0e]/98 backdrop-blur-md z-40 flex flex-col items-center justify-start pt-16 gap-8 transition-all duration-300 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        >
          <a
            onClick={() => setMenuOpen(false)}
            className="text-white/80 hover:text-[#abfc01] font-['Space_Grotesk'] uppercase tracking-tighter text-3xl font-black px-4 py-2 transition-colors"
            href="#ecosystem"
          >
            Market
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="text-white/80 hover:text-[#abfc01] font-['Space_Grotesk'] uppercase tracking-tighter text-3xl font-black px-4 py-2 transition-colors"
            href="#ecosystem"
          >
            Services
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="text-white/80 hover:text-[#abfc01] font-['Space_Grotesk'] uppercase tracking-tighter text-3xl font-black px-4 py-2 transition-colors"
            href="#manifesto"
          >
            Manifesto
          </a>
          <button
            onClick={() => {
              setMenuOpen(false);
              openModal();
            }}
            className="bg-[#abfc01] text-[#3c5c00] px-10 py-4 border-4 border-black font-black uppercase tracking-tighter text-xl mt-4"
          >
            Join Waitlist
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] sm:min-h-[70vh] lg:min-h-[819px] flex flex-col justify-center items-start px-4 sm:px-8 md:px-16 lg:px-20 py-12 sm:py-16 lg:py-20 overflow-hidden" id="home">
          {/* Background Graphic */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 -z-10">
            <div className="opacity-10 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] border-[10px] sm:border-[15px] border-secondary animate-spin-slow"></div>
          </div>

          <div className="max-w-4xl space-y-6 sm:space-y-8">
            <div className="inline-block bg-secondary text-on-secondary px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] neo-shadow-primary">
              Coming soon at University Hubs
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter">
              TIBBIT: <br />
              <span className="text-primary-container">TRADE. BUILD. HUSTLE.</span> <br />
            </h1>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.85] tracking-tighter">
              THE UNAPOLOGETIC <br />
              STUDENT ECOSYSTEM
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white/70 max-w-2xl leading-relaxed">
              The playground for Gen Z hustlers. Trade goods, launch services, and scale your campus startup on a platform built for builders, by builders.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-3 sm:pt-8 items-center sm:items-start w-full">
              <button
                onClick={openModal}
                className="w-[50%] sm:w-auto bg-primary-container text-on-primary-container px-5 sm:px-8 lg:px-10 py-3 sm:py-5 border-[3px] sm:border-4 border-black text-base sm:text-xl lg:text-2xl font-black uppercase tracking-tighter neo-shadow-secondary hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-75"
              >
                Start Hustling
              </button>
            </div>
          </div>
        </section>

        {/* Bento Categories */}
        <section className="px-12 sm:px-12 md:px-16 lg:px-30 py-12 sm:py-20 lg:py-24 bg-surface-container-low" id="ecosystem">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black uppercase mb-8 sm:mb-12 lg:mb-16 flex items-center gap-4">
            <span className="w-6 sm:w-12 h-1 bg-tertiary"></span>
            The Ecosystem
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Card 1 — Student Services (wide, expandable) */}
            <StudentServicesExpander onAction={openModal} />

            {/* Card 2 — Peer-to-Peer Goods */}
            <div className="lg:col-span-4 bg-secondary border-[3px] sm:border-4 border-black p-4 sm:p-6 lg:p-8 neo-shadow-primary flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-black text-3xl sm:text-5xl mb-3 sm:mb-6">shopping_bag</span>
                <h3 className="text-xl sm:text-3xl font-black uppercase text-black leading-tight">PEER-TO-PEER MARKETPLACE</h3>
              </div>
              <p className="text-black/80 text-sm sm:text-base font-bold mt-2 sm:mt-4">Keep your trades inside the campus bubble through a verified, student-exclusive marketplace to buy and sell laptops, gear, and dorm essentials.</p>
              <button
                onClick={openModal}
                className="mt-5 sm:mt-8 w-fit bg-black text-secondary px-5 py-2.5 sm:px-6 sm:py-3 font-black uppercase tracking-tighter text-sm sm:text-base"
              >
                Shop Campus
              </button>
            </div>

            {/* Card 3 — Market Your Startup */}
            <div className="lg:col-span-4 bg-tertiary border-[3px] sm:border-4 border-black p-4 sm:p-6 lg:p-8 neo-shadow-primary flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-black text-3xl sm:text-5xl mb-3 sm:mb-6">rocket_launch</span>
                <h3 className="text-xl sm:text-3xl font-black uppercase text-black leading-tight">LAUNCHPAD</h3>
              </div>
              <p className="text-black/80 text-sm sm:text-base font-bold mt-2 sm:mt-4">The launchpad for the next big thing. Get your first 100 users on-campus.</p>
              <button
                onClick={openModal}
                className="mt-5 sm:mt-8 w-fit bg-black text-tertiary px-5 py-2.5 sm:px-6 sm:py-3 font-black uppercase tracking-tighter text-sm sm:text-base"
              >
                Launch Now
              </button>
            </div>

            {/* Card 4 — Community (wide) */}
            <div className="sm:col-span-2 lg:col-span-8 bg-surface border-[3px] sm:border-4 border-black p-0 overflow-hidden relative min-h-[160px] sm:min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Collaboration"
                className="w-full h-full object-cover grayscale brightness-50 contrast-125 absolute inset-0"
                src="community_pic.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-4 sm:p-8 flex flex-col justify-end">
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-black uppercase text-white tracking-tighter">The Community</h3>
                <p className="text-white/70 max-w-sm mt-1 sm:mt-2 text-xs sm:text-base">Connect with 1,000+ students and freelancers across 102 campuses.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Manifesto Section */}
        <section className="px-12 sm:px-10 md:px-16 lg:px-20 py-16 sm:py-24 lg:py-32 flex flex-col md:flex-row gap-10 sm:gap-14 lg:gap-20 items-center" id="manifesto">
          <div className="md:w-1/2">
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none relative">
                OUR <br /> <span className="text-tertiary">MANIFESTO</span>
              </h2>
            </div>
          </div>
          <div className="md:w-1/2 space-y-8 sm:space-y-10">
            <div className="bg-surface-container-highest p-5 sm:p-8 border-l-8 border-primary-container">
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
                TIBBIT is more than a marketplace. It&apos;s the digital infrastructure for the ambitious. We believe your university years are the ultimate sandbox for experimentation, which is why we built a frictionless ecosystem with zero gatekeepers and no padded resumes. Whether you're buying and selling locally, monetizing your freelance skills, finding your next co-founder, or launching a startup to early adopters, TIBBIT is where the next generation of builders stops planning and starts shipping.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h4 className="text-primary-container font-black uppercase tracking-widest text-xs mb-2">Tenet 01</h4>
                <p className="text-white/50 text-sm"><strong>Zero Friction.</strong> We build tools that get out of your way. Every feature is optimized to take you from idea to execution instantly.</p>
              </div>
              <div>
                <h4 className="text-primary-container font-black uppercase tracking-widest text-xs mb-2">Tenet 02</h4>
                <p className="text-white/50 text-sm"><strong>Absolute Trust.</strong> A walled garden for the ambitious. Ironclad academic authentication means no strangers, no bots, and no stress.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-8 md:px-16 lg:px-20 text-center">
          <div className="bg-surface-container p-6 sm:p-12 md:p-20 lg:p-24 border-4 border-black neo-shadow-secondary max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6 sm:mb-8 italic">
              STOP BROWSING. <br /> START GROWING.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={openModal}
                className="bg-primary-container text-on-primary-container px-6 sm:px-8 py-3 sm:py-4 border-4 border-black font-black uppercase tracking-tighter hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Join The Waitlist
              </button>
            </div>
            <p className="mt-6 sm:mt-8 text-xs text-white/40 uppercase font-black tracking-[0.3em]">Launching Summer 2026</p>
          </div>
        </section>

        {/* Status HUD (Persistent info bar style) */}
        <DynamicHUD />
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] border-t-4 border-[#abfc01] w-full px-4 sm:px-8 py-8 sm:py-12 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
        <div className="flex flex-col items-center md:items-start gap-2 md:flex-1 w-full md:w-auto">
          <div className="text-xl font-black text-[#abfc01] font-['Space_Grotesk']">TIBBIT</div>
          <div className="text-[#ffffff80] font-['Space_Grotesk'] text-xs font-bold uppercase text-center md:text-left">Copyright © 2026 TIBBIT. All rights reserved.</div>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 md:flex-shrink-0">
          <a className="text-white/50 hover:underline hover:text-[#ff51fa] font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150" href="#home">Privacy</a>
          <a className="text-white/50 hover:underline hover:text-[#ff51fa] font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150" href="#home">Terms</a>
          <a className="text-white/50 hover:underline hover:text-[#ff51fa] font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150" href="#home">Contact</a>
        </nav>
        <div className="flex justify-center md:justify-end gap-4 md:flex-1 w-full md:w-auto">
          <div className="relative">
            {copied && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-tertiary text-black text-[10px] font-black px-3 py-1 uppercase tracking-widest neo-shadow-primary animate-fade-in-up">
                Copied
              </div>
            )}
            <div
              onClick={handleCopy}
              className={`w-10 h-10 border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${copied ? "border-tertiary text-tertiary bg-tertiary/10" : "border-white/20 hover:border-tertiary hover:text-tertiary hover:scale-110 active:scale-90"
                }`}
            >
              <span className="material-symbols-outlined text-lg transition-all">
                {copied ? "done_all" : "content_copy"}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
