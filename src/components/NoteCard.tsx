"use client";

import toast from "react-hot-toast";

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    summary?: string;
    tags?: string[];
    ai_model?: string;
    source_url?: string;
    created_at: string;
    is_favorite?: boolean;
    prompt_id?: string;
    prompts?: { title: string };
  };
  onEdit: (note: any) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  index?: number;
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onToggleFavorite,
  index = 0,
}: NoteCardProps) {
  // Colores para modelos de IA
  const getModelColor = (model?: string) => {
    if (!model)
      return {
        bg: "bg-surface-container-high",
        text: "text-on-surface-variant",
        border: "border-outline-variant/30",
        dot: "bg-on-surface-variant",
      };

    const modelColors: Record<string, any> = {
      "DeepSeek-R1": {
        bg: "bg-secondary-container/30",
        text: "text-secondary",
        border: "border-secondary/30",
        dot: "bg-secondary",
      },
      "DeepSeek-V3": {
        bg: "bg-secondary-container/30",
        text: "text-secondary",
        border: "border-secondary/30",
        dot: "bg-secondary",
      },
      "ChatGPT-4o": {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        dot: "bg-emerald-400",
      },
      "ChatGPT-4o-mini": {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        dot: "bg-emerald-400",
      },
      "Claude-3.5-Sonnet": {
        bg: "bg-purple-500/15",
        text: "text-purple-400",
        border: "border-purple-500/30",
        dot: "bg-purple-400",
      },
      "Claude-3.7-Sonnet": {
        bg: "bg-purple-500/15",
        text: "text-purple-400",
        border: "border-purple-500/30",
        dot: "bg-purple-400",
      },
      "Gemini-1.5-Pro": {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        border: "border-amber-500/30",
        dot: "bg-amber-400",
      },
      "Gemini-2.0-Flash": {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        border: "border-amber-500/30",
        dot: "bg-amber-400",
      },
      "Gemini-2.5-Pro": {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        border: "border-amber-500/30",
        dot: "bg-amber-400",
      },
      "Llama-3": {
        bg: "bg-rose-500/15",
        text: "text-rose-400",
        border: "border-rose-500/30",
        dot: "bg-rose-400",
      },
      "Llama-3.1": {
        bg: "bg-rose-500/15",
        text: "text-rose-400",
        border: "border-rose-500/30",
        dot: "bg-rose-400",
      },
      "Mistral-Large": {
        bg: "bg-cyan-500/15",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
        dot: "bg-cyan-400",
      },
      "Grok-2": {
        bg: "bg-violet-500/15",
        text: "text-violet-400",
        border: "border-violet-500/30",
        dot: "bg-violet-400",
      },
      "Grok-3": {
        bg: "bg-violet-500/15",
        text: "text-violet-400",
        border: "border-violet-500/30",
        dot: "bg-violet-400",
      },
    };

    return (
      modelColors[model] || {
        bg: "bg-surface-container-high",
        text: "text-on-surface-variant",
        border: "border-outline-variant/30",
        dot: "bg-on-surface-variant",
      }
    );
  };

  const colors = getModelColor(note.ai_model);

  return (
    <div
      className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 border-l-4 border-l-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col h-full relative overflow-hidden cursor-pointer"
      onClick={() => onEdit(note)}
    >
      {" "}
      {/* Cabecera: Badge + Favoritos + Eliminar */}
      <div className="flex items-start justify-between mb-4">
        <span
          className={`px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${colors.border}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`}
          />
          {note.ai_model || "Desconocido"}
        </span>

        <div className="flex items-center gap-1">
          {/* ⭐ Favorito */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(note.id, !note.is_favorite);
            }}
            className="p-1.5 text-zinc-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title={
              note.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: note.is_favorite
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
              onDelete(note.id);
            }}
            className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
            title="Eliminar nota"
          >
            <span className="material-symbols-outlined text-[20px]">
              delete
            </span>
          </button>
        </div>
      </div>
      {/* Título */}
      <h3 className="text-base font-bold text-amber-700 dark:text-amber-400 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-1">
        {note.title}
      </h3>
      {/* Contenido */}
      <p className="font-body-sm text-on-surface-variant/80 flex-grow mb-4 line-clamp-3 text-sm leading-relaxed">
        {note.content}
      </p>
      {/* Pie de tarjeta: Etiquetas + Fecha */}
      <div className="flex flex-col gap-3 pt-4 border-t border-primary/15">
        <div className="flex flex-wrap gap-2">
          {note.tags && note.tags.length > 0 ? (
            note.tags.slice(0, 2).map((t) => (
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
          {note.tags && note.tags.length > 2 && (
            <span className="text-[10px] text-on-surface-variant/40">
              +{note.tags.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-on-surface-variant/50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const markdown = `# ${note.title}\n\n${note.content}\n\n---\n*Copiado desde Kimberlite*`;
              navigator.clipboard.writeText(markdown);
              toast.success("📋 Nota copiada en Markdown");
            }}
            className="text-zinc-400 hover:text-primary transition-colors text-[11px]"
          >
            Copiar MD
          </button>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">
              calendar_today
            </span>
            <span className="font-label-sm text-[11px]">
              {new Date(note.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
