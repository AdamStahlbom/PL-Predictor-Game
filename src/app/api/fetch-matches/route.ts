// src/app/api/fetch-matches/route.ts
import { NextResponse } from "next/server";
import { syncPremierLeagueMatches } from "@/services/footballService";

export async function GET() {
  try {
    const syncedCount = await syncPremierLeagueMatches();

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedCount} matches`,
    });
  } catch (error) {
    console.error("Fixture sync failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error while syncing matches" },
      { status: 500 },
    );
  }
}
