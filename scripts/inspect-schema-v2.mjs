const supabaseUrl = "https://ashuzirbhyuojnqdmitn.supabase.co";
const anonKey = "sb_publishable_4-JtYXA03z8zXSIWoYjSJA_tnmw4usC";

async function inspect() {
  const tables = ["prompts", "notes", "arena_comparisons"];

  for (const table of tables) {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?limit=0`, {
      method: "GET",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: "application/json",
        Prefer: "return=representation",
      },
    });

    const contentType = response.headers.get("content-type");
    const contentRange = response.headers.get("content-range");
    console.log(`\n=== ${table} ===`);
    console.log("Content-Type:", contentType);
    console.log("Content-Range:", contentRange);

    const text = await response.text();
    console.log("Body (first 500):", text.substring(0, 500));
  }
}

inspect().catch(console.error);
