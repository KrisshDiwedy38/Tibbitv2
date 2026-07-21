"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LogOut, MessageSquare, PlusCircle, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/marketplace" className="text-2xl font-black tracking-tighter text-primary hover:scale-105 transition-transform">
            TIBBIT
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-sm font-bold text-on-surface hover:text-primary transition-colors">
              Feed
            </Link>
            <Link href="/marketplace/startups" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
              Launchpad
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/marketplace/messages"
            className="p-2 rounded-full hover:bg-surface-container transition-colors relative"
          >
            <MessageSquare className="w-5 h-5 text-on-surface" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface"></span>
          </Link>
          
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all active:translate-y-0">
            <PlusCircle className="w-4 h-4" />
            Create Listing
          </button>

          <div className="relative group">
            <button className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full border-2 border-outline-variant/50 hover:border-primary/50 transition-colors bg-surface-container">
              <span className="text-sm font-bold text-on-surface hidden sm:block">
                {user.first_name}
              </span>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-4 h-4 text-primary" />
              </div>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-high rounded-xl shadow-lg border border-outline-variant/30 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
              <Link href="/marketplace/profile" className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-highest transition-colors">
                <UserIcon className="w-4 h-4" /> Profile
              </Link>
              <Link href="/marketplace/settings" className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-highest transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <div className="h-px bg-outline-variant/30 my-1"></div>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-error hover:bg-error/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
