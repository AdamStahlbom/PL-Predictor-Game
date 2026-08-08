import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import LeaderboardFilter from "@/components/LeaderboardFilter";

export const dynamic = "force-dynamic";

const getFallbackAvatar = (name: string, userId: string) => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-amber-500",
  ];
  const charCode = userId.charCodeAt(userId.length - 1) || 0;
  return {
    color: colors[charCode % colors.length],
    initial: name.substring(0, 1).toUpperCase(),
  };
};

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const filter = params.filter || "all";
  const gw = params.gw ? parseInt(params.gw) : 1;

  const { data: profiles } = await supabase.from("profiles").select("*");

  let query = supabase
    .from("predictions")
    .select(
      `
      user_id, 
      outcome,
      matches!inner(status, gameweek_id, kick_off, home_score, away_score)
    `,
    )
    .eq("matches.status", "FINISHED");

  if (filter === "gw") {
    query = query.eq("matches.gameweek_id", gw);
  } else if (filter === "month") {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    query = query.gte("matches.kick_off", oneMonthAgo.toISOString());
  }

  const { data: predictions, error } = await query;
  if (error) console.error("Kunde inte hämta filtrerad data:", error);

  const board = new Map();

  // Ge alla 0 poäng som start
  profiles?.forEach((p) => {
    board.set(p.id, {
      user_id: p.id,
      display_name: p.display_name,
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      total_points: 0,
    });
  });

  predictions?.forEach((p: any) => {
    const m = p.matches;
    let correct = null;

    if (m.home_score > m.away_score) correct = "1";
    else if (m.home_score === m.away_score) correct = "X";
    else if (m.home_score < m.away_score) correct = "2";

    if (p.outcome === correct && board.has(p.user_id)) {
      board.get(p.user_id).total_points += 1;
    }
  });

  const leaderboard = Array.from(board.values()).sort(
    (a, b) => b.total_points - a.total_points,
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="group inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform inline-block mr-2">
            &larr;
          </span>
          Tillbaka till spelschemat
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-lg shadow-amber-500/20 mb-4 transform -rotate-6">
            <span className="text-3xl">🏆</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Poängligan
          </h1>
        </div>

        <LeaderboardFilter />

        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-gray-100 text-center shadow-sm">
              <p className="text-gray-500 mt-1">
                Inga spelare hittades i databasen ännu.
              </p>
            </div>
          ) : (
            leaderboard.map((row, index) => {
              const nameToShow =
                row.display_name ||
                row.full_name ||
                `Spelare ${row.user_id.substring(0, 4)}`;
              const fallback = getFallbackAvatar(nameToShow, row.user_id);

              const isFirst = index === 0 && row.total_points > 0;
              const isSecond = index === 1 && row.total_points > 0;
              const isThird = index === 2 && row.total_points > 0;

              return (
                <div
                  key={row.user_id}
                  className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${isFirst ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-md transform hover:-translate-y-1" : "bg-white border-gray-100 shadow-sm"}`}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-8 flex justify-center">
                      {isFirst ? (
                        <span className="text-3xl drop-shadow-md">🥇</span>
                      ) : isSecond ? (
                        <span className="text-3xl drop-shadow-md">🥈</span>
                      ) : isThird ? (
                        <span className="text-3xl drop-shadow-md">🥉</span>
                      ) : (
                        <span className="text-lg font-bold text-gray-400">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      {row.avatar_url ? (
                        <img
                          src={row.avatar_url}
                          alt={nameToShow}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-sm object-cover"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ${fallback.color}`}
                        >
                          {fallback.initial}
                        </div>
                      )}
                      <span
                        className={`font-bold text-sm sm:text-base ${isFirst ? "text-amber-900" : "text-gray-900"}`}
                      >
                        {nameToShow}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex flex-col items-end justify-center px-4 py-2 rounded-xl ${isFirst ? "bg-amber-100/80" : "bg-gray-100/80"}`}
                  >
                    <span
                      className={`font-black text-xl sm:text-2xl leading-none ${isFirst ? "text-amber-700" : "text-gray-800"}`}
                    >
                      {row.total_points}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
