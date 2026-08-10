import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const profilePromise = supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const pointsPromise = supabase.rpc("get_leaderboard", { filter_mode: "all" });

  const [{ data: profile }, { data: leaderboard }] = await Promise.all([
    profilePromise,
    pointsPromise,
  ]);

  const nameToShow =
    profile?.display_name || profile?.full_name || "Ny Spelare";

  const userRank = leaderboard?.find((row: any) => row.user_id === user.id);
  const totalPoints = userRank?.total_points || 0;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          &larr;
        </Link>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="text-9xl">⚽️</span>
          </div>

          <div className="relative z-10 flex items-center gap-4 mb-6">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 border-white/20 shadow-sm object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-2xl font-bold">
                {nameToShow.substring(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{nameToShow}</h1>
              <p className="text-blue-100 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              <p className="text-blue-100 text-sm font-medium mb-1">
                Dina Poäng
              </p>
              <p className="text-3xl font-black">{totalPoints} pt</p>
            </div>
          </div>
        </div>

        <ProfileForm
          userId={user.id}
          initialDisplayName={profile?.display_name || ""}
          initialAvatarUrl={
            profile?.avatar_url || user.user_metadata?.avatar_url
          }
        />
      </div>
    </main>
  );
}
