"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserName(session?.user?.user_metadata?.full_name ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUserName(session?.user?.user_metadata?.full_name ?? null);

      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center relative">
        <Link
          href="/"
          className="font-extrabold text-xl tracking-tight text-gray-900 hover:text-blue-600 transition-colors z-10"
        >
          PL Tips
        </Link>

        {userName && (
          <div className="absolute left-1/2 -translate-x-1/2 z-20">
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 active:scale-95 transition-all group"
            >
              <span className="text-sm font-bold text-gray-800 tracking-wide truncate max-w-[140px] sm:max-w-[220px] block text-center group-hover:text-blue-600 transition-colors">
                {userName}
              </span>
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 z-10">
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors"
          >
            <span>🏆</span>
            <span className="hidden sm:inline text-gray-700">Poängliga</span>
          </Link>

          {userName ? (
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
            >
              Logga ut
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
            >
              Logga in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
