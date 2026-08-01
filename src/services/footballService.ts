// src/services/footballService.ts
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function syncPremierLeagueMatches() {
  const response = await fetch(
    "https://api.football-data.org/v4/competitions/PL/matches",
    {
      method: "GET",
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY!,
      },
    },
  );

  const data = await response.json();

  if (!data.matches || data.matches.length === 0) {
    throw new Error("Inga matcher hittades från Football-Data.org");
  }

  const matchesToInsert = data.matches.map((match: any) => ({
    id: match.id,
    gameweek_id: match.matchday,
    home_team: match.homeTeam.name,
    away_team: match.awayTeam.name,
    home_logo: match.homeTeam.crest || "",
    away_logo: match.awayTeam.crest || "",
    kick_off: match.utcDate,
    home_score: match.score.fullTime.home,
    away_score: match.score.fullTime.away,
    status: match.status,
  }));

  const { error } = await supabaseAdmin
    .from("matches")
    .upsert(matchesToInsert, { onConflict: "id" });

  if (error) throw error;

  return matchesToInsert.length;
}
