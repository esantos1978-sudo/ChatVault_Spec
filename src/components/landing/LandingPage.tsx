"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Inter,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./landing.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-kl-body",
  display: "swap",
});

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-kl-display",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-kl-mono",
  display: "swap",
});

interface IconProps {
  name: string;
  className?: string;
}

/** Icono de Material Symbols (la hoja de estilos se carga en el RootLayout). */
function Icon({ name, className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined kl-icon${className ? ` ${className}` : ""}`}
    >
      {name}
    </span>
  );
}

const NAV_LINKS = [
  { href: "#caracteristicas", label: "Características" },
  { href: "#como-funciona", label: "Cómo funciona" },
];

const HERO_CHECKS = [
  "Prompts, notas y Skills en un solo lugar",
  "Arena para comparar modelos",
  "Búsqueda instantánea con ⌘K",
  "Etiquetas, categorías y favoritos",
];

const ARENA_MODELS = [
  { icon: "forum", name: "ChatGPT" },
  { icon: "neurology", name: "Claude" },
  { icon: "auto_awesome", name: "Gemini" },
  { icon: "terminal", name: "DeepSeek" },
  { icon: "memory", name: "Llama" },
  { icon: "air", name: "Mistral" },
];

const SKILLS_PREVIEW = [
  { icon: "bolt", name: "Revisar prompt", meta: "12 usos" },
  { icon: "description", name: "Resumen ejecutivo", meta: "8 usos" },
  { icon: "compare_arrows", name: "Comparar respuestas", meta: "5 usos" },
];

const FEATURE_CARDS = [
  {
    icon: "bookmark_add",
    tone: "violet",
    title: "Prompts a salvo del olvido",
    text: "Guarda cada prompt con su contexto y sus etiquetas. Cuando algo funciona, lo recuperas sin excavar en chats antiguos.",
    foot: "Tus mejores prompts, siempre a mano",
    footIcon: "history",
  },
  {
    icon: "edit_note",
    tone: "cyan",
    title: "Notas con el porqué",
    text: "Convierte una conversación en una nota con tu propio contexto: fuentes, decisiones y conclusiones en Markdown.",
    foot: "Markdown con bloques de conversación",
    footIcon: "notes",
  },
  {
    icon: "compare_arrows",
    tone: "indigo",
    title: "Arena de modelos",
    text: "Enfrenta dos respuestas al mismo prompt, marca la ganadora y deja registrado por qué te sirvió más.",
    foot: "Elige con evidencia, no por intuición",
    footIcon: "emoji_events",
  },
  {
    icon: "manage_search",
    tone: "violet",
    title: "Encuentra en segundos",
    text: "Filtra por texto, etiqueta, categoría o favorito. Abre la búsqueda con ⌘K desde cualquier punto del dashboard.",
    foot: "⌘K en cualquier momento",
    footIcon: "keyboard_command_key",
  },
];

const BEFORE_ITEMS = [
  {
    title: "El prompt que funcionó quedó enterrado",
    text: "Tres semanas de historial y ninguna forma rápida de volver a él.",
  },
  {
    title: "Reescribes la misma instrucción base",
    text: "Cada chat empieza desde cero, aunque ya sabías cómo pedirlo.",
  },
  {
    title: "Comparaste dos modelos y ya no recuerdas cuál ganó",
    text: "La decisión vivía en una pestaña que cerraste.",
  },
];

const AFTER_ITEMS = [
  {
    title: "Guardas el prompt y lo etiquetas",
    text: "Vuelve a aparecer cuando lo busques por tema, categoría o favorito.",
  },
  {
    title: "Conviertes la conversación en una nota",
    text: "Añades tu contexto para no perder por qué esa respuesta servía.",
  },
  {
    title: "Creas un Skill y lo reutilizas",
    text: "Una instrucción bien construida, lista para copiar en el siguiente chat.",
  },
];

function Brand() {
  return (
    <a href="#inicio" className="kl-brand" aria-label="Kimberlite, ir al inicio">
      <span className="kl-brand-mark">
        <Image
          src="/images/kimberlite-logo.png"
          alt="Kimberlite"
          width={132}
          height={48}
          className="kl-brand-logo"
          priority
        />
      </span>
    </a>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <div
      className={`kl-landing ${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <a className="kl-skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <header className="kl-header">
        <div className="kl-container kl-header-inner">
          <Brand />

          <nav className="kl-nav" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <a key={link.href} className="kl-nav-link" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="kl-header-actions">
            <Link
              href="/?auth=login"
              className="kl-btn kl-btn--ghost kl-header-login"
            >
              Iniciar sesión
            </Link>
            <Link href="/?auth=register" className="kl-btn kl-btn--primary">
              Crear cuenta
            </Link>
            <button
              type="button"
              className="kl-menu-toggle"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="kl-mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="kl-mobile-menu" id="kl-mobile-nav">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    className="kl-mobile-link"
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  className="kl-mobile-link"
                  href="#skills"
                  onClick={() => setMenuOpen(false)}
                >
                  Skills
                </a>
              </li>
            </ul>
            <Link
              href="/?auth=register"
              className="kl-btn kl-btn--primary kl-btn--block"
              onClick={() => setMenuOpen(false)}
            >
              Crear mi biblioteca
            </Link>
            <Link
              href="/?auth=login"
              className="kl-btn kl-btn--ghost kl-btn--block"
              onClick={() => setMenuOpen(false)}
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </header>

      <main id="contenido" className="kl-main">
        <section id="inicio" className="kl-hero" aria-labelledby="kl-hero-title">
          <div className="kl-hero-glow kl-hero-glow--violet" aria-hidden="true" />
          <div className="kl-hero-glow kl-hero-glow--cyan" aria-hidden="true" />

          <div className="kl-container kl-hero-grid">
            <div className="kl-hero-copy">
              <span className="kl-badge">
                <span className="kl-status-dot" aria-hidden="true" />
                Nuevo · Skills reutilizables
              </span>

              <h1 id="kl-hero-title" className="kl-hero-title">
                Convierte tus conversaciones con IA en una biblioteca que
                trabaja contigo.
              </h1>

              <p className="kl-hero-sub">
                Guarda los prompts que funcionan, convierte cada charla en una
                nota con contexto y crea Skills para no volver a empezar de
                cero.
              </p>

              <div className="kl-hero-actions">
                <Link href="/?auth=register" className="kl-btn kl-btn--primary">
                  Crear mi biblioteca
                  <Icon name="arrow_forward" />
                </Link>
                <a className="kl-btn kl-btn--secondary" href="#como-funciona">
                  <Icon name="play_circle" className="filled" />
                  Ver cómo funciona
                </a>
              </div>

              <ul className="kl-checklist">
                {HERO_CHECKS.map((item) => (
                  <li key={item} className="kl-check-item">
                    <Icon name="check_circle" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <ProductPreview />
          </div>
        </section>

        <section className="kl-integrations" aria-labelledby="kl-arena-title">
          <div className="kl-container kl-integrations-inner">
            <div className="kl-integrations-copy">
              <span className="kl-eyebrow" id="kl-arena-title">
                Arena de modelos
              </span>
              <p>
                ¿No sabes qué modelo responde mejor? Guarda las respuestas,
                compáralas y deja registrado cuál te sirvió.
              </p>
            </div>
            <ul className="kl-model-badges">
              {ARENA_MODELS.map((model) => (
                <li key={model.name} className="kl-model-badge">
                  <Icon name={model.icon} />
                  {model.name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="caracteristicas"
          className="kl-section"
          aria-labelledby="kl-features-title"
        >
          <div className="kl-container">
            <div className="kl-section-head">
              <span className="kl-eyebrow">Características</span>
              <h2 id="kl-features-title" className="kl-section-title">
                Todo lo que aprendes con IA, en un solo lugar
              </h2>
              <p className="kl-section-sub">
                Prompts, notas, Skills y comparativas comparten biblioteca,
                etiquetas y búsqueda. Deja de repartir tu criterio entre
                pestañas.
              </p>
            </div>

            <div className="kl-bento">
              <article id="skills" className="kl-card kl-card--skills">
                <span className="kl-new-badge">
                  <Icon name="auto_awesome" />
                  Nuevo
                </span>

                <div className="kl-card-top">
                  <span className="kl-card-icon">
                    <Icon name="psychology" />
                  </span>
                  <div>
                    <h3 className="kl-card-title">
                      Skills: instrucciones que dejas de reescribir
                    </h3>
                    <p className="kl-card-text">
                      Un Skill es una instrucción reutilizable con su propio
                      contexto, categoría y etiquetas. Guárdala una vez y
                      cópiala en cualquier chat cuando la necesites.
                    </p>
                  </div>
                </div>

                <ul className="kl-skill-list">
                  {SKILLS_PREVIEW.map((skill) => (
                    <li key={skill.name} className="kl-skill-item">
                      <Icon name={skill.icon} />
                      <span>{skill.name}</span>
                      <span>{skill.meta}</span>
                    </li>
                  ))}
                </ul>

                <div className="kl-card-foot">
                  Construye una vez. Reutiliza siempre.
                  <Icon name="arrow_forward" />
                </div>
              </article>

              {FEATURE_CARDS.map((card) => {
                const tone = card.tone === "violet" ? "" : `--${card.tone}`;

                return (
                  <article key={card.title} className="kl-card">
                    <div className="kl-card-top">
                      <span className={`kl-card-icon kl-card-icon${tone}`}>
                        <Icon name={card.icon} />
                      </span>
                      <div>
                        <h3 className="kl-card-title">{card.title}</h3>
                        <p className="kl-card-text">{card.text}</p>
                      </div>
                    </div>
                    <div
                      className={
                        tone ? `kl-card-foot kl-card-foot${tone}` : "kl-card-foot"
                      }
                    >
                      <Icon name={card.footIcon} />
                      {card.foot}
                    </div>
                  </article>
                );
              })}

              <article className="kl-card kl-card--privacy">
                <span className="kl-card-icon">
                  <Icon name="lock" />
                </span>
                <div className="kl-card-body">
                  <h3 className="kl-card-title">
                    Tu biblioteca, sólo tuya
                  </h3>
                  <p className="kl-card-text">
                    Cada cuenta tiene su propio espacio privado en Supabase.
                    Sin feeds públicos ni notas de otros usuarios mezcladas con
                    las tuyas.
                  </p>
                </div>
                <div className="kl-card-foot">
                  <Icon name="verified_user" />
                  Sólo con tu sesión
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="como-funciona"
          className="kl-section kl-section--alt"
          aria-labelledby="kl-flow-title"
        >
          <div className="kl-container">
            <div className="kl-section-head">
              <span className="kl-eyebrow kl-eyebrow--cyan">Cómo funciona</span>
              <h2 id="kl-flow-title" className="kl-section-title">
                Menos pestañas. Más criterio acumulado.
              </h2>
              <p className="kl-section-sub">
                Kimberlite no escribe por ti: ordena lo que ya produces con la
                IA para que cada conversación arranque con ventaja.
              </p>
            </div>

            <div className="kl-flow">
              <article className="kl-panel">
                <div className="kl-panel-head">
                  <span className="kl-panel-label">
                    <span className="kl-panel-dot" aria-hidden="true" />
                    Sin Kimberlite
                  </span>
                  <span className="kl-panel-note">6 pestañas abiertas</span>
                </div>
                <ul className="kl-flow-list">
                  {BEFORE_ITEMS.map((item) => (
                    <li key={item.title} className="kl-flow-item">
                      <Icon name="close" />
                      <div>
                        <span className="kl-flow-item-title">{item.title}</span>
                        <span className="kl-flow-item-text">{item.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="kl-panel kl-panel--after">
                <div className="kl-panel-head">
                  <span className="kl-panel-label">
                    <span className="kl-panel-dot" aria-hidden="true" />
                    Con Kimberlite
                  </span>
                  <span className="kl-panel-note">Una sola biblioteca</span>
                </div>
                <ul className="kl-flow-list">
                  {AFTER_ITEMS.map((item) => (
                    <li key={item.title} className="kl-flow-item kl-flow-item--ok">
                      <Icon name="check_circle" />
                      <div>
                        <span className="kl-flow-item-title">{item.title}</span>
                        <span className="kl-flow-item-text">{item.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="kl-coming">
                  <span className="kl-coming-tag">Roadmap</span>
                  Exportación, importación masiva y estadísticas avanzadas están
                  en camino.
                </div>
              </article>
            </div>
          </div>
        </section>


        <section className="kl-cta" aria-labelledby="kl-cta-title">
          <div className="kl-container">
            <div className="kl-cta-card">
              <div className="kl-cta-glow" aria-hidden="true" />

              <div className="kl-cta-content">
                <span className="kl-eyebrow">Empieza hoy</span>
                <h2 id="kl-cta-title" className="kl-cta-title">
                  Construye una vez. Reutiliza siempre.
                </h2>
                <p className="kl-cta-sub">
                  Crea tu biblioteca, guarda tu primer prompt y comprueba lo
                  rápido que vuelves a encontrarlo.
                </p>
              </div>

              <div className="kl-cta-actions">
                <Link href="/?auth=register" className="kl-btn kl-btn--primary">
                  Crear mi biblioteca
                  <Icon name="arrow_forward" />
                </Link>
                <Link href="/?auth=login" className="kl-btn kl-btn--secondary">
                  Ya tengo cuenta
                </Link>
              </div>

              <div className="kl-cta-meta">
                <span className="kl-cta-meta-item">
                  <Icon name="lock" />
                  Datos en tu cuenta privada
                </span>
                <span className="kl-cta-meta-item">
                  <Icon name="bolt" />
                  Funciona en el navegador
                </span>
                <span className="kl-cta-meta-item">
                  <Icon name="keyboard_command_key" />
                  Búsqueda con ⌘K
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="kl-footer">
        <div className="kl-container">
          <div className="kl-footer-grid">
            <div className="kl-footer-brand">
              <a
                href="#inicio"
                className="kl-brand"
                aria-label="Kimberlite, ir al inicio"
              >
                <Image
                  src="/images/kimberlite-logo.png"
                  alt="Kimberlite"
                  width={132}
                  height={48}
                  className="kl-brand-logo kl-footer-logo"
                />
              </a>
              <p className="kl-footer-text">
                La biblioteca personal para tu trabajo con IA. Guarda lo que
                funciona y reutilízalo cuando lo necesites.
              </p>
              <span className="kl-footer-status">
                <Icon name="auto_stories" className="kl-icon--sm" />
                v0.1 · en desarrollo activo
              </span>
            </div>

            <div>
              <span className="kl-footer-col-title">Producto</span>
              <ul className="kl-footer-links">
                <li>
                  <a href="#caracteristicas">Características</a>
                </li>
                <li>
                  <a href="#skills">Skills</a>
                </li>
                <li>
                  <a href="#como-funciona">Cómo funciona</a>
                </li>
              </ul>
            </div>

            <div>
              <span className="kl-footer-col-title">Cuenta</span>
              <ul className="kl-footer-links">
                <li>
                  <Link href="/?auth=login">Iniciar sesión</Link>
                </li>
                <li>
                  <Link href="/?auth=register">Crear cuenta</Link>
                </li>
              </ul>
            </div>

            <div>
              <span className="kl-footer-col-title">Próximamente</span>
              <ul className="kl-footer-links">
                <li>Exportación</li>
                <li>Importación masiva</li>
                <li>Estadísticas avanzadas</li>
              </ul>
            </div>
          </div>

          <div className="kl-footer-bottom">
            <p>
              © {new Date().getFullYear()} Kimberlite. Hecho para quienes
              trabajan con IA todos los días.
            </p>
            <span>Obsidian Lumina</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="kl-preview" aria-hidden="true">
      <div className="kl-window">
        <div className="kl-window-bar">
          <div className="kl-window-dots">
            <span className="kl-window-dot kl-window-dot--red" />
            <span className="kl-window-dot kl-window-dot--cyan" />
            <span className="kl-window-dot kl-window-dot--violet" />
            <span className="kl-window-title">
              <Icon name="auto_stories" />
              kimberlite · biblioteca
            </span>
          </div>
          <div className="kl-window-meta">
            <span className="kl-window-chip">
              <Icon name="lock" className="kl-icon--xs" />
              Privado
            </span>
            <span className="kl-window-kbd">⌘K</span>
          </div>
        </div>

        <div className="kl-window-body">
          <div className="kl-tree">
            <div className="kl-mock-search">
              <Icon name="search" />
              <span>Buscar en la biblioteca</span>
            </div>

            <div>
              <span className="kl-tree-label">Contenido</span>
              <div className="kl-tree-list">
                <div className="kl-tree-item">
                  <span>
                    <Icon name="folder" />
                    Prompts
                  </span>
                  <span className="kl-tree-count">14</span>
                </div>
                <div className="kl-tree-item kl-tree-item--active">
                  <span>
                    <Icon name="folder_open" />
                    Skills
                  </span>
                  <span className="kl-tree-count">6</span>
                </div>
                <div className="kl-tree-item">
                  <span>
                    <Icon name="folder" />
                    Notas
                  </span>
                  <span className="kl-tree-count">24</span>
                </div>
                <div className="kl-tree-item">
                  <span>
                    <Icon name="folder" />
                    Arena
                  </span>
                  <span className="kl-tree-count">9</span>
                </div>
              </div>
            </div>

            <div className="kl-tree-meta">
              <div className="kl-tree-meta-row">
                <span>Sesión</span>
                <span>Privada</span>
              </div>
              <div className="kl-tree-meta-row">
                <span>Sync</span>
                <span className="kl-tree-meta-ok">Al día</span>
              </div>
            </div>
          </div>

          <div className="kl-preview-main">
            <div className="kl-item-head">
              <div>
                <div className="kl-item-heading">
                  <span className="kl-item-title">Revisar prompt</span>
                  <span className="kl-item-version">v3</span>
                </div>
                <p className="kl-item-text">Skill · Automatización</p>
              </div>
              <Icon name="bookmark" />
            </div>

            <div className="kl-instructions">
              <div className="kl-instructions-head">
                <span>Instrucciones</span>
                <span>12 usos</span>
              </div>
              <p className="kl-instructions-body">
                Actúa como <strong>revisor técnico</strong>. Señala supuestos,
                riesgos y qué falta antes de aprobar el prompt.
              </p>
            </div>

            <div className="kl-model-row">
              <span className="kl-model-pill kl-model-pill--active">
                Claude 3.7 Sonnet
              </span>
              <span className="kl-model-pill">ChatGPT-4o</span>
              <span className="kl-model-pill">Gemini 2.5 Pro</span>
              <span className="kl-model-pill">DeepSeek-V3</span>
            </div>

            <div className="kl-output">
              <div className="kl-output-head">
                <span>Salida</span>
                <span>hace 2 min</span>
              </div>
              <p className="kl-output-code">
                {"> 3 supuestos sin verificar\n> 1 riesgo de seguridad\n> falta definir el formato"}
              </p>
            </div>

            <div className="kl-preview-foot">
              <span className="kl-tag-row">
                <span className="kl-tag">#revision</span>
                <span className="kl-tag">#prompt</span>
              </span>
              <span className="kl-preview-foot-meta">
                <span>
                  <Icon name="content_copy" />
                  12 copias
                </span>
                <span>
                  <Icon name="lock" />
                  Privado
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
