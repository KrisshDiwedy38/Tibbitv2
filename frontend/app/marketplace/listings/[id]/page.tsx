"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Eye, 
  ShieldCheck, 
  Share2, 
  Loader2, 
  Package, 
  User as UserIcon,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

interface ListingImage {
  id: number;
  image: string;
  order: number;
}

interface ListingDetail {
  id: number;
  title: string;
  description: string;
  price: string;
  category_name: string | null;
  condition: string;
  seller: number;
  seller_name: string;
  seller_avatar: string | null;
  location: string;
  status: string;
  views_count: number;
  is_saved: boolean;
  created_at: string;
  images: ListingImage[];
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/api/listings/items/${id}/`);
        setListing(res.data);
      } catch (err) {
        setError("Listing not found or has been removed.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  const toggleSave = async () => {
    if (!listing || isSaving) return;
    setIsSaving(true);
    const currentSaved = listing.is_saved;

    // Optimistic
    setListing({ ...listing, is_saved: !currentSaved });

    try {
      if (currentSaved) {
        await api.post(`/api/listings/items/${listing.id}/unsave/`);
      } else {
        await api.post(`/api/listings/items/${listing.id}/save/`);
      }
    } catch (err) {
      setListing({ ...listing, is_saved: currentSaved });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartConversation = async () => {
    if (!listing) return;
    try {
      // Initialize or retrieve conversation
      const res = await api.post("/api/messaging/conversations/", {
        seller: listing.seller,
        listing: listing.id
      });
      router.push(`/marketplace/messages?conversation=${res.data.id}`);
    } catch (err) {
      // Fallback redirect to messages
      router.push("/marketplace/messages");
    }
  };

  const formatCondition = (cond: string) => {
    switch (cond) {
      case 'new': return 'Brand New';
      case 'like_new': return 'Like New';
      case 'good': return 'Good Condition';
      case 'fair': return 'Fair Condition';
      default: return cond;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <Package className="w-16 h-16 text-on-surface-variant/40 mx-auto" />
        <h2 className="text-2xl font-bold text-on-surface">Listing Not Found</h2>
        <p className="text-sm text-on-surface-variant">{error || "This item may have been sold or removed."}</p>
        <Link href="/marketplace" className="inline-block px-6 py-3 bg-primary text-on-primary font-bold rounded-xl text-sm">
          Return to Feed
        </Link>
      </div>
    );
  }

  const isSeller = user?.email && listing.seller_name.toLowerCase().includes(user.first_name.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: listing.title, url: window.location.href });
            }
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-surface-container border-2 border-outline-variant/30 rounded-2xl overflow-hidden relative group">
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[activeImageIndex]?.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
                <Package className="w-24 h-24" />
              </div>
            )}

            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-surface/90 backdrop-blur-md rounded-full text-xs font-bold text-primary border border-white/10 uppercase">
                {formatCondition(listing.condition)}
              </span>
            </div>
          </div>

          {/* Thumbnail Selector */}
          {listing.images && listing.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {listing.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-primary scale-105"
                      : "border-outline-variant/30 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Listing Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container border-2 border-outline-variant/30 rounded-2xl p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-primary uppercase mb-2">
                <span>{listing.category_name || "General"}</span>
                <span className="flex items-center gap-1 text-on-surface-variant font-medium">
                  <Eye className="w-3.5 h-3.5" /> {listing.views_count} views
                </span>
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
                  {listing.title}
                </h1>
                {listing.status === 'sold' && (
                  <span className="px-3 py-1 bg-error text-white font-black text-xs uppercase tracking-widest rounded-lg border-2 border-black shrink-0">
                    SOLD OUT
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-primary font-['Space_Grotesk']">
                  ₹{parseFloat(listing.price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-on-surface-variant uppercase font-bold">INR</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-outline-variant/20 text-xs text-on-surface-variant font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Pickup location: <strong className="text-on-surface">{listing.location}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Listed: <strong className="text-on-surface">{new Date(listing.created_at).toLocaleDateString()}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-outline-variant/20">
              {!isSeller ? (
                listing.status === 'sold' ? (
                  <div className="p-4 rounded-xl bg-error/10 border-2 border-error/30 text-error text-center font-bold text-sm">
                    This item has already been marked as sold.
                  </div>
                ) : (
                  <button
                    onClick={handleStartConversation}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-container text-on-primary-container font-black uppercase tracking-tighter border-4 border-black rounded-xl hover:-translate-y-0.5 transition-all text-base shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5" /> Message Seller
                  </button>
                )
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-bold text-center">
                    You are the owner of this listing
                  </div>
                  <Link
                    href={`/marketplace/listings/${listing.id}/edit`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-surface-container-highest text-on-surface font-black uppercase text-xs border-2 border-outline-variant/40 rounded-xl hover:border-primary hover:text-primary transition-all"
                  >
                    Edit Listing Details
                  </Link>
                </div>
              )}

              <button
                onClick={toggleSave}
                disabled={isSaving}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border-2 font-bold text-sm transition-all ${
                  listing.is_saved
                    ? "bg-primary/20 text-primary border-primary"
                    : "bg-surface border-outline-variant/40 text-on-surface hover:border-primary/50"
                }`}
              >
                <Heart className={`w-4 h-4 ${listing.is_saved ? "fill-primary text-primary" : ""}`} />
                {listing.is_saved ? "Saved to Wishlist" : "Save Item"}
              </button>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-surface-container border-2 border-outline-variant/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-on-surface-variant">
                Seller Information
              </h3>
              <Link
                href={`/marketplace/users/${listing.seller}`}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View Profile <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <Link 
              href={`/marketplace/users/${listing.seller}`}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/40 shrink-0 group-hover:scale-105 transition-transform">
                {listing.seller_avatar ? (
                  <img src={listing.seller_avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6 text-primary" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-on-surface text-base truncate group-hover:text-primary transition-colors">
                  <span>{listing.seller_name}</span>
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                </div>
                <p className="text-xs text-on-surface-variant truncate">
                  {user?.university || "Verified University Student"}
                </p>
              </div>
            </Link>

            <div className="p-3 bg-surface rounded-xl border border-outline-variant/20 flex items-center justify-between text-xs font-medium text-on-surface-variant">
              <span className="flex items-center gap-1 text-primary">
                <ShieldCheck className="w-4 h-4" /> Student Verification Active
              </span>
              <span className="font-bold text-on-surface">100% Safe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-surface-container border-2 border-outline-variant/30 rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-on-surface uppercase tracking-tight">
          Item Description
        </h2>
        <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line font-medium">
          {listing.description}
        </div>
      </div>
    </div>
  );
}
