"use client";

import { Toaster } from "react-hot-toast";

import { fontVariables } from "@/app/fonts";

/* ==========================================================================
   Kimberlite — Toaster global con la piel del dashboard
   --------------------------------------------------------------------------
   react-hot-toast monta sus toasts en un portal colgado de <body>, es decir,
   FUERA de .kl-dash. Por eso el contenedor recibe:
   - .kl-portal   → resuelve --kld-font-* (ver dashboard-tokens.css).
   - fontVariables → clases de next/font que declaran --font-kl-* sobre el
                    propio contenedor, para que el portal herede Inter / Plus
                    Jakarta Sans / JetBrains Mono en lugar de la fuente base.
   La superficie (`.kl-toast`) y el icono de info (.kl-toast-icon) se pintan
   desde dashboard-tokens.css. Los colores de los iconos van en hex literal
   (mismos valores que los tokens) porque en las pantallas de auth el bundle
   del dashboard no se carga y `var(--kld-*)` no resolvería.

   No se tocan position/gutter/duration/reverseOrder: el comportamiento
   (tiempos, apilado y cierre) es exactamente el mismo de antes.
   ========================================================================== */

export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      containerClassName={`kl-portal ${fontVariables}`}
      toastOptions={{
        className: "kl-toast",
        success: {
          iconTheme: { primary: "#7bd0ff", secondary: "#0d0e13" },
        },
        error: {
          iconTheme: { primary: "#ffb4ab", secondary: "#2a1e20" },
        },
        loading: {
          iconTheme: { primary: "#d0bcff", secondary: "#d0bcff" },
        },
        blank: {
          // Estado informativo (p. ej. "GitHub próximamente").
          icon: (
            <span className="kl-toast-icon" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5" />
                <path d="M12 8h.01" />
              </svg>
            </span>
          ),
        },
      }}
    />
  );
}
