import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ashuzirbhyuojnqdmitn.supabase.co";
const supabaseAnonKey = "sb_publishable_4-JtYXA03z8zXSIWoYjSJA_tnmw4usC";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  // Test the correct FK detection query using pg_catalog
  // We need to check if a FK exists from notes.prompt_id → prompts.id

  // First, let's check what constraints exist on notes
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_fk_info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Prefer: "params=single-object",
    },
    body: JSON.stringify({
      query: `
          SELECT
            tc.constraint_name,
            tc.table_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage ccu
            ON tc.constraint_name = ccu.constraint_name
            AND tc.table_schema = ccu.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
            AND tc.table_name IN ('notes', 'arena_comparisons')
        `,
    }),
  });

  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", text.substring(0, 3000));
}

inspect().catch(console.error);
