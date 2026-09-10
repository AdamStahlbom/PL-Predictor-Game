import GameweekPicker from "@/components/GameweekPicker";
import MatchList from "@/components/MatchList";
import MatchSkeleton from "@/components/MatchSkeleton";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  let currentGameweek: number;

  if (params.gw) {
    currentGameweek = Number(params.gw);
  } else {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data: upcomingMatch } = await supabase
      .from("matches")
      .select("gameweek_id")
      .gte("kick_off", now)
      .order("kick_off", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (upcomingMatch?.gameweek_id) {
      currentGameweek = upcomingMatch.gameweek_id;
    } else {
      const { data: lastMatch } = await supabase
        .from("matches")
        .select("gameweek_id")
        .order("gameweek_id", { ascending: false })
        .limit(1)
        .maybeSingle();

      currentGameweek = lastMatch?.gameweek_id || 1;
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Premier League - Omgång {currentGameweek}
        </h1>

        <GameweekPicker
          currentGameweek={currentGameweek}
          fallback={<MatchSkeleton />}
        >
          <MatchList currentGameweek={currentGameweek} />
        </GameweekPicker>
      </div>
    </main>
  );
}
