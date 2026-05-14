"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/modals/ContactModal";
import ReportBugModal from "@/components/modals/ReportBugModal";

type ModalType = "contact" | "bug" | null;

export default function PrivacyPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

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
            Tibbit values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your information when you join the Tibbit waitlist or interact with our website.
          </p>
          <p>
            By using our website or submitting your information, you agree to the practices described in this Privacy Policy.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">1. Information We Collect</h2>
          <p>
            During the current waitlist phase, we may collect the following information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your email address</li>
            <li>Your university or educational institution name</li>
            <li>Basic technical information such as browser type, device information, and website usage analytics</li>
          </ul>
          <p>
            We only collect information that is necessary to manage the waitlist experience and improve our platform.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">2. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Manage and organize the Tibbit waitlist</li>
            <li>Notify you about product launches, availability, and updates</li>
            <li>Share important announcements, feature updates, or onboarding information</li>
            <li>Improve our website, services, and user experience</li>
            <li>Prevent spam, abuse, fraud, or unauthorized access</li>
          </ul>
          <p>
            We do not sell your personal information to third parties.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">3. Data Storage and Security</h2>
          <p>
            We implement reasonable administrative, technical, and organizational safeguards designed to protect your personal information from unauthorized access, disclosure, alteration, or destruction.
          </p>
          <p>
            While we strive to use commercially acceptable security measures, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">4. Third-Party Services</h2>
          <p>
            We may use trusted third-party tools and service providers for analytics, email communication, hosting, and waitlist management. These providers may process your data only as necessary to perform services on our behalf and are expected to maintain appropriate security standards.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">5. Your Rights</h2>
          <p>
            Depending on your location and applicable laws, you may have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction or deletion of your information</li>
            <li>Withdraw consent to receive communications</li>
            <li>Request that we limit or stop processing your data</li>
          </ul>
          <p>
            You may unsubscribe from our communications at any time using the unsubscribe link included in emails.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">6. Data Retention</h2>
          <p>
            We retain your information only for as long as necessary to manage the waitlist, provide updates, comply with legal obligations, or support legitimate business purposes.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">7. Children's Privacy</h2>
          <p>
            Tibbit is not intended for children, it is a platform for university students, and we do not knowingly collect personal information from anyone under the age of 16.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes to our services, legal obligations, or business practices. Any updates will be posted on this page with a revised "Last Updated" date.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">9. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us.
          </p>
        </div>
      </main>

      <Footer
        onContactClick={() => setActiveModal("contact")}
        onBugClick={() => setActiveModal("bug")}
      />

      {/* Modals */}
      <ContactModal isOpen={activeModal === "contact"} onClose={closeModal} />
      <ReportBugModal isOpen={activeModal === "bug"} onClose={closeModal} />
    </div>
  );
}