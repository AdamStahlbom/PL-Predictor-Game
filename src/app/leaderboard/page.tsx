import Link from "next/link";
import LeaderboardFilter from "@/components/Leaderboard/LeaderboardFilter";
import LeaderboardList from "@/components/Leaderboard/LeaderboardList";
import LeaderboardSkeleton from "@/components/Leaderboard/LeaderboardSkeleton";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const filter = params.filter || "all";
  const gw = params.gw ? parseInt(params.gw) : 1;

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

        <LeaderboardFilter fallback={<LeaderboardSkeleton />}>
          <LeaderboardList filter={filter} gw={gw} />
        </LeaderboardFilter>
      </div>
    </main>
  );
}
