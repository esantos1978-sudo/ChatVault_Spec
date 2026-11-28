"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { fontVariables } from "@/app/fonts";
import toast from "react-hot-toast";
import "@/app/dashboard-tokens.css";
import "./auth-form.css";

interface AuthFormProps {
  onAuth: () => void;
  /** Modo actual del formulario; lo dicta la URL (?auth=login | ?auth=register). */
  mode?: "login" | "register";
  /** Se muestra un enlace para volver a la landing cuando se provee. */
  onBack?: () => void;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Algo salió mal. Inténtalo de nuevo.";

/* Textos propios de cada modo. Además del título y el subtítulo, cambian el
   CTA y el bloque exclusivo para que el salto login ⇄ registro sea evidente. */
const MODE_CONTENT = {
  login: {
    eyebrow: "BIENVENIDO DE NUEVO",
    title: "Inicia sesión",
    subtitle: "Recupera tu biblioteca donde la dejaste.",
    cta: "Iniciar sesión",
    ctaPending: "Iniciando sesión...",
  },
  register: {
    eyebrow: "EMPIEZA EN 2 MINUTOS",
    title: "Crea tu cuenta",
    subtitle: "Tu segunda memoria para trabajar con IA. Sin tarjeta.",
    cta: "Crear mi biblioteca",
    ctaPending: "Creando cuenta...",
  },
} as const;

const REGISTER_BENEFITS = [
  "Prompts y notas ilimitados",
  "Skills para tus agentes de IA",
  "Arena: compara modelos lado a lado",
];

/* Códigos de error de Supabase/OAuth con un texto propio; el resto se muestra
   tal cual para poder diagnosticar la configuración del proveedor. */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Has cancelado el inicio de sesión con Google.",
  server_error: "Supabase no pudo completar el inicio de sesión con Google.",
};

