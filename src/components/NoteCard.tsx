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
  // Punto de color del modelo: el chip es neutro (como en la landing) y el
  // color se conserva sólo en el indicador, así el card no grita.
  const getModelAccent = (model?: string) => {
    const fallback = "#958ea0";
    if (!model) return fallback;

    const accents: Record<string, string> = {
      "DeepSeek-R1": fallback,
      "DeepSeek-V3": fallback,
      "ChatGPT-4o": "#34d399",
      "ChatGPT-4o-mini": "#34d399",
      "Claude-3.5-Sonnet": "#c084fc",
      "Claude-3.7-Sonnet": "#c084fc",
      "Gemini-1.5-Pro": "#fbbf24",
      "Gemini-2.0-Flash": "#fbbf24",
      "Gemini-2.5-Pro": "#fbbf24",
      "Llama-3": "#fb7185",
      "Llama-3.1": "#fb7185",
      "Mistral-Large": "#22d3ee",
      "Grok-2": "#a78bfa",
      "Grok-3": "#a78bfa",
    };

    return accents[model] || fallback;
  };

  const accent = getModelAccent(note.ai_model);

  return (
    <div
      className="kl-card kl-card--interactive group p-6 flex flex-col h-full relative cursor-pointer"
      onClick={() => onEdit(note)}
    >
      {/* Badge del modelo */}
      <div className="mb-5">
        <span className="kl-chip kl-chip--model gap-1.5">
          <span
            className="h-[3px] w-[3px] rounded-full shrink-0"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          />
          {note.ai_model || "Desconocido"}
        </span>
      </div>

      {/* Título */}
      <h3 className="kl-card-title text-[17px] leading-tight mb-5 line-clamp-1">
        {note.title}
      </h3>

      {/* Resumen */}
      <p className="kl-card-text flex-grow mb-5 line-clamp-3">
        {note.summary || note.content}
      </p>

      {/* Separador (1px + 16px = mismo hueco que el antiguo pt-4 border-t) */}
      <div className="kl-divider mt-4" />

      {/* Footer: Tags + Acciones */}
      <div className="flex items-center justify-between">
        {/* Tags a la izquierda */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {note.tags && note.tags.length > 0 ? (
            note.tags.slice(0, 2).map((t) => (
              <span key={t} className="kl-chip kl-chip--tag truncate">
                #{t}
              </span>
            ))
          ) : (
            <span className="kl-meta">Sin etiquetas</span>
          )}
          {note.tags && note.tags.length > 2 && (
            <span className="kl-meta shrink-0">+{note.tags.length - 2}</span>
          )}
        </div>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-0 shrink-0">
          {/* Fecha */}
          <span className="kl-meta mr-3">
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
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--success"
            title="Copiar en Markdown"
            aria-label="Copiar nota en Markdown"
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
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--favorite"
            title={
              note.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
            aria-label={
              note.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
            aria-pressed={note.is_favorite === true}
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
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--danger"
            title="Eliminar nota"
            aria-label="Eliminar nota"
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
