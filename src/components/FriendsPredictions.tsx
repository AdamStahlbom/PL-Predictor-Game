// src/components/FriendsPredictions.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface FriendPrediction {
  outcome: "1" | "X" | "2";
  profiles: { full_name: string } | null;
}

interface FriendsPredictionsProps {
  matchId: number;
  hasStarted: boolean;
}

export default function FriendsPredictions({
  matchId,
  hasStarted,
}: FriendsPredictionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [friendsPredictions, setFriendsPredictions] = useState<
    FriendPrediction[]
  >([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  const toggleExpand = async () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    if (nextState) {
      setIsLoadingFriends(true);
      const { data, error } = await supabase
        .from("predictions")
        .select(
          `
          outcome,
          profiles ( full_name )
        `,
        )
        .eq("match_id", matchId);

      if (!error && data) {
        setFriendsPredictions(data as unknown as FriendPrediction[]);
      }
      setIsLoadingFriends(false);
    }
  };

  return (
    <div className="border-t border-gray-50 bg-gray-50/50">
      <button
        onClick={toggleExpand}
        className="w-full py-3 text-xs font-medium text-gray-500 hover:text-gray-700 flex justify-center items-center gap-2"
      >
        {isExpanded ? "▲ Dölj andras tips" : "▼ Visa andras tips"}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2">
          {isLoadingFriends ? (
            <div className="text-center text-sm text-gray-500">Laddar...</div>
          ) : friendsPredictions.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              Ingen har tippat på denna match än.
            </div>
          ) : (
            <ul className="space-y-3 mt-2">
              {friendsPredictions.map((pred, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-lg shadow-sm"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {pred.profiles?.full_name || "Okänd spelare"}
                  </span>

                  {hasStarted ? (
                    <span className="font-bold text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
                      Tippade: {pred.outcome}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-md flex items-center gap-1">
                      🔒 Tipset är dolt
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
