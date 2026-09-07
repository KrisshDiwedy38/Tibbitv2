import Link from "next/link";
import { ArrowLeft, ArrowRight, Rocket, Users } from "lucide-react";

type ComingSoonPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: "launchpad" | "community";
};

export default function ComingSoonPage({ eyebrow, title, description, icon }: ComingSoonPageProps) {
  const Icon = icon === "launchpad" ? Rocket : Users;

  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-3xl text-center">
        <div className="inline-flex items-center gap-3 bg-primary-container text-on-primary-container px-4 py-2 border-4 border-black neo-shadow-primary text-xs font-black uppercase tracking-[0.2em]">
          <Icon className="h-4 w-4" />
          {eyebrow}
        </div>
        <h1 className="mt-8 text-5xl sm:text-7xl lg:text-8xl font-black uppercase leading-[0.85] tracking-tighter text-on-surface">
          {title}
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base sm:text-lg font-medium leading-relaxed text-on-surface-variant">
          {description}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/marketplace" className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 border-4 border-black font-black uppercase tracking-tighter neo-shadow-secondary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            Explore Marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-tighter text-on-surface hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
