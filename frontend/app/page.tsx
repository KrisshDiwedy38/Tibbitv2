"use client";

import { useState } from "react";
import BackgroundGridHover from "../components/BackgroundGridHover";
import DynamicHUD from "../components/DynamicHUD";
import WaitlistModal from "../components/WaitlistModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  return (
    <>
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <BackgroundGridHover />

      {/* TopNavBar */}
      <header className="bg-[#0e0e0e] border-b-4 border-[#262626] sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
          <div className="text-2xl font-black italic tracking-tighter text-[#abfc01] font-['Space_Grotesk'] uppercase">
            TIBBIT
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-[#abfc01] border-b-4 border-[#abfc01] pb-1 font-['Space_Grotesk'] uppercase tracking-tighter text-sm font-bold" href="#">Market</a>
            <a className="text-white/70 hover:text-[#abfc01] hover:bg-[#262626] transition-none font-['Space_Grotesk'] uppercase tracking-tighter text-sm font-bold px-2 py-1" href="#ecosystem">Services</a>
            <a className="text-white/70 hover:text-[#abfc01] hover:bg-[#262626] transition-none font-['Space_Grotesk'] uppercase tracking-tighter text-sm font-bold px-2 py-1" href="#">Community</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-white/70 font-['Space_Grotesk'] uppercase tracking-tighter text-sm font-bold hover:text-[#ff51fa] px-4 py-2">Login</button>
            <button
              onClick={openModal}
              className="bg-[#abfc01] text-[#3c5c00] px-6 py-2 border-4 border-black font-black uppercase tracking-tighter hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-75"
            >
              Waitlist
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[819px] flex flex-col justify-center items-start px-6 md:px-20 py-20 overflow-hidden">
          {/* Background Graphic */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-20 w-[600px] h-[600px] border-[20px] border-secondary rotate-12 -z-10"></div>

          <div className="max-w-4xl space-y-8">
            <div className="inline-block bg-secondary text-on-secondary px-4 py-1 text-xs font-black uppercase tracking-[0.2em] neo-shadow-primary">
              Live at University Hubs
            </div>
            <h1 className="text-6xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter">
              TIBBIT: <br />
              <span className="text-primary-container">STUDENT-LED</span>, <br />
              UNAPOLOGETIC <br />
              MARKETPLACE
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/70 max-w-2xl leading-relaxed">
              The playground for Gen Z hustlers. Trade goods, launch services, and scale your campus startup on a platform built for builders, by builders.
            </p>
            <div className="flex flex-col md:flex-row gap-6 pt-8">
              <button
                onClick={openModal}
                className="bg-primary-container text-on-primary-container px-10 py-5 border-4 border-black text-2xl font-black uppercase tracking-tighter neo-shadow-secondary hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-75"
              >
                Start Hustling
              </button>
              <button
                onClick={openModal}
                className="bg-transparent text-on-background px-10 py-5 border-4 border-secondary text-2xl font-black uppercase tracking-tighter hover:bg-secondary/10 transition-all"
              >
                View Market
              </button>
            </div>
          </div>
        </section>

        {/* Bento Categories */}
        <section className="px-6 md:px-20 py-24 bg-surface-container-low" id="ecosystem">
          <h2 className="text-4xl font-black uppercase mb-16 flex items-center gap-4">
            <span className="w-12 h-1 bg-tertiary"></span>
            The Ecosystem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1 */}
            <div className="md:col-span-8 bg-surface-container-highest border-4 border-black p-8 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container -translate-y-1/2 translate-x-1/2 rotate-45 transition-transform group-hover:scale-110"></div>
              <span className="material-symbols-outlined text-primary-container text-5xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
              <h3 className="text-4xl font-black uppercase mb-4">STUDENT SERVICES</h3>
              <p className="text-lg text-white/60 mb-8 max-w-md">From code debugging and graphic design to dorm cleaning. Put your skills to work and earn in campus-native economies.</p>
              <button
                onClick={openModal}
                className="flex items-center gap-4 text-primary font-bold uppercase tracking-widest text-sm hover:underline"
              >
                <span>Explore Gigs</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <div className="mt-12 flex gap-4">
                <div className="h-16 w-16 bg-surface border-2 border-black flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">code</span>
                </div>
                <div className="h-16 w-16 bg-surface border-2 border-black flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary">brush</span>
                </div>
                <div className="h-16 w-16 bg-surface border-2 border-black flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">translate</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="md:col-span-4 bg-secondary border-4 border-black p-8 neo-shadow-primary flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-black text-5xl mb-6">shopping_bag</span>
                <h3 className="text-3xl font-black uppercase text-black leading-tight">PEER-TO-PEER GOODS</h3>
              </div>
              <p className="text-black/80 font-bold mt-4">Safe, student-only trading for tech, gear, and essentials.</p>
              <button
                onClick={openModal}
                className="mt-8 bg-black text-secondary px-6 py-3 font-black uppercase tracking-tighter"
              >
                Shop Campus
              </button>
            </div>

            {/* Card 3 */}
            <div className="md:col-span-4 bg-tertiary border-4 border-black p-8 neo-shadow-primary flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-black text-5xl mb-6">rocket_launch</span>
                <h3 className="text-3xl font-black uppercase text-black leading-tight">MARKET YOUR STARTUP</h3>
              </div>
              <p className="text-black/80 font-bold mt-4">The launchpad for the next big thing. Get your first 100 users on-campus.</p>
              <button
                onClick={openModal}
                className="mt-8 bg-black text-tertiary px-6 py-3 font-black uppercase tracking-tighter"
              >
                Launch Now
              </button>
            </div>

            {/* Card 4 */}
            <div className="md:col-span-8 bg-surface border-4 border-black p-0 overflow-hidden relative min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Collaboration"
                className="w-full h-full object-cover grayscale brightness-50 contrast-125 absolute inset-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe5CeTcxq-btwuQBihp3Xgd8odReB6W79N1uEAO-P1KoyGMursKWGRs6Ul_O9ElYRgRDw6w3wKeaX8cC9ua7GaGtp-gb8KthY4QJV3aFrwH0epBeEU84BFn0UEr7nbZZ2l6E40elzocqQFncegWBQgmZRcFoATboJMHgg3I3MEI2vAu7L5VwU5m5GdrTRFRneLN9YroIgdZLkQ57z7emAduB57StyghR8BPwvA176GcrCtdyQxwUYpgKqlN8JsaLb9w4jOGipUgA"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-4xl font-black uppercase text-white tracking-tighter">The Community</h3>
                <p className="text-white/70 max-w-sm mt-2">Connect with 50,000+ student entrepreneurs across 100 campuses.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Manifesto Section */}
        <section className="px-6 md:px-20 py-32 flex flex-col md:flex-row gap-20 items-center">
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-10 -left-10 text-[12rem] font-black text-white/5 select-none leading-none">01</div>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none relative">
                OUR <br /> <span className="text-tertiary">MANIFESTO</span>
              </h2>
            </div>
          </div>
          <div className="md:w-1/2 space-y-10">
            <div className="bg-surface-container-highest p-8 border-l-8 border-primary-container">
              <p className="text-2xl font-bold leading-relaxed">
                TIBBIT is more than a marketplace. It&apos;s a digital architecture for the ambitious. We believe that studenthood is the ultimate era for experimentation. No gatekeepers, no resumes, just execution.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-primary-container font-black uppercase tracking-widest text-xs mb-2">Rule 01</h4>
                <p className="text-white/50 text-sm">Built for builders. Every feature is designed to reduce friction for sellers.</p>
              </div>
              <div>
                <h4 className="text-primary-container font-black uppercase tracking-widest text-xs mb-2">Rule 02</h4>
                <p className="text-white/50 text-sm">Campus verified. Security through academic authentication.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 md:px-20 text-center">
          <div className="bg-surface-container p-12 md:p-24 border-4 border-black neo-shadow-secondary max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">
              STOP BROWSING. <br /> START BUILDING.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={openModal}
                className="bg-primary-container text-on-primary-container px-8 py-4 border-4 border-black font-black uppercase tracking-tighter hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Join The Waitlist
              </button>
            </div>
            <p className="mt-8 text-xs text-white/40 uppercase font-black tracking-[0.3em]">Launching Winter 2026</p>
          </div>
        </section>

        {/* Status HUD (Persistent info bar style) */}
        <DynamicHUD />
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] border-t-4 border-[#abfc01] w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="text-xl font-black text-[#abfc01] font-['Space_Grotesk']">TIBBIT</div>
          <div className="text-[#ffffff80] font-['Space_Grotesk'] text-xs font-bold uppercase">© 2026 TIBBIT</div>
        </div>
        <nav className="flex gap-8">
          <a className="text-white/50 hover:underline hover:text-[#ff51fa] font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150" href="#">Privacy</a>
          <a className="text-white/50 hover:underline hover:text-[#ff51fa] font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150" href="#">Terms</a>
          <a className="text-white/50 hover:underline hover:text-[#ff51fa] font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150" href="#">Discord</a>
          <a className="text-white/50 hover:underline hover:text-[#ff51fa] font-['Space_Grotesk'] text-xs font-bold uppercase transition-all duration-150" href="#">Contact</a>
        </nav>
        <div className="flex gap-4">
          <div
            onClick={openModal}
            className="w-10 h-10 border-2 border-white/20 flex items-center justify-center hover:border-tertiary hover:text-tertiary transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">share</span>
          </div>
        </div>
      </footer>
    </>
  );
}
