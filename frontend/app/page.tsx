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
import ContactModal from "@/components/modals/ContactModal";
import ReportBugModal from "@/components/modals/ReportBugModal";

type ModalType = "contact" | "bug" | null;

export default function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <CursorTrail />

      <Navbar />

      <main>
        <HeroSection />
        <MarketplaceSection />
        <ServicesSection />
        <LaunchpadSection />
        <ManifestoSection />
        <CTASection />
        <DynamicHUD />
      </main>

      <Footer
        onContactClick={() => setActiveModal("contact")}
        onBugClick={() => setActiveModal("bug")}
      />

      {/* Modals */}
      <ContactModal isOpen={activeModal === "contact"} onClose={closeModal} />
      <ReportBugModal isOpen={activeModal === "bug"} onClose={closeModal} />
    </>
  );
}
