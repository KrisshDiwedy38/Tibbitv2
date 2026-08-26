"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Sparkles 
} from "lucide-react";

interface Category {
  id: number;
  name: string;
}

export default function CreateListingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState("good");
  const [location, setLocation] = useState("");
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/listings/categories/");
        const data = res.data.results || res.data;
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id.toString());
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...selectedFiles]);

      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      if (categoryId) formData.append("category", categoryId);
      formData.append("condition", condition);
      formData.append("location", location || "Campus");

      images.forEach(image => {
        formData.append("uploaded_images", image);
      });

      const res = await api.post("/api/listings/items/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      router.push(`/marketplace/listings/${res.data.id}`);
    } catch (err: any) {
      setError(extractDRFError(err?.response?.data));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
          <Sparkles className="w-4 h-4" /> Instant Listing
        </div>
      </div>

      <div className="bg-surface-container border-2 border-outline-variant/30 rounded-2xl p-6 sm:p-10 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">
            Create Listing
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Post an item or service for sale to students across campus.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          {/* Photo Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-on-surface uppercase tracking-wider">
              Item Photos
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/30 group">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-error rounded-full text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-outline-variant/50 hover:border-primary rounded-xl flex flex-col items-center justify-center cursor-pointer bg-surface hover:bg-surface-container-highest transition-colors text-center p-4">
                  <Upload className="w-6 h-6 text-on-surface-variant mb-2" />
                  <span className="text-xs font-bold text-on-surface">Upload Image</span>
                  <span className="text-[10px] text-on-surface-variant mt-0.5">PNG, JPG up to 5MB</span>
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

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-on-surface uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. MacBook Air M2 8GB / 256GB - Space Gray"
              className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-on-surface uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface uppercase tracking-wider mb-2">
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
          </div>

          {/* Condition & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-on-surface uppercase tracking-wider mb-2">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                <option value="new">Brand New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface uppercase tracking-wider mb-2">
                Campus Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Student Union / North Quad"
                  className="w-full pl-10 pr-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-on-surface uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe specs, usage, reason for selling, or meetup preferences..."
              className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-4 px-6 border-4 border-black rounded-xl text-base font-black uppercase tracking-tighter text-on-primary-container bg-primary-container hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Publish Listing"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
