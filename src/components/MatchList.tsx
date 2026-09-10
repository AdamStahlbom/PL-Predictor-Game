import { createClient } from "@/lib/supabase-server";
import { Match, Prediction } from "@/types";
import MatchCard from "@/components/MatchCard";

export default async function MatchList({
  currentGameweek,
}: {
  currentGameweek: number;
}) {
  const supabase = await createClient();

  const userPromise = supabase.auth.getUser();
  const matchesPromise = supabase
    .from("matches")
    .select("*")
    .eq("gameweek_id", currentGameweek)
    .order("kick_off", { ascending: true });

  const [
    {
      data: { user },
    },
    { data: matches, error },
  ] = await Promise.all([userPromise, matchesPromise]);

  if (error) {
    console.error("Kunde inte hämta matcher:", error);
    return (
      <div className="p-8 text-red-500 text-center">
        Kunde inte ladda spelschemat.
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

  if (matches?.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Inga matcher inlagda för denna omgång.
      </div>
    );
  }

  return (
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
  );
}
