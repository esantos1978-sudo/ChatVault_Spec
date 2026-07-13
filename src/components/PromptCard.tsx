"use client";

import { useState } from "react";

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    content: string;
    category: string;
    tags?: string[];
    times_used: number;
    created_at: string;
    is_favorite?: boolean;
  };
  onEdit: (prompt: any) => void;
  onDelete: (id: string) => void;
  onCopy: (prompt: any) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  index?: number;
}

// Colores por categoría
const categoryColors: Record<string, any> = {
  imagen: {
    bg: "bg-purple-500/15",
    text: "text-purple-400",
    border: "border-purple-500/30",
    dot: "bg-purple-400",
  },
  texto: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/30",
    dot: "bg-blue-400",
  },
  codigo: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  video: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-400",
  },
  mcp: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  otro: {
    bg: "bg-surface-container-high",
    text: "text-on-surface-variant",
    border: "border-outline-variant/30",
    dot: "bg-on-surface-variant",
  },
};

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onCopy,
  onToggleFavorite,
  index = 0,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const colors = categoryColors[prompt.category] || categoryColors.otro;

  const handleCopy = () => {
    onCopy(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 border-l-4 border-l-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col h-full relative overflow-hidden cursor-pointer"
      onClick={() => onEdit(prompt)}
    >
      {/* Cabecera: Badge + Favoritos + Eliminar */}
      <div className="flex items-start justify-between mb-4">
        <span
          className={`px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${colors.border}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`}
          />
          {prompt.category}
        </span>

        <div className="flex items-center gap-1">
          {/* ⭐ Favorito */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt.id, !prompt.is_favorite);
            }}
            className="p-1.5 text-zinc-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title={
              prompt.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: prompt.is_favorite
                  ? "'FILL' 1"
                  : "'FILL' 0",
              }}
            >
              star
            </span>
          </button>

          {/* 🗑️ Eliminar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prompt.id);
            }}
            className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
            title="Eliminar prompt"
          >
            <span className="material-symbols-outlined text-[20px]">
              delete
            </span>
          </button>
        </div>
      </div>

      {/* Título */}
      <h3 className="text-base font-bold text-amber-700 dark:text-amber-400 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-1">
        {prompt.title}
      </h3>
      {/* Contenido */}
      <p className="font-body-sm text-on-surface-variant/80 flex-grow mb-4 line-clamp-3 text-sm leading-relaxed">
        {prompt.content}
      </p>

      {/* Pie de tarjeta: Etiquetas + Usos + Fecha */}
      <div className="flex flex-col gap-3 pt-4 border-t border-primary/15">
        <div className="flex flex-wrap gap-2">
          {prompt.tags && prompt.tags.length > 0 ? (
            prompt.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded bg-primary/10 text-primary/80 text-[10px] font-bold"
              >
                # {t}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-on-surface-variant/40">
              Sin etiquetas
            </span>
          )}
          {prompt.tags && prompt.tags.length > 2 && (
            <span className="text-[10px] text-on-surface-variant/40">
              +{prompt.tags.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-on-surface-variant/50">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span className="font-label-sm text-[11px]">
              {prompt.times_used} usos
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">
              calendar_today
            </span>
            <span className="font-label-sm text-[11px]">
              {new Date(prompt.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-bold transition-colors"
          >
            {copied ? "✅ Copiado" : "📋 Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}
