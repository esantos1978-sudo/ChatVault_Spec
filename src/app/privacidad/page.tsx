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
   Kimberlite — Política de Privacidad (/privacidad)
   --------------------------------------------------------------------------
   Documento estático (Server Component): sin Supabase, sin estado y sin
   lógica de cliente, para que la URL sea pública incluso sin sesión.
   El texto vive aquí para revisarlo sin tocar estilos ni rutas.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Política de Privacidad — Kimberlite",
  description:
    "Qué datos trata Kimberlite, para qué los usa, con quién los comparte y cómo ejercer tus derechos de acceso, rectificación, supresión o portabilidad.",
};

// Clases del documento: mismo lenguaje visual que /terminos y el dashboard.
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

export default function PrivacidadPage() {
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

        <article aria-labelledby="privacidad-titulo">
          <header>
            <p className="kl-eyebrow">
              Última actualización:{" "}
              <time dateTime={LEGAL_LAST_UPDATED_ISO}>
                {LEGAL_LAST_UPDATED}
              </time>
            </p>
            <h1
              id="privacidad-titulo"
              className="kl-modal-title mt-3 text-3xl tracking-tight sm:text-4xl"
            >
              Política de Privacidad
            </h1>
            <p className={textClass}>
              Kimberlite es una biblioteca personal de conocimiento para
              trabajar con IA. Aquí explicamos qué datos tratamos, para qué los
              usamos y cómo puedes ejercer tus derechos.
            </p>
          </header>

          <hr className={`${dividerClass} mt-10`} />

          <div className="mt-10 space-y-10">
            <section aria-labelledby="responsable">
              <h2 id="responsable" className={sectionTitleClass}>
                1. Responsable
              </h2>
              <p className={textClass}>
                Kimberlite es un servicio personal de biblioteca de
                conocimiento para trabajar con IA. Para cualquier cuestión
                relacionada con tus datos, el contacto es{" "}
                <a href={contactHref} className={linkClass}>
                  {LEGAL_CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="datos">
              <h2 id="datos" className={sectionTitleClass}>
                2. Datos que tratamos
              </h2>
              <ul className={listClass}>
                <li>
                  <strong className={strongClass}>Datos de cuenta:</strong> email
                  (y nombre, si inicias sesión con Google) al registrarte.
                </li>
                <li>
                  <strong className={strongClass}>
                    Contenido que creas tú:
                  </strong>{" "}
                  prompts, notas, skills y comparaciones.
                </li>
                <li>
                  <strong className={strongClass}>
                    Datos técnicos mínimos:
                  </strong>{" "}
                  cookies técnicas de sesión e IP para seguridad básica.
                </li>
              </ul>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="finalidad">
              <h2 id="finalidad" className={sectionTitleClass}>
                3. Finalidad
              </h2>
              <p className={textClass}>
                Prestar el servicio de biblioteca personal de conocimiento de
                IA. No vendemos datos, no hacemos publicidad basada en tu
                contenido y no cedemos tu información a terceros.
              </p>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="encargados">
              <h2 id="encargados" className={sectionTitleClass}>
                4. Encargados de tratamiento
              </h2>
              <ul className={listClass}>
                <li>
                  <strong className={strongClass}>Supabase:</strong> base de
                  datos y autenticación; tu contenido se almacena en su
                  infraestructura.
                </li>
                <li>
                  <strong className={strongClass}>Google:</strong> únicamente si
                  inicias sesión con una cuenta de Google, bajo sus propias
                  políticas de privacidad.
                </li>
              </ul>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="conservacion">
              <h2 id="conservacion" className={sectionTitleClass}>
                5. Conservación
              </h2>
              <p className={textClass}>
                Tus datos se conservan mientras tu cuenta exista. Puedes borrar
                tu contenido y solicitar la eliminación de tu cuenta escribiendo
                a{" "}
                <a href={contactHref} className={linkClass}>
                  {LEGAL_CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="derechos">
              <h2 id="derechos" className={sectionTitleClass}>
                6. Tus derechos (RGPD)
              </h2>
              <p className={textClass}>
                Puedes ejercer los derechos de acceso, rectificación,
                supresión, oposición, portabilidad y limitación del tratamiento
                escribiendo a{" "}
                <a href={contactHref} className={linkClass}>
                  {LEGAL_CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="cookies">
              <h2 id="cookies" className={sectionTitleClass}>
                7. Cookies
              </h2>
              <p className={textClass}>
                Usamos únicamente cookies técnicas necesarias para mantener tu
                sesión. No hay cookies publicitarias ni de terceros no
                esenciales.
              </p>
            </section>

            <hr className={dividerClass} />

            <section aria-labelledby="cambios">
              <h2 id="cambios" className={sectionTitleClass}>
                8. Cambios
              </h2>
              <p className={textClass}>
                Cualquier modificación se avisará actualizando esta página con
                la nueva fecha.
              </p>
            </section>

          </div>

          <footer className="mt-14">
            <hr className={dividerClass} />
            <div className="pt-6 text-sm leading-relaxed text-[var(--kld-outline)]">
              <p>
                ¿Dudas sobre cómo tratamos tus datos? Escríbenos a{" "}
                <a href={contactHref} className={linkClass}>
                  {LEGAL_CONTACT_EMAIL}
                </a>
                .
              </p>
              <p className="mt-2">
                Consulta también los{" "}
                <Link href="/terminos" className={linkClass}>
                  Términos de Servicio
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
