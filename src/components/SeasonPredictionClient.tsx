"use client";

import { useState } from "react";
import SeasonPredictionTable from "@/components/SeasonPredictionTable";
import { Team } from "@/lib/teams";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
interface FriendData {
  userId: string;
  name: string;
  avatarUrl: string | null;
  teams: Team[];
}

interface Props {
  userId: string;
  myTeams: Team[];
  hasSubmittedBefore: boolean;
  isLocked: boolean;
  friendsData: FriendData[];
}

export default function SeasonPredictionClient({
  userId,
  myTeams,
  hasSubmittedBefore,
  isLocked,
  friendsData,
}: Props) {
  const [activeTab, setActiveTab] = useState<"mine" | "friends">("mine");
  const [selectedFriendId, setSelectedFriendId] = useState<string>(
    friendsData[0]?.userId || "",
  );

  const canViewFriends = hasSubmittedBefore || isLocked;

  const selectedFriend =
    friendsData.find((f) => f.userId === selectedFriendId) || friendsData[0];
  return (
    <div className="max-w-xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner gap-1 sm:gap-2">
        <button
          onClick={() => setActiveTab("mine")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "mine"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          Min Tabell
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "friends"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          Vännernas Tabeller {!canViewFriends && "🔒"}
        </button>
      </div>

      {activeTab === "mine" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <SeasonPredictionTable
            userId={userId}
            initialTeams={myTeams}
            isLocked={isLocked}
          />
        </div>
      )}

      {activeTab === "friends" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {!canViewFriends ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Tjuvkika inte!
              </h3>
              <p className="text-gray-500 text-sm">
                Tippa och spara din egen tabell först för att låsa upp polarnas
                gissningar!
              </p>
              <button
                onClick={() => setActiveTab("mine")}
                className="mt-6 bg-blue-600 text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors"
              >
                Gå till Min Tabell
              </button>
            </div>
          ) : friendsData.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <p className="text-gray-500">
                Inga av dina vänner har sparat sin tabell ännu.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 z-10">
                <span className="font-bold text-gray-700 text-sm">
                  Välj spelare:
                </span>

                <div className="relative w-full sm:w-56">
                  <Listbox
                    value={selectedFriendId}
                    onChange={setSelectedFriendId}
                  >
                    <ListboxButton className="relative w-full flex items-center justify-between bg-gray-50 border border-gray-200 hover:border-gray-300 px-3 py-2.5 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {selectedFriend?.avatarUrl ? (
                          <img
                            src={selectedFriend.avatarUrl}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                            {selectedFriend?.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-bold text-sm text-gray-800 truncate">
                          {selectedFriend?.name}
                        </span>
                      </div>
                      <span className="pointer-events-none text-gray-400 text-xs">
                        ▼
                      </span>
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-xl bg-white p-1 shadow-lg border border-gray-100 focus:outline-none transition duration-100 ease-out data-[closed]:opacity-0"
                    >
                      {friendsData.map((friend) => (
                        <ListboxOption
                          key={friend.userId}
                          value={friend.userId}
                          className="group relative cursor-pointer select-none py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between data-[focus]:bg-gray-100 data-[selected]:bg-blue-50"
                        >
                          <div className="flex items-center gap-2.5">
                            {friend.avatarUrl ? (
                              <img
                                src={friend.avatarUrl}
                                alt=""
                                className="w-5 h-5 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-gray-200 text-gray-600 group-data-[selected]:bg-blue-600 group-data-[selected]:text-white">
                                {friend.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="block truncate text-sm font-medium text-gray-700 group-data-[selected]:font-bold group-data-[selected]:text-blue-700">
                              {friend.name}
                            </span>
                          </div>
                          <span className="hidden group-data-[selected]:block text-blue-600">
                            ✓
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Listbox>
                </div>
              </div>

              {selectedFriend && (
                <div className="space-y-2">
                  {selectedFriend.teams.map((team, index) => {
                    const position = index + 1;
                    let posColor = "text-gray-400 bg-gray-50 border-gray-100";
                    if (position <= 4)
                      posColor = "text-blue-700 bg-blue-50 border-blue-200";
                    else if (position === 5)
                      posColor = "text-amber-700 bg-amber-50 border-amber-200";
                    else if (position >= 18)
                      posColor = "text-red-700 bg-red-50 border-red-200";

                    return (
                      <div
                        key={team.id}
                        className="flex items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-lg border shadow-inner ${posColor}`}
                          >
                            {position}
                          </span>
                          <img
                            src={team.logo_url}
                            alt={team.name}
                            className="w-7 h-7 object-contain"
                          />
                          <span className="font-bold text-gray-800">
                            {team.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
