"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, display_name, avatar_url")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setUserName(data.display_name || data.full_name || null);
        setAvatarUrl(data.avatar_url || null);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUserName(null);
        setAvatarUrl(null);
      }

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="font-extrabold text-xl tracking-tight text-gray-900 hover:text-blue-600 transition-colors z-10"
        >
          PL Tips
        </Link>

        <div className="flex items-center gap-2 z-10">
          {userName ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 p-1 hover:bg-gray-50 transition-colors">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profilbild"
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full object-cover shadow-sm border border-gray-200"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-gray-400 text-xs hidden sm:block mr-1">
                  ▼
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-100 rounded-2xl shadow-lg focus:outline-none p-1.5 z-50 transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
              >
                <div className="px-3 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs text-gray-500">Inloggad som</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {userName}
                  </p>
                </div>

                <MenuItem>
                  <Link
                    href="/profile"
                    className="flex w-full items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-colors text-gray-700 data-[focus]:bg-gray-50 data-[focus]:text-blue-600"
                  >
                    👤 Min Profil
                  </Link>
                </MenuItem>

                <MenuItem>
                  <Link
                    href="/"
                    className="flex w-full items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-colors text-gray-700 data-[focus]:bg-gray-50 data-[focus]:text-blue-600"
                  >
                    ⚽️ Tippa Omgång
                  </Link>
                </MenuItem>

                <MenuItem>
                  <Link
                    href="/season-prediction"
                    className="flex w-full items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-colors text-gray-700 data-[focus]:bg-gray-50 data-[focus]:text-blue-600"
                  >
                    🏆 Tippa Sluttabellen
                  </Link>
                </MenuItem>

                <MenuItem>
                  <Link
                    href="/leaderboard"
                    className="flex w-full items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-colors text-gray-700 data-[focus]:bg-gray-50 data-[focus]:text-blue-600"
                  >
                    📊 Poängliga
                  </Link>
                </MenuItem>

                <div className="h-px bg-gray-100 my-1"></div>

                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-colors text-left text-red-500 data-[focus]:bg-red-50 data-[focus]:text-red-600"
                  >
                    Logga ut
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm shadow-sm"
            >
              Logga in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
