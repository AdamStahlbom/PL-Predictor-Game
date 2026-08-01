import { createClient } from "@/lib/supabase-server";
import { Match, Prediction } from "@/types";
import MatchCard from "@/components/MatchCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TeamMatchesPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const supabase = await createClient();
  const { teamId } = await params;
  const teamName = decodeURIComponent(teamId);

  const userPromise = supabase.auth.getUser();
  const matchesPromise = supabase
    .from("matches")
    .select("*")
    .or(`home_team.eq."${teamName}",away_team.eq."${teamName}"`)
    .order("kick_off", { ascending: true });

  const [
    {
      data: { user },
    },
    { data: matches, error },
  ] = await Promise.all([userPromise, matchesPromise]);

  if (error) {
    console.error("Kunde inte hämta lagschema:", error);
    return (
      <div className="p-8 text-red-500 text-center">
        Kunde inte ladda matcherna för {teamName}.
      </div>
    );
  }

  let userPredictions: Record<number, Prediction> = {};

  if (user && matches && matches.length > 0) {
    const matchIds = matches.map((m) => m.id);

    const { data: predictions } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id)
      .in("match_id", matchIds);

    if (predictions) {
      userPredictions = predictions.reduce(
        (acc, pred) => {
          acc[pred.match_id] = pred;
          return acc;
        },
        {} as Record<number, Prediction>,
      );
    }
  }

  const teamLogo = matches?.[0]
    ? matches[0].home_team === teamName
      ? matches[0].home_logo
      : matches[0].away_logo
    : null;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          &larr; Tillbaka till spelschemat
        </Link>

        <div className="flex items-center justify-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          {teamLogo && (
            <img
              src={teamLogo}
              alt={teamName}
              className="w-16 h-16 object-contain"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{teamName}</h1>
            <p className="text-sm text-gray-500">Alla matcher under säsongen</p>
          </div>
        </div>

        <div className="space-y-4">
          {matches?.map((match: Match) => (
            <MatchCard
              key={match.id}
              match={match}
              userId={user?.id ?? null}
              initialPrediction={userPredictions[match.id] ?? null}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
