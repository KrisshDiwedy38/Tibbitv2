"use client";
import { useState, useEffect } from "react";

const CAMPUS_STATS = [
  "1 CAMPUS ONLINE",
  "14 CAMPUSES ONLINE",
  "42 CAMPUSES ONLINE",
  "102 CAMPUSES ONLINE",
];

const LATEST_TRADES = [
  "FINAL_SEM_PROJECT FOR 200_TBT",
  "DESIGN_SERVICES FOR 50_TBT",
  "VINTAGE_TEE FOR 15_TBT",
  "CALC_TUTORING FOR 30_TBT",
  "MACBOOK_PRO FOR 800_TBT",
  "DORM_CLEANING FOR 25_TBT"
];

function useTypewriter(words: string[], typingSpeed: number = 80, deletingSpeed: number = 40, delay: number = 2500) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentWord = words[loopNum % words.length];

    if (isDeleting) {
      if (text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        timeout = setTimeout(() => { }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setText(currentWord.substring(0, text.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (text === currentWord) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      } else {
        timeout = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, delay]);

  return text;
}

export default function DynamicHUD() {
  const campusText = useTypewriter(CAMPUS_STATS, 50, 30, 3500);
  const tradeText = useTypewriter(LATEST_TRADES, 40, 20, 2500);

  return (
    <div className="w-full bg-surface-container-lowest border-t-2 border-primary-container py-3 px-8 flex justify-between items-center overflow-hidden">
      <div className="flex items-center gap-6 whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="text-primary-container font-black uppercase text-[10px] tracking-widest font-mono">
            SYSTEM_STABLE: {campusText}<span className="opacity-70 animate-pulse">_</span>
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-2 border-l border-white/20 pl-6">
          <span className="text-white/40 font-black uppercase text-[10px] tracking-widest font-mono">
            LATEST_TRADE: {tradeText}<span className="opacity-70 animate-pulse">_</span>
          </span>
        </div>
      </div>
      <div className="hidden md:block text-white/40 font-black uppercase text-[10px] tracking-widest">
        VER_0.4.8_NEO
      </div>
    </div>
  );
}
