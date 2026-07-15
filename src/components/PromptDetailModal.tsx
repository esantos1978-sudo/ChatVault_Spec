"use client";

import { useState, useEffect } from "react";
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

  const categoryConfig: Record<string, { style: string; label: string }> = {
    texto: {
      style: "bg-blue-950/20 border-blue-800/20 text-blue-300",
      label: "Texto",
    },
    imagen: {
      style: "bg-fuchsia-950/20 border-fuchsia-800/20 text-fuchsia-300",
      label: "Imagen",
    },
    video: {
      style: "bg-rose-950/20 border-rose-800/20 text-rose-300",
      label: "Video",
    },
    codigo: {
      style: "bg-emerald-950/20 border-emerald-800/20 text-emerald-300",
      label: "Código",
    },
  };

  const catKey = prompt.category.toLowerCase();
  const catConfig = categoryConfig[catKey] || {
    style: "bg-zinc-800/30 border-zinc-700/30 text-zinc-400",
    label: prompt.category,
  };

  const noteCount = relatedNotes.length;
  const comparisonCount = relatedComparisons.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(9, 9, 11, 0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-zinc-900 shadow-premium border border-zinc-800/40 my-8 animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-800/30 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium border ${catConfig.style}`}
            >
              {catConfig.label}
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
              {prompt.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800/40 transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-zinc-400 group-hover:text-zinc-100 transition-colors"
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
        <div className="px-6 py-6 space-y-10">
          {/* ===== RESUMEN SUPERIOR (métricas) ===== */}
          <div className="flex items-center gap-5 -mt-2">
            <span className="text-[11px] text-zinc-600 font-medium">
              {noteCount} nota{noteCount !== 1 ? "s" : ""}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-[11px] text-zinc-600 font-medium">
              {comparisonCount} comparac
              {comparisonCount !== 1 ? "iones" : "ión"}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-[11px] text-zinc-600 font-medium">
              {prompt.times_used} uso{prompt.times_used !== 1 ? "s" : ""}
            </span>
          </div>

          {/* ===== PROMPT (protagonista) ===== */}
          <div>
            <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-3 block">
              Prompt
            </span>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-950/80 px-5 py-4 text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap shadow-sm">
              {prompt.content}
            </div>
          </div>

          {/* ===== ETIQUETAS ===== */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div>
              <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-3 block">
                Etiquetas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md bg-zinc-800/50 text-zinc-400 text-[11px] font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ===== NOTAS RELACIONADAS ===== */}
          <div>
            <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-3 block">
              Notas relacionadas ({noteCount})
            </span>
            {loading ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-4">
                <div className="h-4 w-3/4 rounded bg-zinc-800 animate-pulse" />
              </div>
            ) : noteCount === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-4">
                <p className="text-xs text-zinc-600">
                  Ninguna nota utiliza este prompt todavía.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {relatedNotes.map((note) => (
                  <a
                    key={note.id}
                    href={`/dashboard?tab=notes&noteId=${note.id}`}
                    className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-3.5 hover:bg-zinc-800/30 hover:border-zinc-700 transition-all duration-180"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-[16px] text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0">
                        description
                      </span>
                      <span className="text-sm text-zinc-200 font-medium truncate">
                        {note.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-zinc-600">
                        {new Date(note.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-[11px] text-zinc-600 group-hover:text-violet-400 transition-colors font-medium">
                        Abrir →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ===== COMPARACIONES RELACIONADAS ===== */}
          <div>
            <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-3 block">
              Comparaciones relacionadas ({comparisonCount})
            </span>
            {loading ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-4">
                <div className="h-4 w-3/4 rounded bg-zinc-800 animate-pulse" />
              </div>
            ) : comparisonCount === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-4">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Todavía no has comparado este prompt entre distintos modelos.
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed mt-1">
                  Crea una comparación en Arena para descubrir cuál ofrece la
                  mejor respuesta.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {relatedComparisons.map((comparison) => (
                  <a
                    key={comparison.id}
                    href={`/dashboard?tab=arena&comparisonId=${comparison.id}`}
                    className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-3.5 hover:bg-zinc-800/30 hover:border-zinc-700 transition-all duration-180"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-[16px] text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0">
                        swords
                      </span>
                      <span className="text-sm text-zinc-200 font-medium truncate">
                        {comparison.prompt}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-zinc-600">
                        {new Date(comparison.created_at).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <span className="text-[11px] text-zinc-600 group-hover:text-violet-400 transition-colors font-medium">
                        Abrir →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 pb-6 pt-5 border-t border-zinc-800/30 flex items-center justify-between">
          <span className="text-[10px] text-zinc-700">
            Creado el{" "}
            {new Date(prompt.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <button
            onClick={onClose}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-400 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
