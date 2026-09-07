"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LogOut, MessageSquare, PlusCircle, Settings, User as UserIcon, Heart, ExternalLink, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const res = await api.get("/api/messaging/conversations/unread_total/");
        setUnreadCount(res.data.unread_total || 0);
      } catch (err) {
        // silent fail
      }
    };

    fetchUnread();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchUnread();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [user]);

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
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="text-2xl font-black tracking-tighter text-primary hover:scale-105 transition-transform font-['Space_Grotesk']">
              TIBBIT
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/launchpad" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
                Launchpad
              </Link>
              <Link href="/community" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
                Community
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/marketplace/saved"
              className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link 
              href="/marketplace/messages"
              className="p-2 rounded-full hover:bg-surface-container transition-colors relative text-on-surface-variant hover:text-primary"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-black font-black text-[10px] rounded-full flex items-center justify-center border-2 border-surface">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
            
            <Link
              href="/marketplace/create"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container border-2 border-black rounded-xl font-black text-sm shadow-sm hover:-translate-y-0.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create Listing
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full border-2 border-outline-variant/50 hover:border-primary/50 transition-colors bg-surface-container cursor-pointer"
              >
                <span className="text-sm font-bold text-on-surface hidden sm:block">
                  {user.first_name || user.email.split('@')[0]}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)}></div>
              )}
              <div className={`absolute right-0 top-full mt-2 w-52 bg-surface-container-high rounded-xl shadow-2xl border-2 border-outline-variant/30 py-2 transition-all transform origin-top-right z-50 ${
                userMenuOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 pointer-events-none"
              }`}>
                <div className="px-4 py-2 border-b border-outline-variant/20 mb-1">
                  <p className="text-xs font-bold text-on-surface truncate">{user.first_name} {user.last_name}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
                </div>
                <Link 
                  href="/marketplace/my-listings" 
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-highest hover:text-primary transition-colors"
                >
                  <Package className="w-4 h-4 text-primary" /> My Listings
                </Link>
                <Link 
                  href="/marketplace/profile" 
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-highest hover:text-primary transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-primary" /> Profile & Settings
                </Link>
                <Link 
                  href="/marketplace/saved" 
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-highest hover:text-primary transition-colors"
                >
                  <Heart className="w-4 h-4 text-primary" /> Wishlist
                </Link>
                <Link 
                  href="/" 
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-highest hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-primary" /> Home Page
                </Link>
                <div className="h-px bg-outline-variant/30 my-1"></div>
                <button 
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-error hover:bg-error/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
