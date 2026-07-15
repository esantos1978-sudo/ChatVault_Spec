import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ashuzirbhyuojnqdmitn.supabase.co";
const supabaseAnonKey = "sb_publishable_4-JtYXA03z8zXSIWoYjSJA_tnmw4usC";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  // Test arena_comparisons.id type
  console.log("=== Testing arena_comparisons.id type ===");

  // Try with string UUID
  const { error: e1 } = await supabase.from("arena_comparisons").insert({
    id: "00000000-0000-0000-0000-000000000000",
    prompt: "test",
    responses: { a: "b" },
    user_id: "00000000-0000-0000-0000-000000000000",
  });
  console.log("Insert with UUID string:", e1?.message || "Unexpected success");

  // Try with numeric
  const { error: e2 } = await supabase.from("arena_comparisons").insert({
    id: 999999,
    prompt: "test",
    responses: { a: "b" },
    user_id: "00000000-0000-0000-0000-000000000000",
  });
  console.log("Insert with numeric:", e2?.message || "Unexpected success");

  // Try without id (auto-generated)
  const { error: e3 } = await supabase.from("arena_comparisons").insert({
    prompt: "test",
    responses: { a: "b" },
    user_id: "00000000-0000-0000-0000-000000000000",
  });
  console.log("Insert without id:", e3?.message || "Unexpected success");

  // Check arena_comparisons columns
  console.log("\n=== Testing arena_comparisons all columns ===");
  const cols = [
    "id",
    "prompt",
    "responses",
    "winner",
    "created_at",
    "user_id",
    "model1",
    "model2",
    "response1",
    "response2",
    "notes",
    "tags",
  ];
  for (const col of cols) {
    const { error: e } = await supabase
      .from("arena_comparisons")
      .select(col)
      .limit(0);
    if (e) console.log(`  ${col}: MISSING (${e.message})`);
    else console.log(`  ${col}: OK`);
  }
}

inspect().catch(console.error);
