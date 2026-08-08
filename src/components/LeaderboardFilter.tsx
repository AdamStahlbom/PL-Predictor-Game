"use client";

import { useRouter, useSearchParams } from "next/navigation";
import GameweekPicker from "./GameweekPicker";

export default function LeaderboardFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get("filter") || "all";
  const currentGw = parseInt(searchParams.get("gw") || "1");

  const setFilter = (filter: string) => {
    if (filter === "gw") {
      router.push(`/leaderboard?filter=gw&gw=${currentGw}`);
    } else {
      router.push(`/leaderboard?filter=${filter}`);
    }
  };

  const handleGameweekChange = (newGw: number) => {
    router.push(`/leaderboard?filter=gw&gw=${newGw}`);
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex bg-gray-100 p-1 rounded-2xl w-full sm:w-fit mx-auto shadow-inner">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 sm:px-6 py-2 text-sm font-bold rounded-xl transition-all ${
            currentFilter === "all"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Hela säsongen
        </button>
        <button
          onClick={() => setFilter("month")}
          className={`flex-1 sm:px-6 py-2 text-sm font-bold rounded-xl transition-all ${
            currentFilter === "month"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Senaste månaden
        </button>
        <button
          onClick={() => setFilter("gw")}
          className={`flex-1 sm:px-6 py-2 text-sm font-bold rounded-xl transition-all ${
            currentFilter === "gw"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Specifik Omgång
        </button>
      </div>

      {currentFilter === "gw" && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <GameweekPicker
            currentGameweek={currentGw}
            onChange={handleGameweekChange}
          />
        </div>
      )}
    </div>
  );
}
