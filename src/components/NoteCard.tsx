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
        bg: "bg-zinc-800/30",
        text: "text-zinc-500",
        dot: "bg-zinc-500",
      };

    const modelColors: Record<string, any> = {
      "DeepSeek-R1": {
        bg: "bg-zinc-800/30",
        text: "text-zinc-500",
        dot: "bg-zinc-500",
      },
      "DeepSeek-V3": {
        bg: "bg-zinc-800/30",
        text: "text-zinc-500",
        dot: "bg-zinc-500",
      },
      "ChatGPT-4o": {
        bg: "bg-emerald-500/8",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
      },
      "ChatGPT-4o-mini": {
        bg: "bg-emerald-500/8",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
      },
      "Claude-3.5-Sonnet": {
        bg: "bg-purple-500/8",
        text: "text-purple-400",
        dot: "bg-purple-400",
      },
      "Claude-3.7-Sonnet": {
        bg: "bg-purple-500/8",
        text: "text-purple-400",
        dot: "bg-purple-400",
      },
      "Gemini-1.5-Pro": {
        bg: "bg-amber-500/8",
        text: "text-amber-400",
        dot: "bg-amber-400",
      },
      "Gemini-2.0-Flash": {
        bg: "bg-amber-500/8",
        text: "text-amber-400",
        dot: "bg-amber-400",
      },
      "Gemini-2.5-Pro": {
        bg: "bg-amber-500/8",
        text: "text-amber-400",
        dot: "bg-amber-400",
      },
      "Llama-3": {
        bg: "bg-rose-500/8",
        text: "text-rose-400",
        dot: "bg-rose-400",
      },
      "Llama-3.1": {
        bg: "bg-rose-500/8",
        text: "text-rose-400",
        dot: "bg-rose-400",
      },
      "Mistral-Large": {
        bg: "bg-cyan-500/8",
        text: "text-cyan-400",
        dot: "bg-cyan-400",
      },
      "Grok-2": {
        bg: "bg-violet-500/8",
        text: "text-violet-400",
        dot: "bg-violet-400",
      },
      "Grok-3": {
        bg: "bg-violet-500/8",
        text: "text-violet-400",
        dot: "bg-violet-400",
      },
    };

    return (
      modelColors[model] || {
        bg: "bg-zinc-800/30",
        text: "text-zinc-500",
        dot: "bg-zinc-500",
      }
    );
  };

  const colors = getModelColor(note.ai_model);

  return (
    <div
      className="group bg-zinc-900/70 rounded-2xl border border-zinc-800/40 hover:bg-zinc-800/30 hover:border-zinc-700/40 transition-all duration-180 ease-out p-6 flex flex-col h-full relative cursor-pointer"
      onClick={() => onEdit(note)}
    >
      {/* Badge del modelo */}
      <div className="mb-5">
        <span
          className={`inline-flex items-center gap-1 pl-0 pr-1 py-[1px] rounded-md ${colors.bg} ${colors.text} text-[9px] font-medium`}
        >
          <span className={`w-[3px] h-[3px] rounded-full ${colors.dot}`} />
          {note.ai_model || "Desconocido"}
        </span>
      </div>

      {/* Título */}
      <h3 className="text-[17px] font-bold text-white leading-tight mb-5 line-clamp-1">
        {note.title}
      </h3>

      {/* Resumen */}
      <p className="text-sm text-zinc-500/80 leading-[1.65] flex-grow mb-5 line-clamp-3">
        {note.content}
      </p>

      {/* Footer: Tags + Acciones */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/30">
        {/* Tags a la izquierda */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {note.tags && note.tags.length > 0 ? (
            note.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="px-1 py-[1px] rounded bg-zinc-800/50 text-zinc-600 text-[9px] font-medium truncate"
              >
                #{t}
              </span>
            ))
          ) : (
            <span className="text-[9px] text-zinc-700">Sin etiquetas</span>
          )}
          {note.tags && note.tags.length > 2 && (
            <span className="text-[9px] text-zinc-700 shrink-0">
              +{note.tags.length - 2}
            </span>
          )}
        </div>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-0 shrink-0">
          {/* Fecha */}
          <span className="text-[10px] text-zinc-700 mr-3">
            {new Date(note.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>

          {/* Copiar MD */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const markdown = `# ${note.title}\n\n${note.content}\n\n---\n*Copiado desde Kimberlite*`;
              navigator.clipboard.writeText(markdown);
              toast.success("Nota copiada en Markdown");
            }}
            className="p-[3px] rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all duration-180"
            title="Copiar en Markdown"
          >
            <span className="material-symbols-outlined text-[16px]">
              content_copy
            </span>
          </button>

          {/* Favorito */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(note.id, !note.is_favorite);
            }}
            className="p-[3px] rounded-lg text-zinc-600 hover:text-amber-400 hover:bg-zinc-800/60 transition-all duration-180"
            title={
              note.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{
                fontVariationSettings: note.is_favorite
                  ? "'FILL' 1"
                  : "'FILL' 0",
              }}
            >
              star
            </span>
          </button>

          {/* Eliminar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-[3px] rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800/60 transition-all duration-180"
            title="Eliminar nota"
          >
            <span className="material-symbols-outlined text-[16px]">
              delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
