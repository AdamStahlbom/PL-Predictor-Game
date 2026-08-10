// src/app/api/fetch-matches/route.ts
import { NextResponse } from "next/server";
import { syncPremierLeagueMatches } from "@/services/footballService";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const syncedCount = await syncPremierLeagueMatches();

    await supabase.from("cron_logs").insert({
      status: "success",
      message: `Successfully synced ${syncedCount} matches`,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedCount} matches`,
    });
  } catch (error: any) {
    console.error("Fixture sync failed:", error);

    await supabase.from("cron_logs").insert({
      status: "error",
      message: error?.message || "Internal Server Error while syncing matches",
    });

    return NextResponse.json(
      { error: "Internal Server Error while syncing matches" },
      { status: 500 },
    );
  }
}
