"use client";

import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) console.error("Inloggningsfel:", error);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight text-gray-900">
          PL Tips
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Logga in med Google
        </button>
      </div>
    </nav>
  );
}
