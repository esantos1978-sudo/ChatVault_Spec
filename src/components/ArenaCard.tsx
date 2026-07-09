"use client";

import { useState } from "react";

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
  const [expanded, setExpanded] = useState(false);
  const { prompt, responses, winner } = comparison;

  const winnerLabel =
    winner === "model1"
      ? responses.model1
      : winner === "model2"
        ? responses.model2
        : null;

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se abra el modal al hacer clic en "Ver más"
    setExpanded(!expanded);
  };

  // Truncar respuestas largas
  const truncate = (text: string, maxLength: number = 120) => {
    if (!text) return "Respuesta vacía";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/80 p-5 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] justify-between min-h-[280px] overflow-hidden animate-fade-in-up cursor-pointer"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onExpand(comparison)}
    >
      {/* Efectos visuales */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-purple-500/20 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Prompt y botón eliminar */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 flex-1">
            {prompt}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita que se abra el modal al eliminar
              onDelete(comparison.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
            title="Eliminar comparación"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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

        {/* 🏆 BADGE DEL GANADOR */}
        {winner && winnerLabel && (
          <div className="mt-1 mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200/80 dark:from-emerald-950/50 dark:to-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/50 dark:border-emerald-800/30 shadow-sm">
            🏆 Ganador: {winnerLabel}
          </div>
        )}

        {/* Comparación en dos columnas */}
        <div className="mt-2 grid grid-cols-2 gap-3">
          {/* Modelo 1 */}
          <div
            className={`p-3 rounded-xl border transition-all duration-200 ${
              winner === "model1"
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/50 shadow-md shadow-emerald-500/10"
                : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                {responses.model1 || "Modelo 1"}
              </span>
              {winner === "model1" && (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30">
                  🏆
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {expanded
                ? responses.response1
                : truncate(responses.response1, 120)}
            </p>
          </div>

          {/* Modelo 2 */}
          <div
            className={`p-3 rounded-xl border transition-all duration-200 ${
              winner === "model2"
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/50 shadow-md shadow-emerald-500/10"
                : "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-700/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                {responses.model2 || "Modelo 2"}
              </span>
              {winner === "model2" && (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30">
                  🏆
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {expanded
                ? responses.response2
                : truncate(responses.response2, 120)}
            </p>
          </div>
        </div>

        {/* Botón Ver más */}
        <button
          onClick={toggleExpand}
          className="mt-3 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200 hover:underline"
        >
          {expanded ? "📕 Ver menos" : "📖 Ver respuesta completa"}
        </button>
      </div>

      {/* Pie de tarjeta */}
      <div className="relative z-10 mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-400">
        <span>
          {new Date(comparison.created_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span className="text-[10px] text-zinc-400/60">
          Click para ver completo
        </span>
      </div>
    </div>
  );
}
