import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error: Faltan variables de entorno");
  process.exit(1);
}

const sql = readFileSync("supabase/migrations/00001_create_notes_table.sql", "utf8");

console.log("📦 Ejecutando migración: Crear tabla notes con RLS...\n");

// Intentar ejecutar SQL vía la API SQL de Supabase (requiere service_role key)
// Como solo tenemos anon key, intentamos con el endpoint de management
const response = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/rest/v1/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "apikey": supabaseAnonKey,
    "Authorization": `Bearer ${supabaseAnonKey}`,
    "Prefer": "params=single-object",
  },
  body: JSON.stringify({ query: sql }),
});

const text = await response.text();
console.log(`Status: ${response.status}`);
console.log(`Respuesta: ${text}`);

if (response.ok) {
  console.log("\n✅ Migración ejecutada exitosamente");
} else {
  console.log("\n⚠️  No se pudo ejecutar la migración vía API REST.");
  console.log("   Esto es normal — se necesita la service_role key para DDL.");
  console.log("\n📋 Instrucciones:");
  console.log("   1. Ve a https://supabase.com/dashboard/project/ashuzirbhyuojnqdmitn");
  console.log("   2. Abre el SQL Editor");
  console.log("   3. Copia y pega el contenido de: supabase/migrations/00001_create_notes_table.sql");
  console.log("   4. Ejecuta el script");
}
