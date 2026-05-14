"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/modals/ContactModal";
import ReportBugModal from "@/components/modals/ReportBugModal";

type ModalType = "contact" | "bug" | null;

export default function TermsPage() {
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
            TERMS OF <br /> SERVICE
          </h1>
          <p className="text-sm font-bold text-white/50 uppercase tracking-widest">
            LAST UPDATED: MAY 2026
          </p>
        </div>

        <div className="space-y-6 text-white/80 font-medium leading-relaxed">
          <p>
            Welcome to Tibbit. These Terms of Service ("Terms") govern your access to and use of our website, waitlist, and related services.
          </p>
          <p>
            By accessing our website or joining the Tibbit waitlist, you agree to these Terms. If you do not agree with these Terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">1. Eligibility</h2>
          <p>
            By using Tibbit or joining the waitlist, you represent that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are at least 16 years old</li>
            <li>The information you provide is accurate and complete</li>
            <li>You are authorized to use the email address submitted</li>
          </ul>
          <p>
            We reserve the right to refuse access or remove users who violate these Terms.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">2. Waitlist Participation</h2>
          <p>
            Joining the Tibbit waitlist does not guarantee access to the platform, early access privileges, or launch availability at your institution.
          </p>
          <p>
            Access may be granted gradually based on factors including university rollout plans, system capacity, testing phases, and community growth.
          </p>
          <p>
            We reserve the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modify, pause, or discontinue the waitlist at any time</li>
            <li>Limit or revoke access to any user</li>
            <li>Change launch timelines, features, or availability without prior notice</li>
          </ul>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">3. Acceptable Use</h2>
          <p>
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Submit false, misleading, or fraudulent information</li>
            <li>Attempt to manipulate waitlist rankings or referral systems</li>
            <li>Interfere with the security or operation of the website</li>
            <li>Use automated systems, bots, or scripts to abuse the platform</li>
            <li>Violate any applicable laws or regulations while using Tibbit</li>
          </ul>
          <p>
            Any misuse of the platform may result in suspension, removal from the waitlist, or restriction of future access.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">4. Intellectual Property</h2>
          <p>
            All content, branding, logos, designs, software, and materials associated with Tibbit are owned by or licensed to Tibbit and are protected by applicable intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, or commercially use any Tibbit content without prior written permission.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">5. Privacy</h2>
          <p>
            Your use of Tibbit is also governed by our Privacy Policy, which explains how we collect, use, and protect your information.
          </p>
          <p>
            By using our services, you acknowledge that you have read and understood our Privacy Policy.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">6. Third-Party Services</h2>
          <p>
            Tibbit may rely on third-party providers for hosting, analytics, communications, authentication, or related services. We are not responsible for the practices, policies, or content of third-party services.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">7. Disclaimer of Warranties</h2>
          <p>
            Tibbit and all related services are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.
          </p>
          <p>
            We do not guarantee that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The service will be uninterrupted or error-free</li>
            <li>The website will always be secure or available</li>
            <li>The platform will meet all user expectations or requirements</li>
          </ul>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Tibbit shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from or related to your use of the website, waitlist, or services.
          </p>
          <p>
            Your use of the platform is at your own risk.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">9. Changes to These Terms</h2>
          <p>
            We may update or revise these Terms from time to time. Continued use of the website or services after changes become effective constitutes acceptance of the updated Terms.
          </p>
          <p>
            The latest version will always be posted on this page with the updated revision date.
          </p>

          <h2 className="text-2xl font-black uppercase text-white mt-12 mb-4">10. Contact Information</h2>
          <p>
            If you have questions about these Terms, please contact us.
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