"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  userId: string;
  initialDisplayName: string;
  initialAvatarUrl?: string | null;
}

export default function ProfileForm({
  userId,
  initialDisplayName,
  initialAvatarUrl,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl || "");
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setUploading(true);
      setMessage("");

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const publicUrlWithCache = `${data.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(publicUrlWithCache);
      setMessage("📸 Bilden är uppladdad! Klicka på Spara för att verkställa.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Fel vid bilduppladdning.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        avatar_url: avatarUrl,
      })
      .eq("id", userId);

    setIsSaving(false);

    if (error) {
      setMessage("❌ Något gick fel. Försök igen.");
    } else {
      setMessage("✅ Profilen uppdaterades!");
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5"
    >
      <h2 className="text-lg font-bold text-gray-900">Dina uppgifter</h2>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Profilbild
        </label>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-14 h-14 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-bold">
              ?
            </div>
          )}

          <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold py-2 px-3 rounded-xl transition-all">
            {uploading ? "Laddar upp..." : "Välj ny bild"}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Visningsnamn (Syns i poängligan)
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="T.ex. Adam The Champ"
          maxLength={20}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSaving || uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition-all disabled:opacity-50 text-sm"
        >
          {isSaving ? "Sparar..." : "Spara profil"}
        </button>
        {message && (
          <span className="text-xs font-medium text-gray-600">{message}</span>
        )}
      </div>
    </form>
  );
}
