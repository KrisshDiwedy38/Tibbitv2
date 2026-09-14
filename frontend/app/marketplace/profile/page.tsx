"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api, extractDRFError } from "@/lib/api";
import Link from "next/link";
import { 
  User as UserIcon, 
  ArrowLeft, 
  Upload, 
  ShieldCheck, 
  Star, 
  Check, 
  Loader2, 
  LogOut, 
  Sparkles,
  Phone,
  GraduationCap,
  FileText,
  Package
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout, checkAuth } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/profile/");
      const data = res.data;
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setPhoneNumber(data.phone_number || "");
      setBio(data.bio || "");
      setGraduationYear(data.graduation_year ? String(data.graduation_year) : "");
      setProfilePicture(data.profile_picture || null);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file);
      setNewAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      if (phoneNumber) formData.append("phone_number", phoneNumber);
      if (bio) formData.append("bio", bio);
      if (graduationYear) formData.append("graduation_year", graduationYear);

      if (newAvatarFile) {
        formData.append("profile_picture", newAvatarFile);
      }

      const res = await api.put("/api/users/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccessMsg("Profile updated successfully!");
      setProfilePicture(res.data.profile_picture || profilePicture);
      setNewAvatarFile(null);
      setNewAvatarPreview(null);
      await checkAuth();
    } catch (err: any) {
      setErrorMsg(extractDRFError(err?.response?.data));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const avatarDisplay = newAvatarPreview || profilePicture;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/marketplace/my-listings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container border-2 border-outline-variant/40 text-on-surface font-bold text-xs hover:border-primary hover:text-primary transition-all"
          >
            <Package className="w-4 h-4 text-primary" /> Manage My Listings
          </Link>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container border border-error/30 text-error font-bold text-xs hover:bg-error hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* User Hero Card */}
      <div className="bg-surface-container border-2 border-outline-variant/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden shadow-xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 blur-3xl rounded-full pointer-events-none"></div>

        {/* Avatar with upload trigger */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-4 border-black neo-shadow-primary">
            {avatarDisplay ? (
              <img src={avatarDisplay} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-12 h-12 text-primary" />
            )}
          </div>

          <label className="absolute bottom-0 right-0 p-2 bg-primary-container text-black border-2 border-black rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              {firstName} {lastName}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-bold text-primary w-fit mx-auto sm:mx-0">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Student
            </span>
          </div>

          <p className="text-sm text-on-surface-variant font-medium">
            {user?.email}
          </p>

          <p className="text-xs text-primary font-bold">
            {user?.university || "Campus Member"}
          </p>
        </div>

        {/* Reputation Metric */}
        <div className="bg-surface border-2 border-outline-variant/30 rounded-2xl p-4 text-center shrink-0 w-full sm:w-auto min-w-[140px]">
          {user?.reputation_score && parseFloat(String(user.reputation_score)) > 0 ? (
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Star className="w-4 h-4 fill-primary" />
              <span className="text-xl font-black font-['Space_Grotesk']">
                {parseFloat(String(user.reputation_score)).toFixed(1)}
              </span>
            </div>
          ) : (
            <div className="mb-1 text-sm font-bold text-on-surface-variant">
              No ratings yet
            </div>
          )}
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Reputation Score
          </span>
        </div>
      </div>

      {/* Edit Form Card */}
      <div className="bg-surface-container border-2 border-outline-variant/30 rounded-3xl p-6 sm:p-10 shadow-xl">
        <h2 className="text-xl font-black text-on-surface uppercase tracking-tight mb-6">
          Edit Profile Information
        </h2>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-bold flex items-center gap-2">
            <Check className="w-4 h-4" /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Graduation Year
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="number"
                  min="2020"
                  max="2035"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="e.g. 2027"
                  className="w-full pl-10 pr-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              Bio / About Me
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other students about your major, dorm, items you usually trade, or freelance skills..."
              className="w-full px-4 py-3 bg-surface border-2 border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center py-4 px-6 border-4 border-black rounded-xl text-sm font-black uppercase tracking-tighter text-on-primary-container bg-primary-container hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
