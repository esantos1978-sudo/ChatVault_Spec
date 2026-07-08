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
            <span className="text-2xl">🔒</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              ChatVault
            </span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
          >
            Comenzar
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-medium mb-6 border border-blue-200/50 dark:border-blue-800/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Organiza tu conocimiento con IA
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Guarda, organiza y reutiliza
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              tus conversaciones con IA
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
            ChatVault es tu baúl de conocimiento. Guarda chats, prompts y
            recursos de tus modelos de IA favoritos. Todo organizado, etiquetado
            y listo para reutilizar.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center gap-2"
            >
              Regístrate gratis 🚀
            </button>
            <button className="px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
              Ver demo
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
            <span className="text-xl">🔒</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              ChatVault
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <a
              href="#"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Términos
            </a>
            <a
              href="#"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Privacidad
            </a>
            <a
              href="#"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Contacto
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
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              🔒 ChatVault
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Inicia sesión para acceder a tu baúl de conocimiento
            </p>
          </div>
          <AuthForm onAuth={() => setShowAuth(false)} />
          <button
            onClick={() => setShowAuth(false)}
            className="mt-4 w-full text-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            ← Volver a la landing
          </button>
        </div>
      </div>
    );
  }

  // Si no hay usuario y no está en el login, mostrar la landing
  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}
