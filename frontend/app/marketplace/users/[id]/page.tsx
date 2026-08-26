"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  User as UserIcon, 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  Package, 
  Clock, 
  Calendar,
  GraduationCap, 
  Loader2, 
  Sparkles,
  ExternalLink,
  Tag
} from "lucide-react";

interface ReviewItem {
  id: number;
  reviewer_name: string;
  reviewer_avatar: string | null;
  reviewer_email: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ListingImage {
  id: number;
  image: string;
  order: number;
}

interface ListingItem {
  id: number;
  title: string;
  description: string;
  price: string;
  category_name: string | null;
  condition: string;
  location: string;
  views_count: number;
  images: ListingImage[];
}

interface PublicUserProfile {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  university: string | null;
  bio: string | null;
  graduation_year: number | null;
  reputation_score: string | number;
  reviews_count: number;
  reviews: ReviewItem[];
  listings: ListingItem[];
  member_since: string;
}

export default function PublicUserProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isMe = user?.id === Number(id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/api/users/${id}/profile/`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load user profile", err);
        setErrorMsg("Student profile not found or is currently inactive.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleStartChat = async () => {
    if (!profile || isStartingChat) return;
    setIsStartingChat(true);

    try {
      const res = await api.post("/api/messaging/conversations/", {
        seller: profile.id
      });
      router.push(`/marketplace/messages?conversation=${res.data.id}`);
    } catch (err) {
      console.error("Failed to start chat", err);
    } finally {
      setIsStartingChat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-semibold text-on-surface-variant">Loading student profile...</p>
      </div>
    );
  }

  if (!profile || errorMsg) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface-container border-2 border-outline-variant/30 rounded-3xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-on-surface uppercase">Student Not Found</h2>
        <p className="text-xs text-on-surface-variant">{errorMsg || "This profile does not exist."}</p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-black uppercase text-xs rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
      </div>
    );
  }

  const scoreNum = parseFloat(String(profile.reputation_score || "5.0"));

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {isMe && (
          <Link
            href="/marketplace/profile"
            className="px-4 py-2 rounded-xl bg-surface-container border border-primary/40 text-primary font-bold text-xs hover:bg-primary/10 transition-colors"
          >
            Edit Your Profile
          </Link>
        )}
      </div>

      {/* Hero Profile Card */}
      <div className="bg-surface-container border-2 border-outline-variant/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 blur-3xl rounded-full pointer-events-none"></div>

        {/* Avatar */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-4 border-black neo-shadow-primary shrink-0">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-12 h-12 text-primary" />
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              {profile.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-bold text-primary w-fit mx-auto sm:mx-0">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Student
            </span>
          </div>

          <p className="text-sm font-bold text-primary">
            {profile.university || "Verified Campus Peer"}
          </p>

          {profile.bio && (
            <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
              "{profile.bio}"
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-on-surface-variant font-medium">
            {profile.graduation_year && (
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-primary" /> Class of {profile.graduation_year}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Member since {new Date(profile.member_since).toLocaleDateString([], { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Reputation Card & Chat Action */}
        <div className="bg-surface border-2 border-outline-variant/30 rounded-2xl p-5 text-center shrink-0 w-full sm:w-56 space-y-3">
          <div>
            {profile.reviews_count > 0 && scoreNum > 0 ? (
              <div className="flex items-center justify-center gap-1.5 text-primary mb-0.5">
                <Star className="w-5 h-5 fill-primary" />
                <span className="text-2xl font-black font-['Space_Grotesk']">{scoreNum.toFixed(1)}</span>
              </div>
            ) : (
              <div className="text-sm font-bold text-on-surface-variant mb-1">
                No ratings yet
              </div>
            )}
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              {profile.reviews_count} Verified {profile.reviews_count === 1 ? 'Review' : 'Reviews'}
            </p>
          </div>

          {!isMe && (
            <button
              onClick={handleStartChat}
              disabled={isStartingChat}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-container text-on-primary-container border-2 border-black rounded-xl font-black uppercase text-xs tracking-tight hover:translate-x-[1px] hover:translate-y-[1px] transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isStartingChat ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" /> Message
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid: Listings & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Items for Sale */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Active Listings ({profile.listings.length})
            </h3>
          </div>

          {profile.listings.length === 0 ? (
            <div className="p-8 bg-surface-container border border-outline-variant/20 rounded-2xl text-center space-y-2">
              <p className="text-sm font-bold text-on-surface">No active listings</p>
              <p className="text-xs text-on-surface-variant">This student doesn't have any active items listed right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.listings.map((item) => (
                <Link
                  key={item.id}
                  href={`/marketplace/listings/${item.id}`}
                  className="group bg-surface-container border-2 border-outline-variant/30 rounded-2xl overflow-hidden hover:border-primary/50 transition-all flex flex-col hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="aspect-video bg-surface-container-highest relative overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0].image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
                        <Package className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/10">
                      <span className="text-sm font-black text-primary font-['Space_Grotesk']">
                        ₹{parseFloat(item.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <p className="text-xs text-primary font-bold">{item.category_name || "General"}</p>
                    <h4 className="font-bold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Verified Peer Reviews */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-lg font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
            <Star className="w-5 h-5 text-primary fill-primary" />
            Peer Reviews ({profile.reviews.length})
          </h3>

          {profile.reviews.length === 0 ? (
            <div className="p-8 bg-surface-container border border-outline-variant/20 rounded-2xl text-center space-y-2">
              <Sparkles className="w-8 h-8 text-primary mx-auto opacity-40" />
              <p className="text-sm font-bold text-on-surface">No reviews yet</p>
              <p className="text-xs text-on-surface-variant">Complete an on-campus trade with {profile.name.split(' ')[0]} to leave the first review!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-surface-container border border-outline-variant/30 rounded-2xl space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                        {rev.reviewer_avatar ? (
                          <img src={rev.reviewer_avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          rev.reviewer_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-xs font-bold text-on-surface">{rev.reviewer_name}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-primary">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-primary" />
                      ))}
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-on-surface-variant italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  )}

                  <p className="text-[10px] text-on-surface-variant font-medium text-right">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
