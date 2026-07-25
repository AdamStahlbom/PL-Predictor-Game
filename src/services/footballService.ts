// src/services/footballService.ts
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
export async function syncPremierLeagueMatches() {
  const response = await fetch(
    "https://v3.football.api-sports.io/fixtures?league=39&season=2024",
    {
      method: "GET",
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY!,
      },
    },
  );

  const data = await response.json();
  if (!data.response?.length) {
    throw new Error("No fixtures found from external API");
  }

  const matchesToInsert = data.response.map((fixtureData: any) => {
    const roundString = fixtureData.league.round;
    const gameweekMatch = roundString.match(/\d+/);

    return {
      id: fixtureData.fixture.id,
      gameweek_id: gameweekMatch ? parseInt(gameweekMatch[0], 10) : 1,
      home_team: fixtureData.teams.home.name,
      away_team: fixtureData.teams.away.name,
      home_logo: fixtureData.teams.home.logo,
      away_logo: fixtureData.teams.away.logo,
      kick_off: fixtureData.fixture.date,
      home_score: fixtureData.goals.home,
      away_score: fixtureData.goals.away,
      status: fixtureData.fixture.status.short,
    };
  });

  const { error } = await supabaseAdmin
    .from("matches")
    .upsert(matchesToInsert, { onConflict: "id" });

  if (error) throw error;

  return matchesToInsert.length;
}
