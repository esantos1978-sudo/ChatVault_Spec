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
              className="h-8 w-auto"
            />
          </div>
          <button
            onClick={onGetStarted}
            className="px-4 py-1.5 text-sm font-medium text-white gemstone-gradient rounded-lg transition-all duration-200 hover:brightness-110 active:brightness-95"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-14">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-24 lg:py-32">
          {/* Texto */}
          <div className="space-y-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              Workspace for AI conversations
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-zinc-50">
              Organiza todas tus conversaciones con IA en un solo lugar.
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-lg">
              Guarda, clasifica, reutiliza y encuentra cualquier conversación en
              segundos.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="px-6 py-3 text-sm font-semibold text-white gemstone-gradient rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 transition-all duration-200"
              >
                Empezar gratis
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
                Ver demo
              </button>
            </div>
          </div>

          {/* Preview del Dashboard */}
          <div className="hidden lg:block animate-fade-in-up">
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
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-zinc-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                ),
                title: "Organiza conversaciones",
                description:
                  "Guarda y clasifica todos tus chats con IA. Cada conversación importante siempre accesible.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-zinc-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                ),
                title: "Encuentra cualquier idea",
                description:
                  "Búsqueda instantánea por título, contenido, resumen o etiquetas. Encuentra lo que necesitas al instante.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-zinc-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                    />
                  </svg>
                ),
                title: "Compara modelos",
                description:
                  "Prueba diferentes modelos lado a lado. Elige el mejor para cada tarea con datos objetivos.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-zinc-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                ),
                title: "Reutiliza prompts",
                description:
                  "Tu biblioteca de prompts siempre lista. Un clic para usar tus mejores instrucciones una y otra vez.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-lg bg-zinc-900 border border-zinc-800/40 p-5 hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all duration-200"
              >
                <div className="mb-3">{feature.icon}</div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  {feature.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
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
