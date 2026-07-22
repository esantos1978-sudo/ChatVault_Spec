"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "@/components/AuthForm";

const Dashboard = dynamic(() => import("./dashboard/page"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-violet-500"></div>
    </div>
  ),
});

// ==================== COMPONENTE LANDING ====================
function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/images/kimberlite-logo.png"
              alt="Kimberlite"
              className="h-10 sm:h-12 w-auto"
            />
          </div>
          <button
            onClick={onGetStarted}
            aria-label="Acceder a Kimberlite"
            className="px-4 py-2 text-sm font-medium text-white gemstone-gradient rounded-lg transition-all duration-200 hover:brightness-110 active:brightness-95 min-h-[44px] flex items-center"
          >
            Acceder
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center py-16 md:py-24 lg:py-32">
          {/* Texto */}
          <div className="flex flex-col gap-8 md:gap-10 animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              La memoria para tu trabajo con IA
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-[1.1] text-zinc-50 max-w-3xl mb-2">
              Convierte tus conversaciones con IA en una biblioteca de
              conocimiento.
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-md">
              Guarda, organiza y reutiliza todo lo que aprendes con la IA. Desde
              tus mejores prompts hasta comparaciones entre modelos, todo queda
              conectado para que nunca vuelvas a empezar desde cero.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
              <button
                onClick={onGetStarted}
                aria-label="Crear mi biblioteca de conocimiento"
                className="px-6 py-3 text-sm font-semibold text-white gemstone-gradient rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 transition-all duration-200 min-h-[44px] flex items-center justify-center"
              >
                Crear mi biblioteca
              </button>
              <button
                onClick={() => {
                  const demoSection = document.getElementById("demo-section");
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                aria-label="Ver demostración de Kimberlite"
                className="px-6 py-3 text-sm font-semibold rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-300 hover:border-zinc-700 transition-all duration-200 min-h-[44px] flex items-center justify-center"
              >
                ▶ Ver demo
              </button>
            </div>

            {/* Micro beneficios */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4">
              {[
                "Nunca pierdas un buen prompt",
                "Encuentra cualquier idea en segundo",
                "Compara respuestas entre modelos",
                "Construye tu biblioteca de conocimiento",
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
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-sm uppercase tracking-wider text-zinc-500 font-medium mb-8">
            Todo lo que necesitas para trabajar mejor con IA. Kimberlite
            organiza todo el conocimiento que generas para que puedas
            reutilizarlo una y otra vez
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "description",
                title: "No vuelvas a perder una buena conversación.",
                description:
                  "Convierte cualquier chat en una nota reutilizable y recupérala cuando la necesites.",
              },
              {
                icon: "search",
                title: "Todo conectado en un único lugar.",
                description:
                  "Prompts, notas y comparaciones dejan de estar dispersos y pasan a formar parte de tu biblioteca.",
              },
              {
                icon: "compare_arrows",
                title: "Descubre qué modelo responde mejor.",
                description:
                  "Enfrenta varias respuestas y conserva solo la mejor.",
              },
              {
                icon: "auto_awesome",
                title: "Aprovecha lo que ya has aprendido.",
                description:
                  "Cada conversación aumenta el valor de tu biblioteca de conocimiento.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-xl bg-zinc-900 border border-zinc-800/40 p-6 sm:p-8 hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all duration-200 flex flex-col"
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
        className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50">
              Tu segunda memoria para trabajar con IA. Encuentra cualquier
              conversación, prompt o comparación en segundos gracias a una
              biblioteca diseñada para reutilizar conocimiento.
            </h2>
            <p className="text-zinc-500 text-center max-w-xl mx-auto mt-3 text-sm sm:text-base">
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
      <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50 text-center mb-12 md:mb-16">
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
                title: "Guarda un Prompt",
                description: "Todo empieza con una buena instrucción.",
              },
              {
                number: "02",
                title: "Convierte la conversación en una Nota",
                description: "Conserva lo importante y añade contexto.",
              },
              {
                number: "03",
                title: "Compárala en Arena",
                description:
                  "Descubre qué modelo ofrece la mejor respuesta y guarda el resultado.",
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
