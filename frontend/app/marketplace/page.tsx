"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Package, Search, Filter, TrendingUp, Sparkles } from "lucide-react";

export default function MarketplacePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">
            Campus Feed
          </h1>
          <p className="text-on-surface-variant mt-2 max-w-xl">
            Welcome back, {user?.first_name}. Here's what's trending at {user?.university || 'your university'} today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border-2 border-outline-variant/30 rounded-xl bg-surface focus:ring-0 focus:border-primary transition-colors text-on-surface placeholder:text-on-surface-variant/50 font-medium text-sm"
              placeholder="Search listings..."
            />
          </div>
          <button className="p-2.5 border-2 border-outline-variant/30 rounded-xl bg-surface hover:border-primary/50 hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Quick Stats / Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-2 text-primary font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Top Categories</span>
          </div>
          <h3 className="text-2xl font-black text-on-surface">Tech & Books</h3>
          <p className="text-sm text-on-surface-variant mt-1">+124 new items this week</p>
        </div>

        <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform text-on-surface">
            <Package className="w-24 h-24" />
          </div>
          <div className="text-sm font-bold text-on-surface-variant mb-1">
            Active Listings
          </div>
          <h3 className="text-2xl font-black text-on-surface">1,492</h3>
          <p className="text-sm text-on-surface-variant mt-1">Across your campus</p>
        </div>
        
        <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="text-sm font-bold text-on-surface-variant mb-1">
            Your Reputation
          </div>
          <h3 className="text-2xl font-black text-primary">{user?.reputation_score || 0}</h3>
          <p className="text-sm text-on-surface-variant mt-1">Top 15% of sellers</p>
        </div>
      </section>

      {/* Placeholder Feed */}
      <section>
        <h2 className="text-xl font-bold text-on-surface mb-6">Recent Additions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl bg-surface-container-highest border border-outline-variant/20 mb-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300"></div>
                {/* Placeholder Image Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-outline-variant/50 group-hover:scale-110 transition-transform duration-500">
                  <Package className="w-12 h-12" />
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 bg-surface/80 backdrop-blur-md rounded-lg text-xs font-bold text-on-surface">
                  ${(Math.random() * 100 + 10).toFixed(0)}
                </div>
              </div>
              <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">
                Item Title Placeholder
              </h4>
              <p className="text-sm text-on-surface-variant mt-0.5">
                {['Like New', 'Good', 'Fair'][i % 3]} • 2h ago
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
