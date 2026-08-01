import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

const generateAvatar = (userId: string) => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-rose-500",
  ];
  const charCode = userId.charCodeAt(userId.length - 1);
  const color = colors[charCode % colors.length];
  const initial = userId.substring(0, 1).toUpperCase();

  return { color, initial };
};

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const { data: leaderboard, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("total_points", { ascending: false });

  if (error) {
    console.error("Kunde inte hämta topplistan:", error);
  }

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

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-lg shadow-amber-500/20 mb-4 transform -rotate-6">
            <span className="text-3xl">🏆</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Poängligan
          </h1>
          <p className="text-gray-500 font-medium">
            1 poäng per rätt tippat tecken.
          </p>
        </div>

        <div className="space-y-3">
          {!leaderboard || leaderboard.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-gray-100 text-center shadow-sm">
              <span className="text-4xl mb-3 block">⚽️</span>
              <h3 className="text-lg font-bold text-gray-900">Inga poäng än</h3>
              <p className="text-gray-500 mt-1">
                När första matchen är färdigspelad dyker tabellen upp här.
              </p>
            </div>
          ) : (
            leaderboard.map((row, index) => {
              const { color, initial } = generateAvatar(row.user_id);

              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              const cardClasses = isFirst
                ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-amber-100/50 shadow-md transform hover:-translate-y-1"
                : isSecond
                  ? "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 shadow-sm"
                  : isThird
                    ? "bg-gradient-to-r from-orange-50 to-stone-50 border-orange-200/60 shadow-sm"
                    : "bg-white border-gray-100 shadow-sm hover:border-gray-200";

              return (
                <div
                  key={row.user_id}
                  className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${cardClasses}`}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Position */}
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
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ${color}`}
                      >
                        {initial}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`font-bold text-sm sm:text-base ${isFirst ? "text-amber-900" : "text-gray-900"}`}
                        >
                          Spelare {row.user_id.substring(0, 4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex flex-col items-end justify-center px-4 py-2 rounded-xl ${
                      isFirst ? "bg-amber-100/80" : "bg-gray-100/80"
                    }`}
                  >
                    <span
                      className={`font-black text-xl sm:text-2xl leading-none ${
                        isFirst ? "text-amber-700" : "text-gray-800"
                      }`}
                    >
                      {row.total_points}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-0.5 ${
                        isFirst ? "text-amber-600" : "text-gray-500"
                      }`}
                    >
                      Poäng
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
