"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface PromptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: {
    id: string;
    title: string;
    content: string;
    category: string;
    tags?: string[];
    times_used: number;
    created_at: string;
    is_favorite?: boolean;
  } | null;
}

interface RelatedNote {
  id: string;
  title: string;
  created_at: string;
}

interface RelatedComparison {
  id: string;
  prompt: string;
  created_at: string;
}

export default function PromptDetailModal({
  isOpen,
  onClose,
  prompt,
}: PromptDetailModalProps) {
  const router = useRouter();
  const [relatedNotes, setRelatedNotes] = useState<RelatedNote[]>([]);
  const [relatedComparisons, setRelatedComparisons] = useState<
    RelatedComparison[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !prompt) return;

    const promptId = prompt.id;

    async function fetchRelated() {
      setLoading(true);

      const { data: notes } = await supabase
        .from("notes")
        .select("id, title, created_at")
        .eq("prompt_id", promptId)
        .order("created_at", { ascending: false });

      if (notes) setRelatedNotes(notes);

      const { data: comparisons } = await supabase
        .from("arena_comparisons")
        .select("id, prompt, created_at")
        .eq("prompt_id", promptId)
        .order("created_at", { ascending: false });

      if (comparisons) setRelatedComparisons(comparisons);

      setLoading(false);
    }

    fetchRelated();
  }, [isOpen, prompt]);

  if (!isOpen || !prompt) return null;

  /* Sólo etiqueta: el color lo pone `.kl-chip--cat kl-chip--accent`, así la
     categoría se lee igual que en las tarjetas de la Fase 2. */
  const categoryLabels: Record<string, string> = {
    texto: "Texto",
    imagen: "Imagen",
    video: "Video",
    codigo: "Código",
  };

  const catLabel =
    categoryLabels[prompt.category.toLowerCase()] || prompt.category;

  const noteCount = relatedNotes.length;
  const comparisonCount = relatedComparisons.length;

  return (
    <div
      className="kl-portal kl-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-detail-title"
        className="kl-modal w-[calc(100%-2rem)] sm:w-full max-w-3xl my-8 max-h-[90dvh] overflow-y-auto animate-zoom-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="kl-modal-header sticky top-0 z-10 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="kl-chip kl-chip--cat kl-chip--accent shrink-0">
              {catLabel}
            </span>
            <h2 id="prompt-detail-title" className="kl-modal-title text-lg">
              {prompt.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="kl-icon-btn shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-8 sm:space-y-10 flex-1">
          {/* ===== RESUMEN SUPERIOR (métricas) ===== */}
          <div className="flex items-center gap-5 -mt-2">
            <span className="kl-meta font-medium">
              {noteCount} nota{noteCount !== 1 ? "s" : ""}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--kld-outline-variant)]" />
            <span className="kl-meta font-medium">
              {comparisonCount} comparac
              {comparisonCount !== 1 ? "iones" : "ión"}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--kld-outline-variant)]" />
            <span className="kl-meta font-medium">
              {prompt.times_used} uso{prompt.times_used !== 1 ? "s" : ""}
            </span>
          </div>

          {/* ===== PROMPT (protagonista) ===== */}
          <div>
            <span className="kl-eyebrow kl-eyebrow--xs mb-3 block">
              Prompt
            </span>
            <div className="kl-panel px-5 py-4 kl-card-text whitespace-pre-wrap">
              {prompt.content}
            </div>
          </div>

          {/* ===== ETIQUETAS ===== */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div>
              <span className="kl-eyebrow kl-eyebrow--xs mb-3 block">
                Etiquetas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags.map((t) => (
                  <span key={t} className="kl-chip kl-chip--cat">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ===== NOTAS RELACIONADAS ===== */}
          <div>
            <span className="kl-eyebrow kl-eyebrow--xs mb-3 block">
              Notas relacionadas ({noteCount})
            </span>
            {loading ? (
              <div className="kl-panel px-5 py-4">
                <div className="kl-skeleton h-4 w-3/4 rounded animate-pulse" />
              </div>
            ) : noteCount === 0 ? (
              <div className="kl-panel px-5 py-4">
                <p className="text-xs kl-text-muted">
                  Ninguna nota utiliza este prompt todavía.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {relatedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      onClose();
                      router.push(`/dashboard?tab=notes&noteId=${note.id}`);
                    }}
                    className="kl-panel kl-panel--interactive group w-full flex items-center justify-between px-5 py-3.5 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="kl-row-icon material-symbols-outlined text-[16px] shrink-0">
                        description
                      </span>
                      <span className="kl-text-soft text-sm font-medium truncate">
                        {note.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="kl-meta">
                        {new Date(note.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="kl-row-link">Abrir →</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== COMPARACIONES RELACIONADAS ===== */}
          <div>
            <span className="kl-eyebrow kl-eyebrow--xs mb-3 block">
              Comparaciones relacionadas ({comparisonCount})
            </span>
            {loading ? (
              <div className="kl-panel px-5 py-4">
                <div className="kl-skeleton h-4 w-3/4 rounded animate-pulse" />
              </div>
            ) : comparisonCount === 0 ? (
              <div className="kl-panel px-5 py-4">
                <p className="text-xs kl-text-muted leading-relaxed">
                  Todavía no has comparado este prompt entre distintos modelos.
                </p>
                <p className="text-xs kl-text-muted leading-relaxed mt-1">
                  Crea una comparación en Arena para descubrir cuál ofrece la
                  mejor respuesta.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {relatedComparisons.map((comparison) => (
                  <button
                    key={comparison.id}
                    onClick={() => {
                      onClose();
                      router.push(
                        `/dashboard?tab=arena&comparisonId=${comparison.id}`,
                      );
                    }}
                    className="kl-panel kl-panel--interactive group w-full flex items-center justify-between px-5 py-3.5 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="kl-row-icon material-symbols-outlined text-[16px] shrink-0">
                        swords
                      </span>
                      <span className="kl-text-soft text-sm font-medium truncate">
                        {comparison.prompt}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="kl-meta">
                        {new Date(comparison.created_at).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <span className="kl-row-link">Abrir →</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="kl-modal-footer sticky bottom-0 px-5 sm:px-6 pb-5 sm:pb-6 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="kl-meta">
            Creado el{" "}
            {new Date(prompt.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <button
            onClick={onClose}
            className="kl-btn kl-btn--ghost w-full sm:w-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
