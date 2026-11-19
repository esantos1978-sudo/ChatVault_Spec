"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "@/components/AuthForm";
import LandingPage from "@/components/landing/LandingPage";

type AuthMode = "login" | "register";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-violet-500"></div>
    </div>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // La URL es la única fuente de verdad del modo de autenticación:
  //   /                  → landing
  //   /?auth=login       → formulario de inicio de sesión
  //   /?auth=register    → formulario de registro
  const authParam = searchParams.get("auth");
  const authMode: AuthMode | null =
    authParam === "login" || authParam === "register" ? authParam : null;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Con sesión activa las vistas de auth no tienen sentido: al dashboard.
  // Se usa replace para no dejar el formulario en el historial.
  useEffect(() => {
    if (!loading && user && authMode) {
      router.replace("/dashboard");
    }
  }, [authMode, loading, router, user]);

  // Al entrar al formulario desde una sección baja de la landing, aseguramos
  // que la vista empiece arriba. La landing (authMode null) no se toca para
  // no romper la restauración de scroll del botón atrás.
  useEffect(() => {
    if (authMode) window.scrollTo(0, 0);
  }, [authMode]);

  if (loading || (user && authMode)) {
    return <LoadingScreen />;
  }

  // Vista de inicio de sesión / registro
  if (authMode) {
    return (
      <AuthForm
        mode={authMode}
        onAuth={() => router.replace("/dashboard")}
        onBack={() => router.push("/")}
      />
    );
  }

  // Landing pública (también para usuarios con sesión: el back desde el
  // dashboard debe caer aquí, no dentro del dashboard).
  return <LandingPage />;
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomeContent />
    </Suspense>
  );
}
