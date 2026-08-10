// src/app/api/fetch-matches/route.ts
import { NextResponse } from "next/server";
import { syncPremierLeagueMatches } from "@/services/footballService";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  try {
    const syncedCount = await syncPremierLeagueMatches();

    const { error: dbError } = await supabaseAdmin.from("cron_logs").insert({
      status: "success",
      message: `Successfully synced ${syncedCount} matches`,
    });

    if (dbError) {
      console.error("Kunde inte skriva till cron_logs:", dbError.message);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedCount} matches`,
    });
  } catch (error: any) {
    console.error("Fixture sync failed:", error);

    await supabaseAdmin.from("cron_logs").insert({
      status: "error",
      message: error?.message || "Internal Server Error while syncing matches",
    });

    return NextResponse.json(
      { error: "Internal Server Error while syncing matches" },
      { status: 500 },
    );
  }
}
