const supabaseUrl = "https://ashuzirbhyuojnqdmitn.supabase.co";
const anonKey = "sb_publishable_4-JtYXA03z8zXSIWoYjSJA_tnmw4usC";

async function inspect() {
  // Try to get the schema via the REST API with the OpenAPI spec
  // The Supabase REST API exposes schema info via the root endpoint with Accept: application/vnd.pgrst.schema+json
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: "GET",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: "application/vnd.pgrst.schema+json",
    },
  });

  console.log("Status:", response.status);
  const text = await response.text();
  console.log("Response:", text.substring(0, 10000));
}

inspect().catch(console.error);
