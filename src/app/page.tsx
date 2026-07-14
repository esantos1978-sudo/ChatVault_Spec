"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "@/components/AuthForm";
import Dashboard from "./dashboard/page";

// ==================== COMPONENTE LANDING ====================
function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/kimberlite-logo.png"
              alt="Kimberlite"
              className="h-12 w-auto"
            />
          </div>
          <button
            onClick={onGetStarted}
            className="px-4 py-1.5 text-sm font-medium text-white gemstone-gradient rounded-lg transition-all duration-200 hover:brightness-110 active:brightness-95"
          >
            Acceder
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-14">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-24 lg:py-32">
          {/* Texto */}
          <div className="flex flex-col gap-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              Organiza el conocimiento que generas con IA
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-zinc-50 max-w-3xl">
              Nunca vuelvas a perder una gran respuesta de la IA.
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-md">
              Convierte cada interacción con la IA en conocimiento que nunca
              volverás a perder. Guarda, organiza y reutiliza conversaciones,
              prompts y comparaciones entre modelos desde un único lugar.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="px-6 py-3 text-sm font-semibold text-white gemstone-gradient rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 transition-all duration-200"
              >
                Comenzar gratis
              </button>
              <button
                onClick={() => {
                  const demoSection = document.getElementById("demo-section");
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-6 py-3 text-sm font-semibold rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-300 hover:border-zinc-700 transition-all duration-200"
              >
                Ver cómo funciona
              </button>
            </div>

            {/* Micro beneficios */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              {[
                "Conversaciones",
                "Prompts",
                "Comparativas IA",
                "Todo organizado",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3.5 h-3.5 text-emerald-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Preview del Dashboard */}
          <div
            className="hidden lg:block animate-fade-in-up"
            style={{ animationDelay: "150ms" }}
          >
            <div className="rounded-xl bg-zinc-900 border border-zinc-800/40 shadow-premium aspect-[4/3] overflow-hidden relative">
              {/* Placeholder del dashboard */}
              <div className="absolute inset-0 p-4 flex flex-col gap-3">
                {/* Sidebar mock */}
                <div className="flex gap-3 h-full">
                  <div className="w-48 rounded-lg bg-zinc-900/80 border border-zinc-800/30 p-3 flex flex-col gap-2">
                    <div className="h-3 w-20 rounded bg-zinc-800/60" />
                    <div className="h-3 w-16 rounded bg-zinc-800/40" />
                    <div className="h-3 w-24 rounded bg-zinc-800/40" />
                    <div className="mt-auto h-3 w-14 rounded bg-zinc-800/40" />
                  </div>
                  {/* Content mock */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-32 rounded bg-zinc-800/60" />
                      <div className="h-6 w-20 rounded-lg bg-violet-500/20 border border-violet-500/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div className="rounded-lg bg-zinc-900/80 border border-zinc-800/30 p-3 flex flex-col gap-2">
                        <div className="h-3 w-24 rounded bg-zinc-800/60" />
                        <div className="h-2 w-full rounded bg-zinc-800/30" />
                        <div className="h-2 w-3/4 rounded bg-zinc-800/30" />
                        <div className="mt-auto flex gap-1">
                          <div className="h-4 w-10 rounded bg-zinc-800/40" />
                          <div className="h-4 w-12 rounded bg-zinc-800/40" />
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-900/80 border border-zinc-800/30 p-3 flex flex-col gap-2">
                        <div className="h-3 w-20 rounded bg-zinc-800/60" />
                        <div className="h-2 w-full rounded bg-zinc-800/30" />
                        <div className="h-2 w-2/3 rounded bg-zinc-800/30" />
                        <div className="mt-auto flex gap-1">
                          <div className="h-4 w-8 rounded bg-zinc-800/40" />
                          <div className="h-4 w-14 rounded bg-zinc-800/40" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Gradient sutil en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="pt-20 pb-36 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-sm uppercase tracking-wider text-zinc-500 font-medium mb-8">
            Todo lo que necesitas para trabajar con IA.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "description",
                title: "Organiza conversaciones",
                description:
                  "Guarda todo lo importante y recupéralo en segundos.",
              },
              {
                icon: "search",
                title: "Encuentra cualquier idea",
                description: "Busca por título, contenido o etiquetas.",
              },
              {
                icon: "compare_arrows",
                title: "Compara modelos",
                description: "Decide con datos cuál responde mejor.",
              },
              {
                icon: "auto_awesome",
                title: "Reutiliza prompts",
                description:
                  "Tu mejor biblioteca de prompts siempre disponible.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-xl bg-zinc-900 border border-zinc-800/40 p-8 hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all duration-200 flex flex-col"
              >
                <span className="material-symbols-outlined text-[24px] text-violet-400 mb-4">
                  {feature.icon}
                </span>
                <h3 className="text-sm font-semibold text-zinc-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTO */}
      <section
        id="demo-section"
        className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50">
              Todo tu conocimiento en un único lugar.
            </h2>
            <p className="text-zinc-500 text-center max-w-xl mx-auto mt-3 text-base">
              Tus conversaciones, prompts y comparaciones organizadas de forma
              inteligente.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/40 shadow-premium overflow-hidden aspect-video bg-zinc-900 relative">
            {/* Placeholder del dashboard completo */}
            <div className="absolute inset-0 p-6 flex flex-col gap-4">
              {/* Header mock */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded bg-zinc-800/60" />
                  <div className="h-4 w-24 rounded bg-zinc-800/60" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-32 rounded-lg bg-zinc-800/40" />
                  <div className="h-6 w-6 rounded-lg bg-zinc-800/40" />
                </div>
              </div>
              {/* Content grid mock */}
              <div className="flex gap-4 flex-1">
                <div className="w-56 rounded-lg bg-zinc-900/80 border border-zinc-800/30 p-3 flex flex-col gap-2">
                  <div className="h-3 w-16 rounded bg-zinc-800/60" />
                  <div className="h-3 w-20 rounded bg-zinc-800/40" />
                  <div className="h-3 w-14 rounded bg-zinc-800/40" />
                  <div className="mt-2 h-3 w-12 rounded bg-zinc-800/40" />
                  <div className="h-3 w-18 rounded bg-zinc-800/40" />
                </div>
                <div className="flex-1 grid grid-cols-3 gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-zinc-900/80 border border-zinc-800/30 p-3 flex flex-col gap-2"
                    >
                      <div className="h-3 w-20 rounded bg-zinc-800/60" />
                      <div className="h-2 w-full rounded bg-zinc-800/30" />
                      <div className="h-2 w-3/4 rounded bg-zinc-800/30" />
                      <div className="mt-auto flex gap-1">
                        <div className="h-4 w-10 rounded bg-zinc-800/40" />
                        <div className="h-4 w-8 rounded bg-zinc-800/40" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Gradient sutil */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent" />
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50 text-center mb-16">
            Cómo funciona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
            {/* Flechas entre pasos (solo desktop) */}
            <div className="hidden md:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] pointer-events-none">
              <div className="flex justify-between">
                <span className="text-zinc-800 text-2xl">→</span>
                <span className="text-zinc-800 text-2xl">→</span>
              </div>
            </div>

            {[
              {
                number: "01",
                title: "Importa conversaciones",
                description:
                  "Pega el contenido de tu chat, comparte un enlace o sube un archivo. Kimberlite lo organiza automáticamente.",
              },
              {
                number: "02",
                title: "Organízalas",
                description:
                  "Añade etiquetas, asigna un modelo y asocia prompts. Todo queda estructurado y listo para consultar.",
              },
              {
                number: "03",
                title: "Encuentra cualquier información al instante",
                description:
                  "Búsqueda avanzada por texto, etiquetas o modelo. Tu conocimiento siempre a un clic de distancia.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-semibold text-zinc-800">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mt-4">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Kimberlite AI
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <a href="#" className="hover:text-zinc-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-zinc-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-zinc-400 transition-colors">
              Contact
            </a>
          </div>

          <div className="text-xs text-zinc-600">
            Hecho con <span className="text-violet-500">💎</span>
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-violet-500"></div>
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
