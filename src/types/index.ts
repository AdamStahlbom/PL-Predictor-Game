// src/types/index.ts
export interface Match {
  id: number;
  home_team: string;
  away_team: string;
  home_logo: string;
  away_logo: string;
  kick_off: string;
  status: string;
}
export interface Prediction {
  id?: number;
  user_id: string;
  match_id: number;
  outcome: "1" | "X" | "2";
}
