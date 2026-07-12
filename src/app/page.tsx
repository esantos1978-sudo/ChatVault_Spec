"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "@/components/AuthForm";
import Dashboard from "./dashboard/page";

// ==================== COMPONENTE LANDING ====================
function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo - centrado visualmente */}
          <div className="flex items-center gap-2">
            <img
              src="/images/kimberlite-logo.png"
              alt="Kimberlite"
              className="h-10 w-auto"
            />
            {/* ❌ Texto eliminado */}
          </div>
          <button
            onClick={onGetStarted}
            className="px-4 py-2 text-sm font-medium text-white gemstone-gradient rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO - MÁS COMPACTO */}
      <section className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Logo + Eslogan */}
          <div className="flex flex-col items-center justify-center gap-2">
            <img
              src="/images/kimberlite-logo.png"
              alt="Kimberlite"
              className="h-16 w-auto md:h-20"
            />
            <p className="text-lg md:text-xl font-light tracking-wide text-zinc-700 dark:text-zinc-300">
              The rock{" "}
              <span className="font-semibold text-primary">where diamonds</span>{" "}
              are.
            </p>
          </div>

          {/* Subtítulo */}
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Organiza tus conversaciones con IA, reutiliza tus mejores prompts y
            compara modelos en un solo lugar. Seguro, privado y diseñado para
            ti.
          </p>

          {/* Botones CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 text-sm font-semibold text-white gemstone-gradient rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                const demoSection = document.getElementById("demo-section");
                if (demoSection) {
                  demoSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-6 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* SUBSECCIONES: Funcionalidades clave (justo después del hero) */}
      <section
        id="demo-section"
        className="py-8 px-4 bg-white/50 dark:bg-zinc-900/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                icon: "⚔️",
                title: "Arena de LLMs",
                description:
                  "Compara respuestas de diferentes modelos lado a lado. Vota y elige al ganador.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-primary transition-colors">
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
      {/* ENTERPRISE GRADE */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full border border-primary/20">
              Enterprise Grade
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                Extracción refinada de{" "}
                <span className="text-primary">conocimiento</span>.
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Kimberlite no es solo una base de datos; es el entorno donde tus
                ideas crudas se convierten en diamantes. Nuestra arquitectura de
                seguridad y diseño centrado en el usuario garantizan que cada
                interacción sea rápida, privada y brillante.
              </p>
              <ul className="space-y-3">
                {[
                  "🔒 Encripción de extremo a extremo",
                  "📱 Sincronización multi-dispositivo",
                  "🤖 Integración con GPT-4, Claude y más",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="text-primary">{item.split(" ")[0]}</span>
                    <span>{item.split(" ").slice(1).join(" ")}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center">
                <span className="text-8xl opacity-20">💎</span>
              </div>
            </div>
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
          {/* Logo + año */}
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} Kimberlite AI. The rock where diamonds
            are.
          </div>

          {/* Enlaces */}
          <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact
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
