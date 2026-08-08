"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface FriendPrediction {
  outcome: "1" | "X" | "2";
  profiles: {
    full_name: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
  user_id: string;
}

interface FriendsPredictionsProps {
  matchId: number;
  hasStarted: boolean;
}

const getFallbackAvatar = (name: string, id: string = "1") => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-amber-500",
  ];
  const charCode = id
    ? id.charCodeAt(id.length - 1)
    : Math.floor(Math.random() * 5);
  return {
    color: colors[charCode % colors.length],
    initial: name.substring(0, 1).toUpperCase(),
  };
};

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
          user_id,
          profiles ( full_name, display_name, avatar_url )
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
        className="w-full py-3 text-xs font-medium text-gray-500 hover:text-gray-700 flex justify-center items-center gap-2 transition-colors"
      >
        {isExpanded ? "▲ Dölj andras tips" : "▼ Visa andras tips"}
      </button>

      {isExpanded && (
        <div className="px-4 sm:px-6 pb-6 pt-2">
          {isLoadingFriends ? (
            <div className="text-center text-sm text-gray-500 animate-pulse">
              Laddar...
            </div>
          ) : friendsPredictions.length === 0 ? (
            <div className="text-center text-sm text-gray-500 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
              Ingen har tippat på denna match än.
            </div>
          ) : (
            <ul className="space-y-2 mt-2">
              {friendsPredictions.map((pred, idx) => {
                const nameToShow =
                  pred.profiles?.display_name ||
                  pred.profiles?.full_name ||
                  "Okänd spelare";
                const fallback = getFallbackAvatar(nameToShow, pred.user_id);

                return (
                  <li
                    key={idx}
                    className="flex justify-between items-center bg-white border border-gray-100 p-2.5 sm:p-3 rounded-xl shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      {pred.profiles?.avatar_url ? (
                        <img
                          src={pred.profiles.avatar_url}
                          alt={nameToShow}
                          className="w-8 h-8 rounded-full shadow-sm object-cover border border-gray-100"
                        />
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner ${fallback.color}`}
                        >
                          {fallback.initial}
                        </div>
                      )}

                      <span className="text-sm font-semibold text-gray-800">
                        {nameToShow}
                      </span>
                    </div>

                    {hasStarted ? (
                      <span className="font-bold text-sm bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-lg">
                        {pred.outcome}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-inner">
                        🔒 Dolt
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
