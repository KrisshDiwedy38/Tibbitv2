"use client";

import { useEffect, useState } from "react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { SpinningText } from "@/components/magicui/spinning-text";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// Only the major landing destinations get the full circular loader —
// every other route (including marketplace sub-pages) uses each page's own inline spinner.
const MAJOR_ROUTES = ["/", "/marketplace", "/community", "/launchpad"];

const MIN_VISIBLE_MS = 400; // avoids a jarring flash on an instant/cached load
const FALLBACK_MS = 5000; // safety net if the load event never fires

export default function GlobalPreloader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [tickerSpeed, setTickerSpeed] = useState({ stiffness: 100, damping: 60 });

  useEffect(() => {
    if (!MAJOR_ROUTES.includes(pathname)) {
      setIsLoaded(true);
      setShowPreloader(false);
      return;
    }

    const storageKey = `tibbit_visited_${pathname === "/" ? "app" : pathname}`;
    if (sessionStorage.getItem(storageKey)) {
      setIsLoaded(true);
      setShowPreloader(false);
      return;
    }

    setIsLoaded(false);
    setShowPreloader(true);

    const startedAt = performance.now();
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;

      const elapsed = performance.now() - startedAt;
      // ponytail: linear duration->stiffness mapping is a rough approximation of "counts up
      // over roughly how long the real load took", not a physically exact match. Good enough
      // for a loading animation; revisit with a duration-based tween if it ever needs to be precise.
      const duration = Math.min(Math.max(elapsed, MIN_VISIBLE_MS), 2500);
      setTickerSpeed({ stiffness: Math.round(120000 / duration), damping: 20 });

      const remaining = MIN_VISIBLE_MS - elapsed;
      setTimeout(() => {
        setIsLoaded(true);
        sessionStorage.setItem(storageKey, "true");
      }, Math.max(remaining, 0));
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }
    const fallbackTimer = setTimeout(finish, FALLBACK_MS);

    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(fallbackTimer);
    };
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {showPreloader && !isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                <NumberTicker
                  value={100}
                  stiffness={tickerSpeed.stiffness}
                  damping={tickerSpeed.damping}
                  className="text-white dark:text-white"
                />
                <span className="text-[#abfc01] ml-1">%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={showPreloader && !isLoaded ? "h-screen overflow-hidden fixed inset-0 pointer-events-none" : ""}>
        {children}
      </div>
    </>
  );
}
