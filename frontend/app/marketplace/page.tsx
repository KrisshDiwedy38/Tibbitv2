"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  Bookmark,
  Loader2,
  MapPin,
  Clock,
  Heart
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  icon: string | null;
  description: string | null;
}

interface ListingImage {
  id: number;
  image: string;
  order: number;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  category: number | null;
  category_name: string | null;
  condition: string;
  seller_name: string;
  seller_avatar: string | null;
  location: string;
  status: 'active' | 'sold' | 'expired' | 'deleted' | string;
  views_count: number;
  is_saved: boolean;
  created_at: string;
  images: ListingImage[];
}

function MarketplacePageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || "";
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/listings/categories/");
      setCategories(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const res = await api.get("/api/listings/items/", { params });
      setListings(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load listings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const toggleSave = async (e: React.MouseEvent, listingId: number, currentSaved: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    setListings(prev =>
      prev.map(item =>
        item.id === listingId ? { ...item, is_saved: !currentSaved } : item
      )
    );

    try {
      if (currentSaved) {
        await api.post(`/api/listings/items/${listingId}/unsave/`);
      } else {
        await api.post(`/api/listings/items/${listingId}/save/`);
      }
    } catch (err) {
      // Revert on error
      setListings(prev =>
        prev.map(item =>
          item.id === listingId ? { ...item, is_saved: currentSaved } : item
        )
      );
    }
  };

  const formatCondition = (cond: string) => {
    switch (cond) {
      case 'new': return 'Brand New';
      case 'like_new': return 'Like New';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      default: return cond;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Category Pills */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
            selectedCategory === null
              ? "bg-primary-container text-on-primary-container border-black shadow-sm"
              : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-on-surface hover:border-primary/40"
          }`}
        >
          All Items
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
              selectedCategory === cat.id
                ? "bg-primary-container text-on-primary-container border-black shadow-sm"
                : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-on-surface hover:border-primary/40"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </section>

      {/* Feed Grid */}
      <section>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-sm font-semibold text-on-surface-variant">Loading campus items...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-surface-container border-2 border-dashed border-outline-variant/30 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <Package className="w-12 h-12 text-on-surface-variant mx-auto mb-4" />
            <h3 className="text-lg font-bold text-on-surface">No listings found</h3>
            <p className="text-sm text-on-surface-variant mt-1 mb-6">
              Be the first to post an item in this category!
            </p>
            <Link
              href="/marketplace/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl text-sm"
            >
              <PlusCircle className="w-4 h-4" /> Create Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((item) => (
              <Link
                key={item.id}
                href={`/marketplace/listings/${item.id}`}
                className="group bg-surface-container border-2 border-outline-variant/30 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-200 flex flex-col hover:-translate-y-1"
              >
                {/* Thumbnail Image */}
                <div className="aspect-square bg-surface-container-highest relative overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0].image}
                      alt={item.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        item.status === 'sold' ? "grayscale brightness-75" : ""
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
                      <Package className="w-16 h-16" />
                    </div>
                  )}

                  {item.status === 'sold' && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1 bg-error text-white font-black text-xs uppercase tracking-widest rounded-lg border-2 border-black shadow-lg transform -rotate-6">
                        SOLD OUT
                      </span>
                    </div>
                  )}

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                    <p className="text-xl font-black text-primary font-['Space_Grotesk']">
                      ₹{parseFloat(item.price).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleSave(e, item.id, item.is_saved)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-surface/80 backdrop-blur-md text-on-surface hover:text-primary transition-colors border border-white/10"
                    title={item.is_saved ? "Remove from saved" : "Save item"}
                  >
                    <Heart className={`w-4 h-4 ${item.is_saved ? "fill-primary text-primary" : ""}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1 font-semibold">
                      <span className="text-primary font-bold">{item.category_name || "General"}</span>
                      <span>{formatCondition(item.condition)}</span>
                    </div>
                    <h3 className="font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {item.seller_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{item.seller_name}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] shrink-0">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[80px]">{item.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <MarketplacePageContent />
    </Suspense>
  );
}
