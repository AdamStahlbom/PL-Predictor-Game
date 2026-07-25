// src/app/page.tsx
import { supabase } from "@/lib/supabase";
import { Match } from "@/types";
import MatchCard from "@/components/MatchCard";

export default async function Home() {
  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .eq("gameweek_id", 1)
    .order("kick_off", { ascending: true });

  if (error) {
    console.error("Kunde inte hämta matcher:", error);
    return (
      <div className="p-8 text-red-500">Kunde inte ladda spelschemat.</div>
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
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </main>
  );
}
