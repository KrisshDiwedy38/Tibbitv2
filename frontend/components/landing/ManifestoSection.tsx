export default function ManifestoSection() {
  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-20 py-16 sm:py-24 lg:py-32 flex flex-col items-center text-center" id="manifesto">
      <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-10 sm:mb-14">
        OUR <span className="text-tertiary">MANIFESTO</span>
      </h2>
      <div className="max-w-5xl space-y-8 sm:space-y-10">
        <div className="relative bg-[#0e0e0e]/80 backdrop-blur-xl p-5 sm:p-8 border-4 border-black overflow-hidden group text-left">
          {/* Translucent Tint */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-screen bg-tertiary transition-opacity duration-300 group-hover:opacity-[0.1]" />
          <p className="relative z-10 text-base sm:text-lg lg:text-xl leading-relaxed text-white font-bold">
            TIBBIT is more than a marketplace. It&apos;s the digital infrastructure for the ambitious. We believe your university years are the ultimate sandbox for experimentation, which is why we built a frictionless ecosystem with zero gatekeepers and no padded resumes. Whether you&apos;re buying and selling locally, monetizing your freelance skills, finding your next co-founder, or launching a startup to early adopters, TIBBIT is where the next generation of builders stops planning and starts shipping.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-left">
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
  );
}
