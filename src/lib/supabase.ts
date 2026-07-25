// src/lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";

// Skapar en Supabase-klient för webbläsaren som automatiskt hanterar cookies
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
