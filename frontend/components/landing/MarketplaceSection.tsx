export default function MarketplaceSection() {
  return (
    <section className="relative px-4 sm:px-8 md:px-16 lg:px-20 py-16 sm:py-20 lg:py-24 flex flex-col items-center" id="ecosystem">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-[-10%] -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary-container opacity-[0.04] blur-[100px] sm:blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="max-w-6xl w-full text-center space-y-8 relative z-10">
        <span className="material-symbols-outlined text-6xl text-primary-container">storefront</span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-primary-container">
          Peer-to-Peer Marketplace
        </h2>

        <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 items-center pt-8">
          {/* Text Content */}
          <div className="w-full space-y-4 text-center">
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-primary-container">Buy, Sell, Trade</h3>
            <p className="text-lg text-white/80 leading-relaxed font-medium max-w-2xl mx-auto">
              Verified students only. No bots, no scams. Buy textbooks, sell furniture, or trade electronics safely within your university bubble.
            </p>
          </div>

          {/* Image mock */}
          <div className="w-[90%] sm:w-[80%] md:w-1/2 max-w-2xl relative group rounded-lg border border-[#262626] hover:border-primary-container transition-colors duration-300 bg-black overflow-hidden flex items-center justify-center p-2 sm:p-4 mx-auto">
            <img src="/images/marketplace_ui.jpeg" alt="Marketplace UI Mockup" className="w-full h-auto object-contain rounded transition-transform duration-500 group-hover:scale-[1.02]" />
          </div>
        </div>
      </div>
    </section>
  );
}
