"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "@/components/AuthForm";
import Dashboard from "./dashboard/page";

// ==================== COMPONENTE LANDING ====================
function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/kimberlite-logo.png"
              alt="Kimberlite"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Kimberlite
            </span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-8 py-3 text-sm font-medium text-white gemstone-gradient rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/images/kimberlite-logo.png"
              alt="Kimberlite"
              className="h-12 w-auto"
            />
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
              Kimberlite
            </h1>
          </div>
          <p className="text-2xl md:text-3xl font-light text-zinc-700 dark:text-zinc-300">
            Your data,{" "}
            <span className="font-semibold">refined & resilient.</span>
          </p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The premier secure infrastructure for enterprise AI, built with
            diamond-hard security protocols and zero-knowledge architecture.
          </p>

          {/* Badges de seguridad */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <span className="px-4 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 rounded-full border border-blue-200/50 dark:border-blue-800/30">
              🔒 E2E Encrypted
            </span>
            <span className="px-4 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-full border border-emerald-200/50 dark:border-emerald-800/30">
              🛡️ Zero-Knowledge
            </span>
            <span className="px-4 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 rounded-full border border-purple-200/50 dark:border-purple-800/30">
              💎 Your Knowledge, Your Control
            </span>
          </div>

          {/* Botón CTA */}
          <div className="pt-4">
            <button
              onClick={onGetStarted}
              className="px-10 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Your Journey →
            </button>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="py-16 px-4 bg-white/50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Todo lo que necesitas para gestionar tu conocimiento
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Funcionalidades diseñadas para potenciar tu flujo de trabajo con
              IA
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📝",
                title: "Notas inteligentes",
                description:
                  "Guarda conversaciones completas con tus modelos de IA favoritos. Título, contenido, resumen y más.",
              },
              {
                icon: "📚",
                title: "Biblioteca de Prompts",
                description:
                  "Reutiliza tus mejores prompts con un solo clic. Organízalos por categorías y tags.",
              },
              {
                icon: "🌐",
                title: "Scraping de URLs",
                description:
                  "Pega una URL y ChatVault extrae automáticamente el título y el contenido de tu chat.",
              },
              {
                icon: "🏷️",
                title: "Etiquetas múltiples",
                description:
                  "Organiza tus notas y prompts con etiquetas. Búsqueda rápida y filtros inteligentes.",
              },
              {
                icon: "🔍",
                title: "Búsqueda avanzada",
                description:
                  "Encuentra cualquier nota o prompt por título, contenido, resumen o etiquetas.",
              },
              {
                icon: "🔒",
                title: "Seguridad y privacidad",
                description:
                  "Tus datos están protegidos con autenticación segura y RLS en Supabase.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Cómo funciona ChatVault
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Tres pasos para empezar a organizar tu conocimiento
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Regístrate",
                description:
                  "Crea tu cuenta en segundos con email y contraseña.",
              },
              {
                step: "2",
                title: "Guarda",
                description: "Añade notas, prompts o URLs de tus chats con IA.",
              },
              {
                step: "3",
                title: "Organiza",
                description:
                  "Usa etiquetas, categorías y filtros para tenerlo todo a mano.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO PLACEHOLDER */}
      <section className="py-16 px-4 bg-white/50 dark:bg-zinc-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            📹 Descubre ChatVault en acción
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Pronto disponible: un video explicativo con todas las
            funcionalidades.
          </p>
          <div className="relative aspect-video bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 rounded-2xl flex items-center justify-center border border-zinc-200/60 dark:border-zinc-800/60">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                Video explicativo
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Próximamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/images/kimberlite-logo.png"
              alt="Kimberlite"
              className="h-6 w-auto"
            />
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              Kimberlite
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Systems
            </span>
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} Kimberlite Systems. All rights
            reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <a
              href="#"
              className="hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              Security Audit
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================
export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600"></div>
      </div>
    );
  }

  // Si el usuario está logueado, mostrar el dashboard
  if (user) {
    return <Dashboard user={user} />;
  }

  // Si el usuario no está logueado y está en la landing
  if (showAuth) {
    return <AuthForm onAuth={() => setShowAuth(false)} />;
  }

  // Si no hay usuario y no está en el login, mostrar la landing
  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}
