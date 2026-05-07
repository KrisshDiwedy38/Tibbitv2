"use client";

import { useState } from "react";

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  accentColor: string;
  textColor: string;
  buttonText: string;
}

const SERVICES: ServiceCard[] = [
  {
    icon: "code",
    title: "CODING & DEBUGGING",
    description:
      "Get help with assignments, projects, or debugging. Student developers fluent in Python, Java, React, and more.",
    accentColor: "#abfc01",
    textColor: "#3c5c00",
    buttonText: "Find Devs",
  },
  {
    icon: "article",
    title: "RESEARCH PAPERS",
    description:
      "Citations, literature reviews, or formatting — connect with students who've been published.",
    accentColor: "#8e94ff",
    textColor: "#03007b",
    buttonText: "Find Help",
  },
  {
    icon: "add",
    title: "MANY MORE",
    description:
      "Design, translation, tutoring, dorm cleaning, photography — if a student offers it, find it here.",
    accentColor: "#ff51fa",
    textColor: "#400040",
    buttonText: "Browse All",
  },
];

interface StudentServicesExpanderProps {
  onAction: () => void;
}

export default function StudentServicesExpander({
  onAction,
}: StudentServicesExpanderProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="sm:col-span-2 lg:col-span-8 bg-[#0e0e0e]/80 backdrop-blur-xl border-[3px] sm:border-4 border-black relative overflow-hidden group">
      {/* Subtle Tint Overlay for outer container */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-screen transition-opacity duration-300 group-hover:opacity-[0.15] bg-primary-container" />

      {/* ── COLLAPSED CONTENT ── */}
      <div className="p-4 sm:p-6 lg:p-8 relative z-10">
        <span
          className="material-symbols-outlined text-primary-container text-3xl sm:text-5xl mb-3 sm:mb-6 block transition-transform duration-300 group-hover:scale-110 origin-left"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          work
        </span>
        <h3 className="text-xl sm:text-3xl lg:text-4xl font-black uppercase mb-2 sm:mb-4 text-white">
          STUDENT SERVICES
        </h3>
        <p className="text-sm sm:text-lg text-white/80 font-bold mb-5 sm:mb-8 max-w-md">
          From code debugging and graphic design to dorm cleaning. Put your
          skills to work and earn in campus-native economies.
        </p>

        {/* "Explore Gigs" — the expand trigger */}
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 sm:gap-4 text-primary font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-primary-fixed cursor-pointer w-fit"
        >
          <span>Explore Gigs</span>
          <span className="material-symbols-outlined text-base sm:text-xl">arrow_forward</span>
        </button>
      </div>

      {/* ── SLIDING OVERLAY — slightly darker tinted glass box ── */}
      <div
        className="absolute inset-0 z-20 bg-[#0e0e0e]/90 backdrop-blur-xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: expanded ? "translateX(0%)" : "translateX(100%)",
        }}
      >
        {/* Back button — top-left in the padding gap */}
        <div className="flex items-center px-2 pt-2 sm:px-3 sm:pt-3 pb-0">
          <button
            onClick={() => setExpanded(false)}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-black/30 text-primary-fixed hover:border-primary-fixed hover:text-primary-fixed transition-colors cursor-pointer"
            aria-label="Back to services"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">arrow_back</span>
          </button>
          <span className="ml-2 text-primary-fixed text-[10px] font-bold uppercase tracking-widest">
            Back
          </span>
        </div>

        {/* 3 service cards with tighter spacing so they fit the div safely */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3 overflow-y-auto min-h-0 relative z-30">
          {SERVICES.map((service, i) => (
            <div
              key={service.title}
              className="group/card relative flex flex-col justify-between bg-[#0e0e0e]/60 backdrop-blur-md border-2 sm:border-[3px] border-black p-3 sm:p-4 overflow-hidden transition-all ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
              style={{
                opacity: expanded ? 1 : 0,
                transform: expanded ? "translateX(0)" : "translateX(40px)",
                transitionDuration: "500ms",
                transitionDelay: expanded ? `${i * 100 + 200}ms` : "0ms",
              }}
            >
              {/* Tinted overlay using the card's specific accent color */}
              <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-screen transition-opacity duration-300 group-hover/card:opacity-[0.15]"
                style={{ backgroundColor: service.accentColor }}
              />

              <div className="mb-2 relative z-10">
                {/* Accent bar */}
                <div
                  className="w-full h-1 mb-2 sm:mb-3"
                  style={{ backgroundColor: service.accentColor }}
                />
                {/* Icon */}
                <div
                  className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center mb-2 border-2 border-black"
                  style={{ backgroundColor: `${service.accentColor}18` }}
                >
                  <span
                    className="material-symbols-outlined text-base sm:text-lg"
                    style={{
                      color: service.accentColor,
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    {service.icon}
                  </span>
                </div>
                <h4 className="text-[11px] sm:text-xs lg:text-sm font-black text-white uppercase tracking-tight mb-1 lg:mb-1.5 leading-snug line-clamp-1 relative z-10">
                  {service.title}
                </h4>
                <p className="text-white/80 font-bold text-[10px] sm:text-[11px] lg:text-xs leading-snug line-clamp-2 relative z-10">
                  {service.description}
                </p>
              </div>

              <button
                onClick={onAction}
                className="mt-1 w-full py-1.5 sm:py-2 border-2 sm:border-4 border-black font-black uppercase tracking-tighter text-[10px] sm:text-xs transition-all duration-75 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-primary cursor-pointer shrink-0 relative z-10"
                style={{
                  backgroundColor: service.accentColor,
                  color: service.textColor,
                }}
              >
                {service.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
