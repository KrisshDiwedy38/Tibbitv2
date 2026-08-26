"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api, extractDRFError } from "@/lib/api";
import Link from "next/link";
import { 
  Package, 
  PlusCircle, 
  Eye, 
  CheckCircle2, 
  RotateCcw, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Sparkles,
  ShoppingBag,
  Clock,
  ArrowLeft,
  Pencil
} from "lucide-react";

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
  status: 'active' | 'sold' | 'expired' | 'deleted';
  views_count: number;
  created_at: string;
  images: ListingImage[];
}

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'sold'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchMyListings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/api/listings/items/mine/?status=${statusFilter}`);
      setListings(res.data);
    } catch (err) {
      console.error("Failed to load user listings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [statusFilter]);

  const toggleStatus = async (listingId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'sold' : 'active';
    setActionLoadingId(listingId);
    setErrorMsg("");

    try {
      await api.patch(`/api/listings/items/${listingId}/`, {
        status: nextStatus
      });
      setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: nextStatus } : l));
    } catch (err: any) {
      setErrorMsg(extractDRFError(err?.response?.data));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (listingId: number) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return;
    }

    setActionLoadingId(listingId);
    setErrorMsg("");

    try {
      await api.delete(`/api/listings/items/${listingId}/`);
      setListings(prev => prev.filter(l => l.id !== listingId));
    } catch (err: any) {
      setErrorMsg(extractDRFError(err?.response?.data));
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics
  const totalCount = listings.length;
  const activeCount = listings.filter(l => l.status === 'active').length;
  const soldCount = listings.filter(l => l.status === 'sold').length;
  const totalViews = listings.reduce((sum, item) => sum + (item.views_count || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Feed
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight uppercase">
            My Listings Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            Manage your on-campus items, track views, and update availability.
          </p>
        </div>

        <Link
          href="/marketplace/create"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-container text-on-primary-container font-black uppercase tracking-tighter border-4 border-black rounded-xl hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm shadow-md cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Listing
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container border-2 border-outline-variant/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Items</span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-on-surface font-['Space_Grotesk']">{totalCount}</p>
        </div>

        <div className="bg-surface-container border-2 border-outline-variant/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-primary font-['Space_Grotesk']">{activeCount}</p>
        </div>

        <div className="bg-surface-container border-2 border-outline-variant/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sold</span>
            <CheckCircle2 className="w-4 h-4 text-on-surface-variant" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-on-surface font-['Space_Grotesk']">{soldCount}</p>
        </div>

        <div className="bg-surface-container border-2 border-outline-variant/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-on-surface font-['Space_Grotesk']">{totalViews}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-4">
        {(['all', 'active', 'sold'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 cursor-pointer ${
              statusFilter === tab
                ? "bg-primary-container text-on-primary-container border-black shadow-sm"
                : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-on-surface hover:border-primary/40"
            }`}
          >
            {tab === 'all' ? 'All Listings' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Listings List */}
      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-surface-container border-2 border-dashed border-outline-variant/30 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-on-surface uppercase">No {statusFilter !== 'all' ? statusFilter : ''} listings found</h3>
          <p className="text-xs text-on-surface-variant">
            {statusFilter === 'sold'
              ? "You haven't marked any items as sold yet."
              : "You haven't listed any items in the marketplace yet. Sell your unused books, electronics, or dorm gear!"}
          </p>
          <Link
            href="/marketplace/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-on-primary-container font-black uppercase text-xs border-2 border-black rounded-xl hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Post Your First Item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((item) => {
            const isItemLoading = actionLoadingId === item.id;
            const isSold = item.status === 'sold';

            return (
              <div
                key={item.id}
                className="bg-surface-container border-2 border-outline-variant/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/40 transition-all shadow-sm"
              >
                {/* Left info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-surface border border-outline-variant/30 shrink-0 overflow-hidden flex items-center justify-center relative">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0].image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-8 h-8 text-on-surface-variant/40" />
                    )}
                    {isSold && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase text-white bg-error/90 px-1.5 py-0.5 rounded">SOLD</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        isSold 
                          ? "bg-error/10 text-error border-error/30" 
                          : "bg-primary/10 text-primary border-primary/30"
                      }`}>
                        {item.status}
                      </span>
                      {item.category_name && (
                        <span className="text-xs text-on-surface-variant font-bold">
                          • {item.category_name}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/marketplace/listings/${item.id}`}
                      className="text-base sm:text-lg font-black text-on-surface hover:text-primary transition-colors truncate block"
                    >
                      {item.title}
                    </Link>

                    <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                      <span className="text-sm font-black text-primary font-['Space_Grotesk']">
                        ₹{parseFloat(item.price).toLocaleString('en-IN')}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {item.views_count || 0} views
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20">
                  <Link
                    href={`/marketplace/listings/${item.id}/edit`}
                    className="p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
                    title="Edit Listing"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/marketplace/listings/${item.id}`}
                    className="p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
                    title="View Public Listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => toggleStatus(item.id, item.status)}
                    disabled={isItemLoading}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                      isSold
                        ? "bg-surface text-primary border-primary/40 hover:bg-primary/10"
                        : "bg-surface text-on-surface-variant border-outline-variant/40 hover:text-primary hover:border-primary/50"
                    }`}
                  >
                    {isItemLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isSold ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" /> Relist Item
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Sold
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isItemLoading}
                    className="p-2.5 rounded-xl bg-surface border border-error/30 text-error hover:bg-error hover:text-white transition-colors cursor-pointer"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
