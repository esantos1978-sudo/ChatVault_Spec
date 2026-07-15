import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ashuzirbhyuojnqdmitn.supabase.co";
const supabaseAnonKey = "sb_publishable_4-JtYXA03z8zXSIWoYjSJA_tnmw4usC";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  // Test UPDATE/DELETE more carefully
  // The previous test might have returned "success" because the WHERE matched 0 rows
  // Let's try with a non-existent UUID to confirm

  console.log("=== Test UPDATE on prompts (no auth, non-existent UUID) ===");
  const { data: u1, error: e1 } = await supabase
    .from("prompts")
    .update({ title: "hacked" })
    .eq("id", "00000000-0000-0000-0000-000000000000")
    .select();
  console.log("Data:", u1, "Error:", e1?.message || "none");

  console.log("\n=== Test DELETE on prompts (no auth, non-existent UUID) ===");
  const { data: d1, error: e2 } = await supabase
    .from("prompts")
    .delete()
    .eq("id", "00000000-0000-0000-0000-000000000000")
    .select();
  console.log("Data:", d1, "Error:", e2?.message || "none");

  // Test UPDATE/DELETE on arena_comparisons
  console.log("\n=== Test UPDATE on arena (no auth, non-existent UUID) ===");
  const { data: u2, error: e3 } = await supabase
    .from("arena_comparisons")
    .update({ prompt: "hacked" })
    .eq("id", 999999)
    .select();
  console.log("Data:", u2, "Error:", e3?.message || "none");

  console.log("\n=== Test DELETE on arena (no auth, non-existent UUID) ===");
  const { data: d2, error: e4 } = await supabase
    .from("arena_comparisons")
    .delete()
    .eq("id", 999999)
    .select();
  console.log("Data:", d2, "Error:", e4?.message || "none");

  // Test UPDATE/DELETE on notes (should be blocked by RLS)
  console.log("\n=== Test UPDATE on notes (no auth, non-existent id) ===");
  const { data: u3, error: e5 } = await supabase
    .from("notes")
    .update({ title: "hacked" })
    .eq("id", 999999)
    .select();
  console.log("Data:", u3, "Error:", e5?.message || "none");

  console.log("\n=== Test DELETE on notes (no auth, non-existent id) ===");
  const { data: d3, error: e6 } = await supabase
    .from("notes")
    .delete()
    .eq("id", 999999)
    .select();
  console.log("Data:", d3, "Error:", e6?.message || "none");

  // Now let's also check if SELECT returns empty because of RLS or no data
  // by trying to select with a specific non-existent UUID
  console.log("\n=== Test SELECT prompts with non-existent UUID ===");
  const { data: s1, error: e7 } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", "00000000-0000-0000-0000-000000000000");
  console.log("Data:", s1, "Error:", e7?.message || "none");

  // Test if we can see other users' data by selecting without filter
  // If RLS is working, this should return 0 rows (no auth user)
  console.log("\n=== Test SELECT all prompts (no auth) ===");
  const { data: s2, error: e8 } = await supabase.from("prompts").select("*");
  console.log("Count:", s2?.length, "Error:", e8?.message || "none");
}

inspect().catch(console.error);
