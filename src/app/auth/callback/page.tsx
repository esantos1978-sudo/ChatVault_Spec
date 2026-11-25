"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/**
 * Retorno de los enlaces de Supabase (OAuth de Google y recuperación de
 * contraseña).
 *
 * El cliente de este proyecto guarda la sesión en el navegador (localStorage),
 * así que el intercambio del `code` por una sesión tiene que ocurrir aquí: el
 * verificador PKCE vive en el navegador y un Route Handler del servidor no
 * puede leerlo. Si se intentaba canjear en el servidor, el intercambio fallaba,
 * se volvía a /dashboard sin sesión y el usuario acababa de nuevo en el login.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Tras unos segundos sin redirección se ofrece una salida manual.
    const timeout = setTimeout(() => {
      if (!cancelled) setSlow(true);
    }, 8000);

    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      // El `type` puede llegar en el hash cuando Supabase usa el flujo implicit.
      const hashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, ""),
      );
      const code = params.get("code");
      const type = params.get("type") || hashParams.get("type");
      const isRecovery = type === "recovery";
      const redirectError =
        params.get("error_description") ||
        params.get("error_code") ||
        params.get("error");

      const next = isRecovery ? "/auth/reset-password" : "/dashboard";

      // Se conservan `error_code` y `error_description` para que AuthForm pueda
      // mostrar el texto en español de los códigos conocidos.
      const fail = (
        message: string,
        extra?: { error_code?: string | null; error_description?: string | null },
      ) => {
        if (cancelled) return;
        const query = new URLSearchParams({ auth: "login", error: message });
        if (extra?.error_code) query.set("error_code", extra.error_code);
        if (extra?.error_description)
          query.set("error_description", extra.error_description);
        router.replace(`/?${query.toString()}`);
      };

      // Supabase devuelve el motivo del fallo en la propia redirección
      // (por ejemplo un redirect_uri no autorizado o un proveedor desactivado).
      if (redirectError) {
        fail(redirectError, {
          error_code: params.get("error_code"),
          error_description: params.get("error_description"),
        });
        return;
      }

      try {
        // Al inicializarse, el cliente canjea el `code` de la URL si el
        // verificador PKCE sigue en el navegador.
        let {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session && code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            fail(error.message);
            return;
          }
          session = (await supabase.auth.getSession()).data.session;
        }

        if (cancelled) return;

        if (session) {
          router.replace(next);
        } else {
          fail(
            isRecovery
              ? "No se pudo restablecer la contraseña. Solicita un enlace nuevo."
              : "No se pudo completar el inicio de sesión. Inténtalo de nuevo.",
          );
        }
      } catch (error) {
        fail(
          error instanceof Error
            ? error.message
            : "No se pudo completar el inicio de sesión.",
        );
      }
    };

    run();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md text-center space-y-4">
        {!slow ? (
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
            Completando el inicio de sesión...
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-400">
              Estamos tardando más de lo esperado en completar el inicio de
              sesión.
            </p>
            <Link
              href="/?auth=login"
              className="inline-block text-sm font-semibold text-violet-500 hover:text-violet-400 transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
