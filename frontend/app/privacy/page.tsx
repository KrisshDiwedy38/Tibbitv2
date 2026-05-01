import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-on-background font-['Space_Grotesk'] selection:bg-tertiary selection:text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 sm:py-6 border-b-4 border-black bg-background flex justify-between items-center neo-shadow-primary">
        <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tighter uppercase flex items-center hover:-translate-y-1 transition-transform">
          TIBBIT
        </Link>
        <Link
          href="/"
          className="bg-black text-secondary px-4 py-2 sm:px-6 sm:py-2.5 font-black uppercase text-xs sm:text-sm tracking-widest hover:bg-neutral-800 transition-colors"
        >
          BACK HOME
        </Link>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 sm:px-12 md:px-20 max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter italic">
            PRIVACY <br /> POLICY
          </h1>
          <p className="text-sm font-bold text-white/50 uppercase tracking-widest">
            LAST UPDATED: MAY 2026
          </p>
        </div>

        <div className="space-y-6 text-white/80 font-medium leading-relaxed">
          <p>
            This is a demo privacy policy for the Tibbit platform waitlist phase. We respect your privacy and are committed to protecting your personal data. This privacy notice will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">1. Information We Collect</h2>
          <p>
            Currently, during the waitlist phase, we only collect your email address and the name of your university. This data is used strictly for managing the waitlist queue and communicating updates regarding the Tibbit platform launch.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">2. How We Use Your Data</h2>
          <p>
            We use your data to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Notify you when Tibbit launches at your university.</li>
            <li>Send periodic updates about our progress and features.</li>
            <li>Prevent fraud and ensure fair waitlist queueing.</li>
          </ul>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">3. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
          </p>
        </div>
      </main>
    </div>
  );
}
