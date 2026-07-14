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
      className="group bg-zinc-900/70 rounded-2xl border border-zinc-800/40 hover:bg-zinc-800/30 hover:border-zinc-700/40 hover:-translate-y-[1px] transition-all duration-180 ease-out p-6 flex flex-col h-full relative cursor-pointer"
      onClick={() => onExpand(comparison)}
    >
      {/* Cinta de ganador */}
      {winner && winnerModel && (
        <div className="w-full h-7 bg-emerald-950/40 border-b border-emerald-800/30 text-emerald-400 text-[11px] font-medium flex items-center gap-1.5 px-4 -mt-6 -mx-6 mb-5 rounded-t-2xl shrink-0">
          <span className="material-symbols-outlined text-[14px]">
            emoji_events
          </span>
          Ganador · {winnerModel}
        </div>
      )}

      {/* Prompt */}
      <h3 className="text-[17px] font-semibold text-zinc-100 leading-tight mb-5 line-clamp-2">
        {prompt}
      </h3>

      {/* Separador */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-zinc-800/30" />
        <span className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">
          Respuestas
        </span>
        <div className="h-px flex-1 bg-zinc-800/30" />
      </div>

      {/* Comparación en dos columnas */}
      <div className="grid grid-cols-2 gap-3 flex-grow mb-5">
        {/* Modelo 1 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:bg-zinc-800/20 transition-all duration-180 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] font-medium text-zinc-500">
              {responses.model1 || "Modelo 1"}
            </span>
          </div>
          <p className="text-xs text-zinc-500/80 leading-relaxed line-clamp-4 flex-grow">
            {truncate(responses.response1, 100)}
          </p>
        </div>

        {/* Modelo 2 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:bg-zinc-800/20 transition-all duration-180 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] font-medium text-zinc-500">
              {responses.model2 || "Modelo 2"}
            </span>
          </div>
          <p className="text-xs text-zinc-500/80 leading-relaxed line-clamp-4 flex-grow">
            {truncate(responses.response2, 100)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/30">
        {/* Fecha a la izquierda */}
        <span className="text-[10px] text-zinc-700">
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
            className="p-[3px] rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all duration-180"
            title="Copiar en Markdown"
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
            className="p-[3px] rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800/60 transition-all duration-180"
            title="Eliminar comparación"
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
