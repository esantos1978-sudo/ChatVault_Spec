import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "@/app/fonts";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
  LEGAL_LAST_UPDATED_ISO,
} from "@/lib/legal";
import "@/app/dashboard-tokens.css";

/* ==========================================================================
   Kimberlite — Términos de Servicio (/terminos)
   --------------------------------------------------------------------------
   Documento estático (Server Component): sin Supabase, sin estado y sin
   lógica de cliente. Google exige la política de privacidad pública; los
   términos se enlazan junto a ella desde el footer de la landing.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Términos de Servicio — Kimberlite",
  description:
    "Condiciones de uso de Kimberlite: cuenta, uso aceptable, propiedad de tu contenido, disponibilidad y limitación de responsabilidad.",
};

// Clases del documento: mismo lenguaje visual que /privacidad y el dashboard.
const sectionTitleClass = "kl-modal-title text-lg";
const textClass =
  "mt-3 text-[15px] leading-relaxed text-[var(--kld-on-surface-variant)]";
const listClass =
  "mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--kld-on-surface-variant)] marker:text-[var(--kld-primary)]";
const strongClass = "font-semibold text-[var(--kld-on-surface)]";
const linkClass =
  "text-[var(--kld-primary)] underline underline-offset-4 transition-colors hover:text-[var(--kld-on-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--kld-secondary)]";
const dividerClass = "kl-divider border-0";
const contactHref = `mailto:${LEGAL_CONTACT_EMAIL}`;

export default function TerminosPage() {
  return (
    <main className={`kl-dash min-h-screen ${fontVariables}`}>
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="kl-btn kl-btn--sm kl-btn--ghost -ml-3 mb-10"
        >
          <span
            className="material-symbols-outlined text-[16px]"
            aria-hidden="true"
          >
            arrow_back
          </span>
          Volver al inicio
        </Link>

        <article aria-labelledby="terminos-titulo">
          <header>
            <p className="kl-eyebrow">
              Última actualización:{" "}
              <time dateTime={LEGAL_LAST_UPDATED_ISO}>
                {LEGAL_LAST_UPDATED}
              </time>
            </p>
            <h1
              id="terminos-titulo"
              className="kl-modal-title mt-3 text-3xl tracking-tight sm:text-4xl"
            >
              Términos de Servicio
            </h1>
            <p className={textClass}>
              Estas condiciones resumen las reglas de uso de Kimberlite: qué
              ofrece el servicio, qué esperamos de tu cuenta y qué límites
              aplican.
            </p>
          </header>

          <hr className={`${dividerClass} mt-10`} />

          <div className="mt-10 space-y-10">
            <section aria-labelledby="descripcion">
              <h2 id="descripcion" className={sectionTitleClass}>
                1. Descripción del servicio
              </h2>
              <p className={textClass}>
                Kimberlite es una biblioteca personal para organizar prompts,
                notas, skills (instrucciones para agentes de IA) y comparaciones
                entre modelos.
              </p>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="cuenta">
              <h2 id="cuenta" className={sectionTitleClass}>
                2. Cuenta
              </h2>
              <p className={textClass}>
                Eres responsable de custodiar tus credenciales y de que el
                contenido que subas sea lícito y de tu autoría o uso permitido.
              </p>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="uso-aceptable">
              <h2 id="uso-aceptable" className={sectionTitleClass}>
                3. Uso aceptable
              </h2>
              <p className={textClass}>
                Queda prohibido usar el servicio para alojar contenido ilegal,
                malicioso o que infrinja derechos de terceros.
              </p>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="propiedad">
              <h2 id="propiedad" className={sectionTitleClass}>
                4. Propiedad
              </h2>
              <ul className={listClass}>
                <li>
                  <strong className={strongClass}>Tu contenido es tuyo:</strong>{" "}
                  no adquirimos ningún derecho de propiedad sobre él.
                </li>
                <li>
                  <strong className={strongClass}>Sólo lo usamos aquí:</strong>{" "}
                  nos autorizas únicamente a almacenarlo y mostrarlo para
                  prestarte el servicio.
                </li>
              </ul>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="disponibilidad">
              <h2 id="disponibilidad" className={sectionTitleClass}>
                5. Disponibilidad
              </h2>
              <p className={textClass}>
                El servicio se ofrece «tal cual», sin garantía de disponibilidad
                ininterrumpida ni de conservación indefinida de los datos.
              </p>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="responsabilidad">
              <h2 id="responsabilidad" className={sectionTitleClass}>
                6. Limitación de responsabilidad
              </h2>
              <p className={textClass}>
                En la medida permitida por la ley, Kimberlite no será
                responsable por daños indirectos derivados del uso del servicio.
              </p>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="contacto">
              <h2 id="contacto" className={sectionTitleClass}>
                7. Contacto
              </h2>
              <p className={textClass}>
                Para cualquier cuestión sobre estos términos, escribe a{" "}
                <a href={contactHref} className={linkClass}>
                  {LEGAL_CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

          </div>

          <footer className="mt-14">
            <hr className={dividerClass} />
            <div className="pt-6 text-sm leading-relaxed text-[var(--kld-outline)]">
              <p>
                Para cualquier cuestión sobre estas condiciones, escribe a{" "}
                <a href={contactHref} className={linkClass}>
                  {LEGAL_CONTACT_EMAIL}
                </a>
                .
              </p>
              <p className="mt-2">
                Consulta también la{" "}
                <Link href="/privacidad" className={linkClass}>
                  Política de Privacidad
                </Link>
                .
              </p>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
