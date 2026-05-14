"use client";

import AnimatedIdeasDemo from "./AnimatedIdeasDemo";

interface LaunchpadSectionProps {
  onCTAClick: () => void;
}

export default function LaunchpadSection({ onCTAClick }: LaunchpadSectionProps) {
  return (
    <section className="relative px-4 sm:px-8 md:px-16 lg:px-20 py-16 sm:py-20 lg:py-24 flex flex-col items-center">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-tertiary opacity-[0.04] blur-[120px] sm:blur-[180px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-4xl w-full text-center space-y-8 relative z-10 mb-12 sm:mb-16">
        <div className="flex justify-center gap-4">
          <span className="material-symbols-outlined text-6xl text-tertiary">rocket_launch</span>
          <span className="material-symbols-outlined text-6xl text-white">groups</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white">
          Launchpad <span className="text-tertiary">&</span> Community
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl font-medium text-white/80">
          Two interconnected pillars of the Tibbit ecosystem. Validate your ideas on the Startup Launchpad, and find early adopters within our vibrant Student Community.
        </p>
        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button onClick={onCTAClick} className="bg-tertiary text-black px-10 py-4 border-4 border-black font-black uppercase tracking-tighter neo-shadow-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            Launch an Idea
          </button>
          <button onClick={onCTAClick} className="bg-white text-black px-10 py-4 border-4 border-black font-black uppercase tracking-tighter neo-shadow-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            Join Community
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto p-2 relative z-10">
        <AnimatedIdeasDemo />
      </div>
    </section>
  );
}
