import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ashuzirbhyuojnqdmitn.supabase.co";
const supabaseAnonKey = "sb_publishable_4-JtYXA03z8zXSIWoYjSJA_tnmw4usC";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  // Try to get column info via the OpenAPI endpoint
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Prefer: "params=single-object",
    },
    body: JSON.stringify({
      query: `SELECT column_name, data_type, is_nullable, column_default
              FROM information_schema.columns
              WHERE table_schema = 'public'
              AND table_name IN ('prompts', 'notes', 'arena_comparisons')
              ORDER BY table_name, ordinal_position`,
    }),
  });

  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", text.substring(0, 3000));

  // Also try to get foreign key info
  const fkResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Prefer: "params=single-object",
    },
    body: JSON.stringify({
      query: `SELECT
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
              FROM information_schema.table_constraints tc
              JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
              JOIN information_schema.constraint_column_usage ccu
                ON ccu.constraint_name = tc.constraint_name
              WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_schema = 'public'`,
    }),
  });

  const fkText = await fkResponse.text();
  console.log("\n--- FK Info ---");
  console.log("Status:", fkResponse.status);
  console.log("Response:", fkText.substring(0, 2000));
}

inspect().catch(console.error);
