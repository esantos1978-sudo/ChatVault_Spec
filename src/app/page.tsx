"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "@/components/AuthForm";
import LandingPage from "@/components/landing/LandingPage";

const Dashboard = dynamic(() => import("./dashboard/page"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-violet-500"></div>
    </div>
  ),
});

type AuthMode = "login" | "register";

// ==================== COMPONENTE PRINCIPAL ====================
export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-violet-500"></div>
      </div>
    );
  }

  // Si el usuario está logueado, mostrar el dashboard
  if (user) {
    return <Dashboard />;
  }

  // Si el usuario no está logueado y está en el login/registro
  if (authMode) {
    return (
      <AuthForm
        initialMode={authMode}
        onAuth={() => setAuthMode(null)}
        onBack={() => setAuthMode(null)}
      />
    );
  }

  // Si no hay usuario y no está en el login, mostrar la landing
  return (
    <LandingPage
      onStart={() => setAuthMode("register")}
      onLogin={() => setAuthMode("login")}
    />
  );
}
