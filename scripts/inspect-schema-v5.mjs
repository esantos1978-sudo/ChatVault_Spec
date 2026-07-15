import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ashuzirbhyuojnqdmitn.supabase.co";
const supabaseAnonKey = "sb_publishable_4-JtYXA03z8zXSIWoYjSJA_tnmw4usC";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  // Check user_id type
  console.log("=== Testing user_id type ===");
  const { error: e1 } = await supabase.from("prompts").insert({ user_id: 123 });
  console.log("user_id numeric:", e1?.message || "Unexpected success");

  const { error: e2 } = await supabase
    .from("prompts")
    .insert({ user_id: "test-uuid" });
  console.log("user_id string:", e2?.message || "Unexpected success");

  // Check if notes.prompt_id has a FK constraint by trying to insert an invalid prompt_id
  console.log("\n=== Testing notes.prompt_id FK ===");
  const { error: e3 } = await supabase.from("notes").insert({
    title: "test",
    content: "test",
    user_id: "00000000-0000-0000-0000-000000000000",
    prompt_id: "00000000-0000-0000-0000-000000000001",
  });
  console.log(
    "notes insert with invalid prompt_id:",
    e3?.message || "Unexpected success",
  );

  // Check arena_comparisons columns more thoroughly
  console.log("\n=== Testing arena_comparisons all columns ===");
  const { data: a1, error: e4 } = await supabase
    .from("arena_comparisons")
    .select("id, prompt, responses, winner, created_at, user_id, prompt_id")
    .limit(0);
  console.log("arena all cols:", e4?.message || "OK");

  // Check if arena_comparisons has user_id
  const { data: a2, error: e5 } = await supabase
    .from("arena_comparisons")
    .select("user_id")
    .limit(0);
  console.log("arena.user_id exists:", e5?.message || "YES");

  // Check notes columns more thoroughly
  console.log("\n=== Testing notes all columns ===");
  const { data: n1, error: e6 } = await supabase
    .from("notes")
    .select(
      "id, title, content, tags, ai_model, source_type, source_url, created_at, is_favorite, user_id, prompt_id, summary",
    )
    .limit(0);
  console.log("notes all cols:", e6?.message || "OK");
}

inspect().catch(console.error);
