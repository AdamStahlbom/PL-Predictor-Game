import { createClient } from "@/lib/supabase-server";
import { getFallbackAvatar } from "@/utils/avatar";

interface LeaderboardListProps {
  filter: string;
  gw: number;
}

export default async function LeaderboardList({
  filter,
  gw,
}: LeaderboardListProps) {
  const supabase = await createClient();

  let startDate = new Date().toISOString();
  if (filter === "month") {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    startDate = oneMonthAgo.toISOString();
  }

  const { data: leaderboard, error } = await supabase.rpc("get_leaderboard", {
    filter_mode: filter,
    gw_id: gw,
    start_date: startDate,
  });

  if (error) {
    console.error("Kunde inte hämta filtrerad data:", error);
  }

  const safeLeaderboard = leaderboard || [];

  if (safeLeaderboard.length === 0) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-gray-100 text-center shadow-sm">
        <p className="text-gray-500 mt-1">
          Inga spelare hittades i databasen ännu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {safeLeaderboard.map((row: any, index: number) => {
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
            className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
              isFirst
                ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-md transform hover:-translate-y-1"
                : "bg-white border-gray-100 shadow-sm"
            }`}
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
      })}
    </div>
  );
}
