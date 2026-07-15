import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ashuzirbhyuojnqdmitn.supabase.co";
const supabaseAnonKey = "sb_publishable_4-JtYXA03z8zXSIWoYjSJA_tnmw4usC";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  // Test 1: Try to insert into prompts without auth (should fail if RLS is on)
  console.log("=== Test 1: Insert into prompts without auth ===");
  const { error: e1 } = await supabase.from("prompts").insert({
    title: "test",
    content: "test",
    category: "texto",
    user_id: "00000000-0000-0000-0000-000000000000",
  });
  console.log(
    "Result:",
    e1?.message || "Unexpected success (RLS might be OFF)",
  );

  // Test 2: Try to insert into arena_comparisons without auth
  console.log("\n=== Test 2: Insert into arena_comparisons without auth ===");
  const { error: e2 } = await supabase.from("arena_comparisons").insert({
    prompt: "test",
    responses: { model1: "a", response1: "b", model2: "c", response2: "d" },
    user_id: "00000000-0000-0000-0000-000000000000",
  });
  console.log(
    "Result:",
    e2?.message || "Unexpected success (RLS might be OFF)",
  );

  // Test 3: Try to select from prompts without auth
  console.log("\n=== Test 3: Select from prompts without auth ===");
  const { data: d3, error: e3 } = await supabase.from("prompts").select("*");
  console.log("Data:", d3?.length, "rows, Error:", e3?.message || "none");

  // Test 4: Try to select from arena_comparisons without auth
  console.log("\n=== Test 4: Select from arena_comparisons without auth ===");
  const { data: d4, error: e4 } = await supabase
    .from("arena_comparisons")
    .select("*");
  console.log("Data:", d4?.length, "rows, Error:", e4?.message || "none");

  // Test 5: Try to select from notes without auth
  console.log("\n=== Test 5: Select from notes without auth ===");
  const { data: d5, error: e5 } = await supabase.from("notes").select("*");
  console.log("Data:", d5?.length, "rows, Error:", e5?.message || "none");

  // Test 6: Try to update prompts without auth
  console.log("\n=== Test 6: Update prompts without auth ===");
  const { error: e6 } = await supabase
    .from("prompts")
    .update({ title: "hacked" })
    .eq("id", "00000000-0000-0000-0000-000000000000");
  console.log(
    "Result:",
    e6?.message || "Unexpected success (RLS might be OFF)",
  );

  // Test 7: Try to delete from prompts without auth
  console.log("\n=== Test 7: Delete from prompts without auth ===");
  const { error: e7 } = await supabase
    .from("prompts")
    .delete()
    .eq("id", "00000000-0000-0000-0000-000000000000");
  console.log(
    "Result:",
    e7?.message || "Unexpected success (RLS might be OFF)",
  );
}

inspect().catch(console.error);
