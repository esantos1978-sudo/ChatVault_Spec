import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

/* ==========================================================================
   Kimberlite — tipografía compartida (mismas familias que la landing)
   --------------------------------------------------------------------------
   Vive en su propio módulo para que dashboard y settings compartan LA MISMA
   instancia de next/font: una sola descarga de cada familia y las mismas
   variables CSS (--font-kl-*) que consumen los tokens --kld-font-*.
   ========================================================================== */

export const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-kl-body",
  display: "swap",
});

export const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-kl-display",
  display: "swap",
});

export const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-kl-mono",
  display: "swap",
});

/** Clases de variable para aplicar sobre el contenedor (`.kl-dash`). */
export const fontVariables = [
  displayFont.variable,
  bodyFont.variable,
  monoFont.variable,
].join(" ");
