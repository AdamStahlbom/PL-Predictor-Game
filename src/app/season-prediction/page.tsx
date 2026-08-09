import { createClient } from "@/lib/supabase-server";
import { PREMIER_LEAGUE_TEAMS, Team } from "@/lib/teams";
import SeasonPredictionClient from "@/components/SeasonPredictionClient";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SeasonPredictionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const LOCK_DATE = new Date("2026-08-14T17:00:00Z");
  const isLocked = new Date() > LOCK_DATE;

  const { data: allPredictions } = await supabase
    .from("season_predictions")
    .select(
      `
      user_id,
      team_id,
      position,
      profiles ( full_name, display_name, avatar_url )
    `,
    )
    .order("position", { ascending: true });

  const myRawPredictions =
    allPredictions?.filter((p) => p.user_id === user.id) || [];
  const hasSubmittedBefore = myRawPredictions.length === 20;

  let myTeams = [...PREMIER_LEAGUE_TEAMS];

  if (hasSubmittedBefore) {
    myTeams = myRawPredictions
      .sort((a, b) => a.position - b.position)
      .map((p) => PREMIER_LEAGUE_TEAMS.find((t) => t.id === p.team_id)!)
      .filter(Boolean);
  }

  const friendsMap = new Map<string, any>();

  allPredictions?.forEach((p) => {
    if (p.user_id === user.id) return;

    const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;

    if (!friendsMap.has(p.user_id)) {
      friendsMap.set(p.user_id, {
        userId: p.user_id,
        name: profile?.display_name || profile?.full_name || "Okänd",
        avatarUrl: profile?.avatar_url || null,
        teams: [],
      });
    }

    const team = PREMIER_LEAGUE_TEAMS.find((t) => t.id === p.team_id);
    if (team) {
      friendsMap.get(p.user_id).teams.push({ ...team, position: p.position });
    }
  });

  const friendsData = Array.from(friendsMap.values())
    .map((friend) => {
      friend.teams.sort((a: any, b: any) => a.position - b.position);
      return friend;
    })
    .filter((friend) => friend.teams.length === 20);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-xl mx-auto pt-6 px-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform inline-block mr-2">
            &larr;
          </span>
          Tillbaka
        </Link>
        <div className="text-center mt-4">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            Sluttabellen
          </h1>
          <p className="text-gray-500 text-sm">Vem tar hem säsongen 26/27?</p>
        </div>
      </div>

      <SeasonPredictionClient
        userId={user.id}
        myTeams={myTeams}
        hasSubmittedBefore={hasSubmittedBefore}
        isLocked={isLocked}
        friendsData={friendsData}
      />
    </main>
  );
}
