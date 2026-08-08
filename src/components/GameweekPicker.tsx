"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface GameweekPickerProps {
  currentGameweek: number;
  onChange?: (newGameweek: number) => void;
}

export default function GameweekPicker({
  currentGameweek,
  onChange,
}: GameweekPickerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleGameweekChange = (newGameweek: number) => {
    setIsOpen(false);

    if (onChange) {
      onChange(newGameweek);
    } else {
      router.push(`/?gw=${newGameweek}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-2xl shadow-sm border border-gray-100">
      <button
        onClick={() => handleGameweekChange(Math.max(1, currentGameweek - 1))}
        disabled={currentGameweek === 1}
        className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 active:scale-95 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline">Föregående</span>
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200"
        >
          <span>Gameweek {currentGameweek}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 max-h-60 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-1.5 scrollbar-thin scrollbar-thumb-gray-200">
            {Array.from({ length: 38 }, (_, i) => i + 1).map((gw) => (
              <button
                key={gw}
                onClick={() => handleGameweekChange(gw)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                  gw === currentGameweek
                    ? "bg-blue-600 text-white font-bold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Gameweek {gw}</span>
                {gw === currentGameweek && (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => handleGameweekChange(Math.min(38, currentGameweek + 1))}
        disabled={currentGameweek === 38}
        className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 active:scale-95 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <span className="hidden sm:inline">Nästa</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
