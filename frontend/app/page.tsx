"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react";

export default function WaitlistPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setError("");
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (email) {
      setError("");
      // Setup actual waitlist API call here
      setSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <>
      <div className={`transition-all duration-300 ${isModalOpen ? "blur-md pointer-events-none" : ""}`}>
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full z-40 glass-header px-6 py-4 flex justify-between items-center transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary border-4 border-dark rounded-full flex items-center justify-center brutal-shadow">
              <span className="font-black text-dark text-xl leading-none">T</span>
            </div>
            <span className="font-black text-2xl tracking-tight hidden sm:block">Tibbit</span>
          </div>
          <div className="flex gap-4">
            <a href="#About" className="font-bold text-lg hidden md:block hover:underline self-center underline-offset-4">About Us</a>
            <a href="#Features" className="font-bold text-lg hidden md:block hover:underline self-center underline-offset-4">Features</a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="brutal-btn bg-secondary text-white hover:bg-white hover:text-dark flex items-center gap-2 group"
            >
              Join Waitlist
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="pt-32 pb-20 px-6 md:px-12 lg:px-24 bg-bgStart flex flex-col md:flex-row items-center justify-between border-b-4 border-dark relative overflow-hidden">
          <div className="w-full md:w-1/2 z-10">
            <div className="inline-block bg-accent text-white font-bold px-4 py-2 border-4 border-dark shadow-brutal-sm mb-6 rotate-[-2deg]">
              🚀 COMING SOON
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-[1.1] mb-6">
              The marketplace <br />
              <span className="bg-primary px-2 border-4 border-dark shadow-brutal-sm mt-2 inline-block">that feels alive.</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-10 max-w-xl">
              Buy, sell, and exchange with fellow students in a secure, verified environment. From textbooks to furniture, find everything you need within your university community.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="brutal-btn bg-primary text-dark text-xl md:text-2xl px-8 py-4 w-full sm:w-auto"
            >
              Get Early Access
            </button>
          </div>
          <div className="w-full md:w-1/2 mt-16 md:mt-0 relative flex justify-center z-10">
            {/* Abstract Hero Art / Mockup placeholder */}
            <div className="w-[300px] h-[400px] md:w-[400px] md:h-[500px] bg-secondary brutal-border shadow-brutal-lg relative rotate-[3deg] flex items-center justify-center flex-col p-6">
              <div className="w-full h-48 bg-white border-4 border-dark mb-4"></div>
              <div className="w-3/4 h-8 bg-primary border-4 border-dark mb-4 self-start"></div>
              <div className="w-1/2 h-8 bg-accent border-4 border-dark self-start"></div>
              <Sparkles className="absolute -top-10 -right-10 w-20 h-20 text-primary drop-shadow-[4px_4px_0_rgba(26,26,26,1)]" />
            </div>
          </div>

          {/* Background decorations */}
          <div className="absolute top-20 right-[10%] w-32 h-32 bg-secondary border-4 border-dark rounded-full mix-blend-multiply opacity-50 blur-xl"></div>
          <div className="absolute bottom-10 left-[20%] w-48 h-48 bg-accent border-4 border-dark blur-2xl mix-blend-multiply opacity-30"></div>
        </header>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 md:px-12 lg:px-24 bg-white border-b-4 border-dark">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase inline-block bg-accent text-white px-4 py-2 border-4 border-dark shadow-brutal-sm rotate-1">
              Why Tibbit?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="brutal-card bg-bgStart p-8 flex flex-col">
              <div className="w-16 h-16 bg-primary brutal-border shadow-brutal-sm flex items-center justify-center mb-6 text-dark rotate-[-5deg]">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4">Lightning Fast</h3>
              <p className="text-lg font-medium">Browse, search, and checkout with zero friction. Optimized for speed and instant feedback.</p>
            </div>

            <div className="brutal-card bg-bgEnd p-8 flex flex-col translate-y-0 md:translate-y-8">
              <div className="w-16 h-16 bg-accent brutal-border shadow-brutal-sm flex items-center justify-center mb-6 text-white rotate-[3deg]">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4">Rock Solid</h3>
              <p className="text-lg font-medium">Built with security first. Your data and transactions are protected by modern standards.</p>
            </div>

            <div className="brutal-card bg-[#fffbeb] p-8 flex flex-col">
              <div className="w-16 h-16 bg-secondary brutal-border shadow-brutal-sm flex items-center justify-center mb-6 text-white rotate-[-2deg]">
                <Rocket className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4">Vibrant Community</h3>
              <p className="text-lg font-medium">Connect with buyers and sellers who value aesthetics and functional design.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 md:px-12 lg:px-24 bg-dark text-white text-center">
          <div className="max-w-4xl mx-auto border-8 border-primary bg-bgStart text-dark p-8 md:p-16 shadow-[12px_12px_0_0_#ff4da6]">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-8">About Us</h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
              We are tired of boring, gray web apps. Tibbit is a rebellion against generic corporate design. We are building a marketplace that is bold, accessible, and uniquely yours.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="brutal-btn bg-dark text-white hover:bg-primary hover:text-dark text-xl px-8 py-4"
            >
              Join the Rebellion
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-white border-t-4 border-dark text-center font-bold">
          <p>© {new Date().getFullYear()} Tibbit Marketplace. All rights reserved.</p>
        </footer>
      </div>

      {/* Waitlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/20" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md bg-white border-8 border-dark shadow-[16px_16px_0_0_rgba(26,26,26,1)] p-8 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-6 -right-6 w-12 h-12 bg-secondary text-white font-black text-2xl border-4 border-dark rounded-full shadow-brutal-hover flex items-center justify-center hover:scale-110 transition-transform"
            >
              &times;
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-primary border-4 border-dark rounded-full mx-auto flex items-center justify-center mb-6 shadow-brutal-sm">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-3xl font-black uppercase mb-4">You're In!</h2>
                <p className="font-bold text-lg">Thanks for joining. Keep an eye on your inbox.</p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black uppercase mb-2">Claim Your Spot</h2>
                <p className="font-bold text-gray-600 mb-6">Be the first to access the marketplace.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block font-black uppercase mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="hello@vibes.com"
                      className="brutal-input"
                    />
                    {error && <p className="text-red-500 font-bold mt-2 text-sm">{error}</p>}
                  </div>
                  <button type="submit" className="brutal-btn bg-primary text-dark mt-2 py-4 text-xl">
                    Reserve Waitlist Spot
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