export default function AuthForm({
  onAuth,
  onBack,
  mode = "login",
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Copia exacta del modo dictado por la URL (?auth=login | ?auth=register).
  const copy = MODE_CONTENT[mode];

  // ==================== LOGIN / REGISTRO ====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("¡Bienvenido de nuevo!");
        onAuth();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("¡Cuenta creada! Bienvenido a Kimberlite.");
        onAuth();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ==================== RECUPERACIÓN DE CONTRASEÑA ====================
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Introduce tu correo electrónico primero.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (error) throw error;
      toast.success(
        "Correo de recuperación enviado. Revisa tu bandeja de entrada.",
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ==================== OAuth GOOGLE ====================
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ==================== OAuth GITHUB (placeholder) ====================
  const handleGitHubLogin = async () => {
    toast("Inicio de sesión con GitHub próximamente.");
  };

  // ==================== ERRORES DEVUELTOS POR SUPABASE ====================
  // El callback de OAuth/recuperación vuelve aquí con ?error=... para que el
  // fallo sea visible en lugar de rebotar al login sin explicación.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("error_code") || params.get("error");
    const description = params.get("error_description");
    if (!code && !description) return;

    toast.error(
      (code && AUTH_ERROR_MESSAGES[code]) ||
        description ||
        code ||
        "No se pudo completar el inicio de sesión.",
    );

    // Se limpia el error de la URL para que recargar no repita el aviso.
    params.delete("error");
    params.delete("error_code");
    params.delete("error_description");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  }, []);

  return (
    <div
      className={`kl-dash ${fontVariables} min-h-screen flex items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Blobs decorativos */}
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[120px]" />
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[120px]" />

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--kld-on-surface-variant)] hover:bg-[var(--kld-surface-container)] hover:text-[var(--kld-on-surface)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kld-secondary)]"
        >
          <span aria-hidden="true" className="text-base leading-none">
            ←
          </span>
          Volver al inicio
        </button>
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <Image
              src="/images/kimberlite-logo.png"
              alt="Kimberlite"
              width={264}
              height={96}
              className="h-20 w-auto md:h-24"
            />
          </div>
        </div>

        {/* Cabecera propia por modo. La key remonta el bloque al cambiar para
            relanzar la micro-transición (fade + slide vertical). */}
        <header key={mode} className="kl-auth-swap text-center">
          <p className="kl-eyebrow">{copy.eyebrow}</p>
          <h1 className="kl-modal-title mt-2 text-2xl tracking-tight sm:text-3xl">
            {copy.title}
          </h1>
          <p className="kl-text-muted mt-2 text-sm leading-relaxed">
            {copy.subtitle}
          </p>
        </header>

        {/* Conmutador login/registro. La URL sigue siendo la fuente de verdad:
            cada opción es un enlace a /?auth=... con aria-current en el activo. */}
        <nav
          aria-label="Elegir entre iniciar sesión y crear cuenta"
          className="kl-auth-segment mt-6"
          data-mode={mode}
        >
          <span className="kl-auth-segment__thumb" aria-hidden="true" />
          <Link
            href="/?auth=login"
            aria-current={mode === "login" ? "page" : undefined}
            className={`kl-segment kl-auth-segment__option${
              mode === "login" ? " kl-segment--active" : ""
            }`}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/?auth=register"
            aria-current={mode === "register" ? "page" : undefined}
            className={`kl-segment kl-auth-segment__option${
              mode === "register" ? " kl-segment--active" : ""
            }`}
          >
            Crear cuenta
          </Link>
        </nav>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="auth-email"
              className="kl-text-muted block text-xs font-medium mb-1.5"
            >
              Correo electrónico
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@empresa.com"
              className="kl-input"
              required
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="kl-text-muted block text-xs font-medium mb-1.5"
            >
              Contraseña
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="kl-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="kl-btn kl-btn--primary kl-btn--block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kld-secondary)]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {copy.ctaPending}
              </span>
            ) : (
              <>
                {copy.cta}
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </form>

        {/* Separador */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[rgba(73,68,84,0.45)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide">
            <span className="kl-text-muted bg-[var(--kld-surface)] px-3">
              o accede con
            </span>
          </div>
        </div>

        {/* Social login */}
        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            aria-label="Continuar con Google"
            className="flex items-center justify-center gap-2 rounded-lg border border-[rgba(73,68,84,0.45)] bg-[var(--kld-surface-low)] px-4 h-[44px] text-sm font-medium text-[var(--kld-on-surface-variant)] hover:bg-[var(--kld-surface-container)] hover:border-[rgba(73,68,84,0.6)] transition-all duration-180 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kld-secondary)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar con Google
          </button>
        </div>

        {/* Bloque exclusivo por modo. La altura está reservada en común
            (.kl-auth-exclusive) para que alternar no mueva el formulario. */}
        <div className="kl-auth-exclusive">
          <div key={mode} className="kl-auth-swap kl-auth-panel">
            {mode === "register" ? (
              <ul className="kl-auth-benefits">
                {REGISTER_BENEFITS.map((benefit) => (
                  <li key={benefit}>
                    <span className="kl-auth-check" aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3.5 8.5 6.5 11.5 12.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="kl-auth-recovery">
                <span className="kl-eyebrow kl-eyebrow--muted kl-eyebrow--xs">
                  Recuperar acceso
                </span>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="kl-auth-recovery__link"
                >
                  ¿Has olvidado tu contraseña?
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cambiar modo */}
        <p className="kl-text-muted mt-6 text-center text-sm">
          {mode === "login" ? (
            <>
              ¿Nuevo en Kimberlite?{" "}
              <Link
                href="/?auth=register"
                className="font-semibold text-[var(--kld-primary)] transition-colors hover:text-[#e9ddff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kld-secondary)]"
              >
                Crear cuenta
              </Link>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/?auth=login"
                className="font-semibold text-[var(--kld-primary)] transition-colors hover:text-[#e9ddff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kld-secondary)]"
              >
                Iniciar sesión
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
