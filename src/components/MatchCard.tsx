// src/components/MatchCard.tsx
"use client";

import { useState } from "react";
import { Match, Prediction } from "@/types";
import { supabase } from "@/lib/supabase";
import FriendsPredictions from "./FriendsPredictions";
import Link from "next/link";

interface MatchCardProps {
  match: Match;
  initialPrediction?: Prediction | null;
  userId?: string | null;
}

export default function MatchCard({
  match,
  initialPrediction,
  userId,
}: MatchCardProps) {
  const [outcome, setOutcome] = useState<"1" | "X" | "2" | null>(
    initialPrediction?.outcome ?? null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const kickOffDate = new Date(match.kick_off);
  const now = new Date();

  const isTooLate = now >= kickOffDate;
  const isTooEarly =
    match.gameweek_id !== 1 &&
    kickOffDate > new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const isFinished = match.home_score !== null && match.away_score !== null;
  const isLocked = isTooLate || isTooEarly || isFinished;

  const formattedTime = kickOffDate.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = kickOffDate.toLocaleDateString("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const getCorrectOutcome = (): "1" | "X" | "2" | null => {
    if (!isFinished) return null;
    if (match.home_score! > match.away_score!) return "1";
    if (match.home_score! < match.away_score!) return "2";
    return "X";
  };

  const correctOutcome = getCorrectOutcome();
  const isPredictionCorrect = outcome === correctOutcome;

  const handleSavePrediction = async (newOutcome: "1" | "X" | "2") => {
    if (!userId || isLocked) return;

    setOutcome(newOutcome);
    setIsSaving(true);

    const { error } = await supabase.from("predictions").upsert(
      {
        user_id: userId,
        match_id: match.id,
        outcome: newOutcome,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,match_id" },
    );

    setIsSaving(false);

    if (error) {
      console.error("Kunde inte spara tipset:", error);
      setOutcome(initialPrediction?.outcome ?? null);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border flex flex-col hover:shadow-md transition-shadow overflow-hidden ${
        isFinished ? "border-gray-200" : "border-gray-100"
      }`}
    >
      {isFinished && outcome && (
        <div
          className={`h-1 w-full ${isPredictionCorrect ? "bg-emerald-500" : "bg-red-500"}`}
        ></div>
      )}

      <div className="p-4 sm:p-6 flex items-center justify-between">
        <Link
          href={`/teams/${encodeURIComponent(match.home_team)}`}
          className="flex flex-col items-center w-1/3 text-center gap-2 group cursor-pointer"
        >
          <img
            src={match.home_logo}
            alt={match.home_team}
            className={`w-12 h-12 object-contain transition-transform `}
          />
          <span
            className={`font-semibold text-sm sm:text-base transition-colors `}
          >
            {match.home_team}
          </span>
        </Link>

        <div className="flex flex-col items-center w-1/3">
          <div className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-3">
            {isFinished
              ? "Slutresultat"
              : `${formattedDate} - ${formattedTime}`}
          </div>

          {isFinished ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 text-3xl font-black text-gray-800 bg-gray-100 px-6 py-2 rounded-xl shadow-inner">
                <span>{match.home_score}</span>
                <span className="text-gray-400 text-xl font-normal">-</span>
                <span>{match.away_score}</span>
              </div>

              {outcome && (
                <div
                  className={`text-xs font-bold px-2 py-1 rounded-md ${
                    isPredictionCorrect
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Ditt tips: {outcome}
                </div>
              )}
            </div>
          ) : (
            <div className="flex bg-gray-100 p-1 rounded-lg w-full max-w-[150px] relative">
              {(["1", "X", "2"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSavePrediction(opt)}
                  disabled={!userId || isSaving || isLocked}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    outcome === opt
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  } disabled:opacity-50 ${isLocked ? "cursor-not-allowed" : ""}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {!isFinished && (
            <div className="h-4 mt-2 flex items-center justify-center text-[10px] text-gray-400">
              {isTooLate && <span>Matchen har startat 🔒</span>}
              {isTooEarly && <span>Öppnar 14 dagar innan avspark ⏳</span>}
              {!userId && !isLocked && <span>Logga in för att tippa</span>}
            </div>
          )}
        </div>

        <Link
          href={`/teams/${encodeURIComponent(match.away_team)}`}
          className="flex flex-col items-center w-1/3 text-center gap-2 group cursor-pointer"
        >
          <img
            src={match.away_logo}
            alt={match.away_team}
            className={`w-12 h-12 object-contain transition-transform `}
          />
          <span
            className={`font-semibold text-sm sm:text-base transition-colors `}
          >
            {match.away_team}
          </span>
        </Link>
      </div>

      <FriendsPredictions
        matchId={match.id}
        hasStarted={isTooLate}
        correctOutcome={correctOutcome}
      />
    </div>
  );
}
