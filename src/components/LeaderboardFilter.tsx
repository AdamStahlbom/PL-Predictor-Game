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
      <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full sm:w-fit mx-auto shadow-inner gap-1 sm:gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 px-2 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
            currentFilter === "all"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <span className="sm:hidden">Säsong</span>
          <span className="hidden sm:inline">Hela säsongen</span>
        </button>

        <button
          onClick={() => setFilter("month")}
          className={`flex-1 px-2 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
            currentFilter === "month"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <span className="sm:hidden">Månad</span>
          <span className="hidden sm:inline">Senaste månaden</span>
        </button>

        <button
          onClick={() => setFilter("gw")}
          className={`flex-1 px-2 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
            currentFilter === "gw"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <span className="sm:hidden">Omgång</span>
          <span className="hidden sm:inline">Specifik Omgång</span>
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
