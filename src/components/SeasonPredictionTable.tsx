"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { supabase } from "@/lib/supabase";
import { Team } from "@/lib/teams";

interface Props {
  userId: string;
  initialTeams: Team[];
  isLocked: boolean;
}

export default function SeasonPredictionTable({
  userId,
  initialTeams,
  isLocked,
}: Props) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination || isLocked) return;

    const items = Array.from(teams);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTeams(items);
  };

  const handleSave = async () => {
    if (isLocked) return;

    setIsSaving(true);
    setMessage("Sparar...");

    try {
      const payload = teams.map((team, index) => ({
        user_id: userId,
        team_id: team.id,
        position: index + 1,
      }));

      const { error: upsertError } = await supabase
        .from("season_predictions")
        .upsert(payload, {
          onConflict: "user_id, team_id",
        });

      if (upsertError) throw upsertError;

      setMessage(
        "✅ Din tabell är sparad! Du kan ändra den fram till deadline.",
      );

      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Kunde inte spara din tabell.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="font-bold text-gray-900 text-lg">Din Tabell</h2>
          <p className="text-sm text-gray-500">
            {isLocked
              ? "Tabellen är låst. Tipsen går ej att ändra."
              : "Dra och släpp lagen för att ändra plats."}
          </p>
        </div>
        {!isLocked && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 active:scale-95 shadow-sm"
          >
            {isSaving ? "Sparar..." : "Spara tabell"}
          </button>
        )}
      </div>

      {message && (
        <p
          className={`text-center text-sm font-semibold animate-in fade-in ${message.includes("❌") ? "text-red-600" : "text-emerald-600"}`}
        >
          {message}
        </p>
      )}

      {/* Drag & Drop-listan */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="teams-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {teams.map((team, index) => {
                const position = index + 1;

                let posColor = "text-gray-400 bg-gray-50 border-gray-100";
                if (position <= 4)
                  posColor = "text-blue-700 bg-blue-50 border-blue-200";
                else if (position === 5)
                  posColor = "text-amber-700 bg-amber-50 border-amber-200";
                else if (position >= 18)
                  posColor = "text-red-700 bg-red-50 border-red-200";

                return (
                  <Draggable
                    key={team.id.toString()}
                    draggableId={team.id.toString()}
                    index={index}
                    isDragDisabled={isLocked}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center justify-between p-4 sm:p-3 bg-white rounded-xl border transition-all ${
                          snapshot.isDragging
                            ? "shadow-xl ring-2 ring-blue-500 scale-[1.02] z-50 border-transparent"
                            : "shadow-sm border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-base sm:text-sm rounded-lg border shadow-inner ${posColor}`}
                          >
                            {position}
                          </span>
                          <img
                            src={team.logo_url}
                            alt={team.name}
                            className="w-8 h-8 sm:w-7 sm:h-7 object-contain"
                          />
                          <span className="font-bold text-gray-800 text-base sm:text-sm">
                            {team.name}
                          </span>
                        </div>

                        {!isLocked && (
                          <div className="text-gray-400 px-1 cursor-grab active:cursor-grabbing flex items-center justify-center min-h-[32px] min-w-[32px]">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 8h16M4 16h16"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
