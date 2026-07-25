// src/components/MatchCard.tsx
import { Match } from "@/types";

export default function MatchCard({ match }: { match: Match }) {
  const kickOffDate = new Date(match.kick_off);
  const formattedTime = kickOffDate.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = kickOffDate.toLocaleDateString("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center w-1/3 text-center gap-2">
        <img
          src={match.home_logo}
          alt={match.home_team}
          className="w-12 h-12 object-contain"
        />
        <span className="font-semibold text-gray-800 text-sm sm:text-base">
          {match.home_team}
        </span>
      </div>

      <div className="flex flex-col items-center w-1/3">
        <div className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">
          {formattedDate}
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-gray-900 text-lg">
          {formattedTime}
        </div>
      </div>

      <div className="flex flex-col items-center w-1/3 text-center gap-2">
        <img
          src={match.away_logo}
          alt={match.away_team}
          className="w-12 h-12 object-contain"
        />
        <span className="font-semibold text-gray-800 text-sm sm:text-base">
          {match.away_team}
        </span>
      </div>
    </div>
  );
}
