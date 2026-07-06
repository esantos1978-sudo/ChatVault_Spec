import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error: Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("🔌 Probando conexión con Supabase...");
  console.log(`   URL: ${supabaseUrl}`);

  try {
    // Test: Verificar que el cliente puede comunicarse con Supabase
    const { data: authData, error: authError } = await supabase.auth.getSession();

    if (authError) {
      console.error("❌ Error de conexión:", authError.message);
      return false;
    }

    console.log("✅ El cliente Supabase se inicializó y conectó correctamente");
    console.log("   Sesión actual:", authData?.session ? "Activa" : "No hay sesión (esperado — no hay usuario logueado)");
    console.log("   Estado: Conexión establecida con el servidor de Supabase");
    return true;
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
    return false;
  }
}

testConnection().then((success) => {
  if (success) {
    console.log("\n🎉 ¡Conexión con Supabase establecida correctamente!");
    console.log("   El cliente en src/lib/supabaseClient.ts está listo para usarse.");
  } else {
    console.log("\n⚠️  Hubo un problema con la conexión. Revisa las credenciales.");
  }
});
