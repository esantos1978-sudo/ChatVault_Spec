"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "@/components/AuthForm";
import LandingPage from "@/components/landing/LandingPage";

export type AuthMode = "login" | "register";

/* Pantalla de salida mientras se redirige al dashboard a un usuario que ya
   tiene sesión. La vista pública NO depende de este estado: el primer render
   coincide siempre con el HTML del servidor. */
function RedirectScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-violet-500"></div>
    </div>
  );
}

interface HomeViewProps {
  /** Modo dictado por la URL (?auth=login | ?auth=register) y resuelto en el
      servidor, para que la primera pintura ya sea la vista correcta. */
  authMode: AuthMode | null;
}

// ==================== COMPONENTE PRINCIPAL ====================
export default function HomeView({ authMode }: HomeViewProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
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
    if (user && authMode) {
      router.replace("/dashboard");
    }
  }, [authMode, router, user]);

  // Al entrar al formulario desde una sección baja de la landing, aseguramos
  // que la vista empiece arriba. La landing (authMode null) no se toca para
  // no romper la restauración de scroll del botón atrás.
  useEffect(() => {
    if (authMode) window.scrollTo(0, 0);
  }, [authMode]);

  // Solo el caso "ya hay sesión y estamos en una vista de auth" espera: es el
  // tránsito al dashboard. Todo lo demás se pinta al instante.
  if (authMode && user) {
    return <RedirectScreen />;
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
