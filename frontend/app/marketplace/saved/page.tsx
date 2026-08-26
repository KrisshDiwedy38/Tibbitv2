"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  ArrowLeft, 
  Heart, 
  Package, 
  Loader2, 
  MapPin, 
  Trash2 
} from "lucide-react";

interface SavedListingItem {
  id: number; // saved listing entry id
  saved_at: string;
  listing: {
    id: number;
    title: string;
    description: string;
    price: string;
    category_name: string | null;
    condition: string;
    seller_name: string;
    location: string;
    images: { id: number; image: string }[];
  };
}

export default function SavedListingsPage() {
  const [savedItems, setSavedItems] = useState<SavedListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedListings = async () => {
    try {
      const res = await api.get("/api/listings/saved/");
      setSavedItems(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load saved items", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedListings();
  }, []);

  const handleUnsave = async (e: React.MouseEvent, listingId: number) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic removal
    setSavedItems(prev => prev.filter(item => item.listing.id !== listingId));

    try {
      await api.post(`/api/listings/items/${listingId}/unsave/`);
    } catch (err) {
      fetchSavedListings(); // Revert on failure
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {savedItems.length} Saved Items
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">
          Saved Wishlist
        </h1>
        <p className="text-sm text-on-surface-variant">
          Items you've bookmarked for later across your campus marketplace.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-sm font-semibold text-on-surface-variant">Loading saved items...</p>
        </div>
      ) : savedItems.length === 0 ? (
        <div className="bg-surface-container border-2 border-dashed border-outline-variant/30 rounded-2xl p-12 text-center max-w-md mx-auto my-8">
          <Heart className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-on-surface">No saved items yet</h3>
          <p className="text-sm text-on-surface-variant mt-1 mb-6">
            Click the heart icon on any listing card to save items here.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl text-sm"
          >
            Explore Feed
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedItems.map(({ listing }) => (
            <Link
              key={listing.id}
              href={`/marketplace/listings/${listing.id}`}
              className="group bg-surface-container border-2 border-outline-variant/30 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-200 flex flex-col hover:-translate-y-1"
            >
              {/* Image */}
              <div className="aspect-square bg-surface-container-highest relative overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0].image}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
                    <Package className="w-16 h-16" />
                  </div>
                )}

                <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 font-black text-sm text-primary">
                  ₹{parseFloat(listing.price).toLocaleString('en-IN')}
                </div>

                <button
                  onClick={(e) => handleUnsave(e, listing.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-surface/80 backdrop-blur-md text-error hover:bg-error hover:text-white transition-colors border border-white/10"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs font-bold text-primary mb-1">
                    {listing.category_name || "General"}
                  </div>
                  <h3 className="font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                    {listing.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant font-medium">
                  <span>{listing.seller_name}</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[80px]">{listing.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
