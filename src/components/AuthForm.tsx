"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

interface AuthFormProps {
  onAuth: () => void;
}

export default function AuthForm({ onAuth }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        toast.success("Welcome back!");
        onAuth();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Account created! Welcome to Kimberlite.");
        onAuth();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RECUPERACIÓN DE CONTRASEÑA ====================
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (error) throw error;
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message);
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
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // ==================== OAuth GITHUB (placeholder) ====================
  const handleGitHubLogin = async () => {
    toast("GitHub login coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 p-4 relative overflow-hidden">
      {/* Patrón de fondo estilo Vault */}
      <div className="absolute inset-0 vault-pattern z-0" />

      {/* Blobs decorativos */}
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo - Protagonista absoluto */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center">
            <img
              src="/images/kimberlite-logo.png"
              alt="Kimberlite"
              className="h-20 w-auto md:h-24"
            />
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              {mode === "login" && (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleForgotPassword();
                  }}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  Forgot?
                </a>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-sm font-semibold text-white gemstone-gradient rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </div>
            ) : mode === "login" ? (
              "Enter Kimberlite"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Separador */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-500 dark:text-zinc-400">
              or access via
            </span>
          </div>
        </div>

        {/* Social login */}
        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-primary/30 transition-all duration-200"
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
            Continue with Google
          </button>
        </div>

        {/* Cambiar modo */}
        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {mode === "login" ? (
            <>
              New to Kimberlite?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
