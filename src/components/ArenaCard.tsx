"use client";

import toast from "react-hot-toast";

interface ArenaCardProps {
  comparison: {
    id: string;
    prompt: string;
    responses: {
      model1: string;
      response1: string;
      model2: string;
      response2: string;
    };
    winner?: string | null;
    created_at: string;
  };
  onDelete: (id: string) => void;
  onExpand: (comparison: any) => void;
  index?: number;
}

export function ArenaCard({
  comparison,
  onDelete,
  onExpand,
  index = 0,
}: ArenaCardProps) {
  const { prompt, responses, winner } = comparison;

  const winnerModel =
    winner === "model1"
      ? responses.model1
      : winner === "model2"
        ? responses.model2
        : null;

  const truncate = (text: string, maxLength: number = 120) => {
    if (!text) return "Respuesta vacía";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      className="kl-card kl-card--interactive group p-6 flex flex-col h-full relative cursor-pointer overflow-hidden"
      onClick={() => onExpand(comparison)}
    >
      {/* Cinta de ganador */}
      {winner && winnerModel && (
        <div className="kl-arena-ribbon w-full h-7 text-[11px] font-medium flex items-center gap-1.5 px-4 -mt-6 -mx-6 mb-5 shrink-0">
          <span className="material-symbols-outlined text-[14px]">
            emoji_events
          </span>
          Ganador · {winnerModel}
        </div>
      )}

      {/* Prompt */}
      <h3 className="kl-card-title text-[17px] leading-tight mb-5 line-clamp-2">
        {prompt}
      </h3>

      {/* Separador */}
      <div className="flex items-center gap-3 mb-4">
        <div className="kl-divider flex-1" />
        <span className="kl-card-label">Respuestas</span>
        <div className="kl-divider flex-1" />
      </div>

      {/* Comparación en dos columnas */}
      <div className="grid grid-cols-2 gap-3 flex-grow mb-5">
        {/* Modelo 1 */}
        <div className="kl-panel p-3 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="kl-panel-title">
              {responses.model1 || "Modelo 1"}
            </span>
          </div>
          <p className="kl-panel-text line-clamp-4 flex-grow">
            {truncate(responses.response1, 100)}
          </p>
        </div>

        {/* Modelo 2 */}
        <div className="kl-panel p-3 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="kl-panel-title">
              {responses.model2 || "Modelo 2"}
            </span>
          </div>
          <p className="kl-panel-text line-clamp-4 flex-grow">
            {truncate(responses.response2, 100)}
          </p>
        </div>
      </div>

      {/* Separador (1px + 16px = mismo hueco que el antiguo pt-4 border-t) */}
      <div className="kl-divider mt-4" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Fecha a la izquierda */}
        <span className="kl-meta">
          {new Date(comparison.created_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-0 shrink-0">
          {/* Copiar MD */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const markdown = `# Comparación: ${comparison.prompt}\n\n## ${comparison.responses.model1}\n${comparison.responses.response1}\n\n## ${comparison.responses.model2}\n${comparison.responses.response2}\n\n**Ganador:** ${comparison.winner === "model1" ? comparison.responses.model1 : comparison.winner === "model2" ? comparison.responses.model2 : "No definido"}\n\n---\n*Copiado desde Kimberlite*`;
              navigator.clipboard.writeText(markdown);
              toast.success("Comparación copiada en Markdown");
            }}
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--success"
            title="Copiar en Markdown"
            aria-label="Copiar comparación en Markdown"
          >
            <span className="material-symbols-outlined text-[16px]">
              content_copy
            </span>
          </button>

          {/* Eliminar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(comparison.id);
            }}
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--danger"
            title="Eliminar comparación"
            aria-label="Eliminar comparación"
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
