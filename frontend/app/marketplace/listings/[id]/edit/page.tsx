"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api, extractDRFError } from "@/lib/api";
import Link from "next/link";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Loader2, 
  IndianRupee, 
  Tag, 
  MapPin, 
  AlignLeft, 
  Sparkles,
  Check
} from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface ListingImage {
  id: number;
  image: string;
  order: number;
}

export default function EditListingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string>("");
  const [condition, setCondition] = useState("good");
  const [location, setLocation] = useState("");
  const [existingImages, setExistingImages] = useState<ListingImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsInitialLoading(true);
        const [catRes, listRes] = await Promise.all([
          api.get("/api/listings/categories/"),
          api.get(`/api/listings/items/${id}/`)
        ]);

        setCategories(catRes.data.results || catRes.data);
        const listing = listRes.data;

        // Security check: only owner can edit
        if (user && listing.seller !== user.id) {
          router.replace(`/marketplace/listings/${id}`);
          return;
        }

        setTitle(listing.title || "");
        setDescription(listing.description || "");
        setPrice(String(Math.round(listing.price) || listing.price || ""));
        setCategory(listing.category ? String(listing.category) : "");
        setCondition(listing.condition || "good");
        setLocation(listing.location || "");
        setExistingImages(listing.images || []);
      } catch (err) {
        console.error("Failed to load listing for editing", err);
        setErrorMsg("Failed to load listing details.");
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const totalImages = existingImages.length + newImages.length + filesArray.length;
      
      if (totalImages > 5) {
        setErrorMsg("Maximum 5 photos allowed per listing.");
        return;
      }

      setNewImages(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prev => [...prev, ...newPreviews]);
      setErrorMsg("");
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      if (category) formData.append("category", category);
      formData.append("condition", condition);
      formData.append("location", location.trim());

      newImages.forEach(image => {
        formData.append("uploaded_images", image);
      });

      await api.patch(`/api/listings/items/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccessMsg("Listing updated successfully!");
      setTimeout(() => {
        router.push(`/marketplace/listings/${id}`);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(extractDRFError(err?.response?.data) || "Failed to update listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-semibold text-on-surface-variant">Loading listing for edit...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div>
        <Link
          href={`/marketplace/listings/${id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Listing
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight uppercase">
          Edit Listing
        </h1>
        <p className="text-sm text-on-surface-variant font-medium">
          Update the price, description, condition, or photos for this item.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-bold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-primary/20 border border-primary text-primary text-sm font-bold flex items-center gap-2">
          <Check className="w-5 h-5 stroke-[3]" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
            Item Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sony WH-1000XM4 Noise Canceling Headphones"
            className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="new">Brand New / Sealed</option>
              <option value="like_new">Like New (Barely used)</option>
              <option value="good">Good (Minor wear)</option>
              <option value="fair">Fair (Visible use, works fully)</option>
              <option value="poor">Poor (For parts / repair)</option>
            </select>
          </div>
        </div>

        {/* Price & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              Price (₹)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="number"
                step="1"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              Meetup Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Central Library, 2nd Floor"
                className="w-full pl-10 pr-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Include any accessories, scratches, semester used, or reasons for selling..."
            className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Photos Section */}
        <div>
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
            Photos (Existing & New)
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {/* Existing Images */}
            {existingImages.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant/30 group">
                <img src={img.image} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white rounded text-[9px] font-bold">
                  Current
                </span>
              </div>
            ))}

            {/* New Previews */}
            {newImagePreviews.map((preview, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary group">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-error transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-primary text-black rounded text-[9px] font-bold">
                  New
                </span>
              </div>
            ))}

            {/* Upload Button */}
            {existingImages.length + newImages.length < 5 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-outline-variant/50 hover:border-primary flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors bg-surface-container">
                <Upload className="w-5 h-5 text-on-surface-variant mb-1" />
                <span className="text-[10px] font-bold text-on-surface-variant">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/20">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-primary-container text-on-primary-container font-black uppercase tracking-tighter border-4 border-black rounded-xl hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>

          <Link
            href={`/marketplace/listings/${id}`}
            className="px-6 py-4 rounded-xl border-2 border-outline-variant/40 text-on-surface font-bold text-sm hover:border-outline-variant hover:bg-surface-container transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
