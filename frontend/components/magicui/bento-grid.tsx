import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className?: string;
  background?: ReactNode;
  icon: string;
  description: string;
  cta: string;
  onAction?: () => void;
  accentColor?: string;
  textColor?: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  icon,
  description,
  cta,
  onAction,
  accentColor = "#abfc01", // primary-container
  textColor = "#0e0e0e",
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden border-[3px] sm:border-4 border-black p-4 sm:p-6 lg:p-8 neo-shadow-primary transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
      // Tinted transparency over a dark base, with backdrop blur so grid shows through nicely
      "bg-[#0e0e0e]/80 backdrop-blur-xl",
      className
    )}
    {...props}
  >
    {/* Tinted overlay using the accent color */}
    <div
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-screen transition-opacity duration-300 group-hover:opacity-[0.15]"
      style={{ backgroundColor: accentColor }}
    />

    {background && <div className="absolute inset-0 z-0">{background}</div>}
    
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div>
        <span 
          className="material-symbols-outlined text-3xl sm:text-5xl mb-3 sm:mb-6 transition-transform duration-300 group-hover:scale-110 origin-left"
          style={{ color: accentColor }}
        >
          {icon}
        </span>
        <h3 className="text-xl sm:text-3xl font-black uppercase text-white leading-tight">
          {name}
        </h3>
        <p className="text-white/80 text-sm sm:text-base font-bold mt-2 sm:mt-4 max-w-lg">
          {description}
        </p>
      </div>

      <div className="mt-5 sm:mt-8">
        <button
          onClick={onAction}
          className="w-fit px-5 py-2.5 sm:px-6 sm:py-3 font-black uppercase tracking-tighter text-sm sm:text-base border-2 border-black transition-transform duration-75 hover:translate-x-[2px] hover:translate-y-[2px]"
          style={{
            backgroundColor: accentColor,
            color: textColor,
          }}
        >
          {cta}
        </button>
      </div>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
