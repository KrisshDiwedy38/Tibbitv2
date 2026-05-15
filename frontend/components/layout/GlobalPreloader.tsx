"use client";

import { useEffect, useState } from "react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { SpinningText } from "@/components/magicui/spinning-text";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalPreloader({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for actual load or minimum timeout for the animation to look complete
    const handleLoad = () => setIsLoaded(true);

    if (document.readyState === "complete") {
      // Minimum duration for the ticker to count to 100 smoothly
      setTimeout(() => setIsLoaded(true), 2500);
    } else {
      window.addEventListener("load", handleLoad);
      // Fallback timeout
      setTimeout(() => setIsLoaded(true), 3000);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Primary color gradient at the ends */}
            <div className="absolute top-0 inset-x-0 h-40 sm:h-64 bg-gradient-to-b from-[#abfc01]/10 to-transparent blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 inset-x-0 h-40 sm:h-64 bg-gradient-to-t from-[#abfc01]/10 to-transparent blur-3xl pointer-events-none"></div>

            <div className="relative flex items-center justify-center">
              {/* Spinning text around the ticker */}
              <SpinningText
                radius={6}
                duration={8}
                className="font-black text-tertiary uppercase tracking-widest text-lg sm:text-xl"
              >
                Tibbit • Trade • Build • Hustle •
              </SpinningText>

              {/* The number ticker in the center */}
              <div className="absolute flex items-center justify-center font-black text-4xl sm:text-5xl text-white">
                <NumberTicker value={100} delay={1} className="text-white dark:text-white" />
                <span className="text-[#abfc01] ml-1">%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={!isLoaded ? "h-screen overflow-hidden fixed inset-0 pointer-events-none" : ""}>
        {children}
      </div>
    </>
  );
}
