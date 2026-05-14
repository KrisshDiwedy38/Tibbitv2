"use client";

import { useState } from "react";

import CursorTrail from "@/components/effects/CursorTrail";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DynamicHUD from "@/components/layout/DynamicHUD";
import HeroSection from "@/components/landing/HeroSection";
import MarketplaceSection from "@/components/landing/MarketplaceSection";
import ServicesSection from "@/components/landing/ServicesSection";
import LaunchpadSection from "@/components/landing/LaunchpadSection";
import ManifestoSection from "@/components/landing/ManifestoSection";
import CTASection from "@/components/landing/CTASection";
import WaitlistModal from "@/components/modals/WaitlistModal";
import ContactModal from "@/components/modals/ContactModal";
import ReportBugModal from "@/components/modals/ReportBugModal";

type ModalType = "waitlist" | "contact" | "bug" | null;

export default function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openWaitlist = () => setActiveModal("waitlist");
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <CursorTrail />

      <Navbar onJoinClick={openWaitlist} />

      <main>
        <HeroSection onCTAClick={openWaitlist} />
        <MarketplaceSection />
        <ServicesSection />
        <LaunchpadSection onCTAClick={openWaitlist} />
        <ManifestoSection />
        <CTASection onCTAClick={openWaitlist} />
        <DynamicHUD />
      </main>

      <Footer
        onContactClick={() => setActiveModal("contact")}
        onBugClick={() => setActiveModal("bug")}
      />

      {/* Modals */}
      <WaitlistModal isOpen={activeModal === "waitlist"} onClose={closeModal} />
      <ContactModal isOpen={activeModal === "contact"} onClose={closeModal} />
      <ReportBugModal isOpen={activeModal === "bug"} onClose={closeModal} />
    </>
  );
}
