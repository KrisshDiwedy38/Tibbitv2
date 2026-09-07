import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-8">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center gap-3 bg-secondary text-on-secondary px-4 py-2 border-4 border-black neo-shadow-primary text-xs font-black uppercase tracking-[0.2em]">
          <Compass className="h-4 w-4" />
          Signal Lost
        </div>
        <p className="mt-8 text-8xl sm:text-9xl font-black leading-none tracking-tighter text-primary-container">404</p>
        <h1 className="mt-4 text-3xl sm:text-5xl font-black uppercase tracking-tighter text-on-surface">Page not found</h1>
        <p className="mt-5 text-on-surface-variant">This route is not part of the Tibbit map yet.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 border-4 border-black font-black uppercase tracking-tighter neo-shadow-secondary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          <ArrowLeft className="h-4 w-4" />
          Back Home
        </Link>
      </div>
    </main>
  );
}
