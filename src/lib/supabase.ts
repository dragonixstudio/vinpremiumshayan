import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "https://ovfxmniswfwyaqtufbix.supabase.co";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92Znhtbmlzd2Z3eWFxdHVmYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0Njk1MzYsImV4cCI6MjEwMDA0NTUzNn0.24y1gcNVJ_XLN-6N0At1XaQH7d2e7Ig-29wZsWiT5iU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
