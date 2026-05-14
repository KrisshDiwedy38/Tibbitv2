"use client";

interface CTASectionProps {
  onCTAClick: () => void;
}

export default function CTASection({ onCTAClick }: CTASectionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-8 md:px-16 lg:px-20 text-center">
      <div className="bg-surface-container p-6 sm:p-12 md:p-20 lg:p-24 border-4 border-black neo-shadow-secondary max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6 sm:mb-8 italic">
          STOP BROWSING. <br />START GROWING.
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onCTAClick}
            className="bg-primary-container text-on-primary-container px-6 sm:px-8 py-3 sm:py-4 border-4 border-black font-black uppercase tracking-tighter hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Join The Waitlist
          </button>
        </div>
        <p className="mt-6 sm:mt-8 text-xs text-white/40 uppercase font-black tracking-[0.3em]">Launching Summer 2026</p>
      </div>
    </section>
  );
}
