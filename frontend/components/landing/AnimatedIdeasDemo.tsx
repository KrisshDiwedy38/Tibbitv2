"use client"

import React, { forwardRef, useRef } from "react"
import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/magicui/animated-beam"

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-14 items-center justify-center rounded-full border-2 border-[#262626] bg-[#0e0e0e] shadow-[0_0_20px_-12px_rgba(171,252,1,0.5)]",
        className
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = "Circle"

export default function AnimatedIdeasDemo({
  className,
}: {
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const divTibbitRef = useRef<HTMLDivElement>(null)
  const divStudent1Ref = useRef<HTMLDivElement>(null)
  const divStudent2Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn(
        "relative flex h-[400px] w-full items-center justify-center overflow-hidden p-4 sm:p-10",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-3xl flex-row items-stretch justify-between gap-10">

        {/* Ideas (Inputs) */}
        <div className="flex flex-col justify-center gap-6 sm:gap-10">
          <Circle ref={div1Ref}>
            <span className="material-symbols-outlined text-[#abfc01]">lightbulb</span>
          </Circle>
          <Circle ref={div2Ref}>
            <span className="material-symbols-outlined text-[#abfc01]">code</span>
          </Circle>
          <Circle ref={div3Ref}>
            <span className="material-symbols-outlined text-[#abfc01]">palette</span>
          </Circle>
        </div>

        {/* Tibbit (Center Hub) */}
        <div className="flex flex-col justify-center">
          <Circle ref={divTibbitRef} className="size-20 sm:size-24 border-[#abfc01]">
            <span className="font-['Space_Grotesk'] font-black italic tracking-tighter text-[#abfc01] text-lg sm:text-2xl uppercase">TIBBIT</span>
          </Circle>
        </div>

        {/* Students (Outputs) */}
        <div className="flex flex-col justify-center gap-6 sm:gap-10">
          <Circle ref={divStudent1Ref} className="border-[#ff51fa] shadow-[0_0_20px_-12px_rgba(255,81,250,0.5)]">
            <span className="material-symbols-outlined text-[#ff51fa]">school</span>
          </Circle>
          <Circle ref={divStudent2Ref} className="border-[#ff51fa] shadow-[0_0_20px_-12px_rgba(255,81,250,0.5)]">
            <span className="material-symbols-outlined text-[#ff51fa]">groups</span>
          </Circle>
        </div>
      </div>

      {/* Beams: Ideas -> Tibbit */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={divTibbitRef}
        duration={3.3}
        pathColor="rgba(255, 255, 255, 0.15)"
        gradientStartColor="#abfc01"
        gradientStopColor="#abfc01"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={divTibbitRef}
        duration={3.3}
        pathColor="rgba(255, 255, 255, 0.15)"
        gradientStartColor="#abfc01"
        gradientStopColor="#abfc01"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={divTibbitRef}
        duration={3.3}
        pathColor="rgba(255, 255, 255, 0.15)"
        gradientStartColor="#abfc01"
        gradientStopColor="#abfc01"
      />

      {/* Beams: Tibbit -> Students */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={divTibbitRef}
        toRef={divStudent1Ref}
        duration={3.3}
        delay={0.7}
        pathColor="rgba(255, 255, 255, 0.15)"
        gradientStartColor="#abfc01"
        gradientStopColor="#ff51fa"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={divTibbitRef}
        toRef={divStudent2Ref}
        duration={3.3}
        delay={0.7}
        pathColor="rgba(255, 255, 255, 0.15)"
        gradientStartColor="#abfc01"
        gradientStopColor="#ff51fa"
      />
    </div>
  )
}
