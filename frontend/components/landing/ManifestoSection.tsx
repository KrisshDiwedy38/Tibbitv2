export default function ManifestoSection() {
  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-20 py-16 sm:py-24 lg:py-32 flex flex-col items-center text-center" id="manifesto">
      <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-10 sm:mb-14">
        FOUNDER&apos;S <span className="text-tertiary">NOTE</span>
      </h2>
      <div className="max-w-3xl w-full">
        <div className="relative bg-[#0e0e0e]/80 backdrop-blur-xl p-6 sm:p-10 border-4 border-black overflow-hidden group text-left">
          {/* Translucent Tint */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-screen bg-tertiary transition-opacity duration-300 group-hover:opacity-[0.1]" />

          <div className="relative z-10 space-y-4 sm:space-y-5 text-sm sm:text-base lg:text-lg leading-relaxed text-white/90 font-medium">
            <p>we spent four years in college relying on &quot;knowing a guy.&quot;</p>
            <p>a lab kit, a textbook, five minutes of someone who&apos;d already solved the problem you&apos;re stuck on, it all exists somewhere on campus. you just have no way to find it.</p>
            <p>we think that&apos;s not a trust problem, it&apos;s an access problem.</p>
            <p>so we built tibbit to give every student the same shot, without needing to already know the right people.</p>
            <p>marketplace is live. launchpad and community are next. more universities getting approved every week.</p>
            <p className="text-white font-bold">it&apos;s early! join the waitlist and help us build it.</p>
          </div>

          <div className="relative z-10 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
            <p className="text-primary-container font-black uppercase tracking-widest text-base sm:text-lg">krissh,</p>
            <p className="text-white/50 font-bold uppercase tracking-widest text-[10px] sm:text-xs">founder</p>
          </div>
        </div>
      </div>
    </section>
  );
}
