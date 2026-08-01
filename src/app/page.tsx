// src/app/page.tsx
import { createClient } from "@/lib/supabase-server";
import { Match, Prediction } from "@/types";
import MatchCard from "@/components/MatchCard";

export default async function Home() {
  const supabase = await createClient();

  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .eq("gameweek_id", 1)
    .order("kick_off", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userPredictions: Record<number, Prediction> = {};

  if (user) {
    const { data: predictions } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id);

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

  if (error) {
    console.error("Kunde inte hämta matcher:", error);
    return (
      <div className="p-8 text-red-500 text-center">
        Kunde inte ladda spelschemat.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Premier League - Omgång 1
        </h1>

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
