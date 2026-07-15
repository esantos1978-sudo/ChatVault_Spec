import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ashuzirbhyuojnqdmitn.supabase.co";
const supabaseAnonKey = "sb_publishable_4-JtYXA03z8zXSIWoYjSJA_tnmw4usC";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  // Try to select specific columns to see if they exist
  // This will tell us the column names via error messages if they don't exist

  console.log("=== Testing prompts columns ===");
  const { data: p1, error: e1 } = await supabase
    .from("prompts")
    .select(
      "id, title, content, category, tags, times_used, created_at, is_favorite, user_id",
    )
    .limit(0);
  console.log("prompts basic cols:", e1?.message || "OK");

  console.log("\n=== Testing notes columns ===");
  const { data: n1, error: e2 } = await supabase
    .from("notes")
    .select(
      "id, title, content, tags, ai_model, source_type, source_url, created_at, is_favorite, user_id, prompt_id",
    )
    .limit(0);
  console.log("notes basic cols:", e2?.message || "OK");

  // Test if prompt_id exists in notes
  const { data: n2, error: e3 } = await supabase
    .from("notes")
    .select("prompt_id")
    .limit(0);
  console.log("notes.prompt_id exists:", e3?.message || "YES");

  console.log("\n=== Testing arena_comparisons columns ===");
  const { data: a1, error: e4 } = await supabase
    .from("arena_comparisons")
    .select("id, prompt, responses, winner, created_at, user_id")
    .limit(0);
  console.log("arena basic cols:", e4?.message || "OK");

  // Test if prompt_id exists in arena_comparisons
  const { data: a2, error: e5 } = await supabase
    .from("arena_comparisons")
    .select("prompt_id")
    .limit(0);
  console.log("arena.prompt_id exists:", e5?.message || "YES");

  // Try to get the actual type of prompts.id by doing a raw query
  // We can try to insert a test row and see the error
  console.log("\n=== Testing prompts.id type ===");
  const { error: e6 } = await supabase
    .from("prompts")
    .insert({ id: "test-string-id" });
  console.log("Insert with string id:", e6?.message || "Unexpected success");

  const { error: e7 } = await supabase.from("prompts").insert({ id: 999999 });
  console.log("Insert with numeric id:", e7?.message || "Unexpected success");
}

inspect().catch(console.error);
