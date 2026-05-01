import Link from "next/link";

export default function TermsPage() {
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
            TERMS OF <br /> SERVICE
          </h1>
          <p className="text-sm font-bold text-white/50 uppercase tracking-widest">
            LAST UPDATED: MAY 2026
          </p>
        </div>

        <div className="space-y-6 text-white/80 font-medium leading-relaxed">
          <p>
            Welcome to Tibbit. By accessing our website and joining our waitlist, you agree to be bound by these Terms of Service. Please read them carefully.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">1. Acceptance of Terms</h2>
          <p>
            By joining the Tibbit waitlist, you agree to these demo terms. If you do not agree to these terms, please do not use our services or join the waitlist.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">2. Waitlist Access</h2>
          <p>
            Joining the waitlist does not guarantee immediate access to the Tibbit platform. Access will be granted on a rolling basis as we launch at individual university hubs. We reserve the right to modify or terminate the waitlist at any time.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">3. User Conduct</h2>
          <p>
            You agree to provide accurate and complete information when joining the waitlist (specifically, your valid university email). Any fraudulent attempts to manipulate the waitlist will result in permanent removal.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">4. Limitation of Liability</h2>
          <p>
            Tibbit is provided "as is" without any warranties. We shall not be liable for any damages arising out of or in connection with the use of our services.
          </p>
        </div>
      </main>
    </div>
  );
}
