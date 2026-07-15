import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ashuzirbhyuojnqdmitn.supabase.co";
const supabaseAnonKey = "sb_publishable_4-JtYXA03z8zXSIWoYjSJA_tnmw4usC";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  console.log("=== Testing prompts all columns ===");
  const cols = [
    "id",
    "title",
    "content",
    "category",
    "tags",
    "times_used",
    "created_at",
    "is_favorite",
    "user_id",
    "updated_at",
    "description",
    "is_public",
    "slug",
    "version",
  ];
  for (const col of cols) {
    const { error: e } = await supabase.from("prompts").select(col).limit(0);
    if (e) console.log(`  ${col}: MISSING (${e.message})`);
    else console.log(`  ${col}: OK`);
  }

  console.log("\n=== Testing notes all columns ===");
  const notesCols = [
    "id",
    "title",
    "content",
    "tags",
    "ai_model",
    "source_type",
    "source_url",
    "created_at",
    "is_favorite",
    "user_id",
    "prompt_id",
    "updated_at",
    "summary",
  ];
  for (const col of notesCols) {
    const { error: e } = await supabase.from("notes").select(col).limit(0);
    if (e) console.log(`  ${col}: MISSING (${e.message})`);
    else console.log(`  ${col}: OK`);
  }
}

inspect().catch(console.error);
