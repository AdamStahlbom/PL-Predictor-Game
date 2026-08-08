"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  userId: string;
  initialDisplayName: string;
  initialAvatarUrl: string | null;
}

export default function ProfileForm({
  userId,
  initialDisplayName,
  initialAvatarUrl,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setMessage("Laddar upp bild...");

      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        throw new Error("Bilden är för stor. Maxstorlek är 2 MB.");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Du kan bara ladda upp bildfiler.");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

      const { data: existingFiles } = await supabase.storage
        .from("avatars")
        .list(userId);

      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map((f) => `${userId}/${f.name}`);
        await supabase.storage.from("avatars").remove(filesToRemove);
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const newAvatarUrl = data.publicUrl;
      setAvatarUrl(newAvatarUrl);

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", userId);

      if (dbError) throw dbError;

      setMessage("✅ Profilbilden är uppdaterad!");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setMessage(`❌ ${error.message || "Kunde inte spara bilden"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    const trimmedName = displayName.trim();
    if (trimmedName.length < 2) {
      setMessage("❌ Namnet måste vara minst 2 tecken långt.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: trimmedName })
      .eq("id", userId);

    setIsSaving(false);

    if (error) {
      setMessage("❌ Kunde inte spara namnet.");
    } else {
      setDisplayName(trimmedName);
      setMessage("✅ Namnet har uppdaterats!");
      router.refresh();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Redigera Profil</h2>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Profilbild
        </label>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
              {displayName.substring(0, 1).toUpperCase() || "?"}
            </div>
          )}

          <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-sm py-2 px-4 rounded-xl transition-colors">
            {uploading ? "Sparar bild..." : "Välj ny bild"}
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleAvatarUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <hr className="border-gray-100" />

      <form onSubmit={handleSaveName} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Visningsnamn (Syns i poängligan)
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Namn..."
            maxLength={20}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving || !displayName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition-all disabled:opacity-50"
          >
            {isSaving ? "Sparar..." : "Spara namn"}
          </button>
        </div>
      </form>

      {message && (
        <p
          className={`text-sm font-semibold animate-in fade-in ${message.includes("❌") ? "text-red-600" : "text-gray-800"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
