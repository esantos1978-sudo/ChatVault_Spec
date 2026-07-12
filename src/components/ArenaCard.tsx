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
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const truncate = (text: string, maxLength: number = 120) => {
    if (!text) return "Respuesta vacía";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const isWinner1 = winner === "model1";
  const isWinner2 = winner === "model2";

  return (
    <div
      className="group bg-surface-container border border-primary/40 rounded-2xl p-6 hover:border-primary/70 hover:bg-primary/10 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden cursor-pointer"
      onClick={() => onExpand(comparison)}
    >
      {/* Badge de ganador */}
      {winner && winnerLabel && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 mb-4">
          <span className="material-symbols-outlined text-[14px]">
            emoji_events
          </span>
          Ganador: {winnerLabel}
        </div>
      )}

      {/* Prompt */}
      <h3 className="font-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors text-base font-semibold line-clamp-2">
        {prompt}
      </h3>

      {/* Comparación en dos columnas */}
      <div className="grid grid-cols-2 gap-3 flex-grow mb-4">
        <div
          className={`p-3 rounded-xl border ${
            isWinner1
              ? "bg-emerald-500/5 border-emerald-500/30"
              : "bg-surface-container-high/50 border-outline-variant/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-primary/80">
              🤖 {responses.model1 || "Modelo 1"}
            </span>
            {isWinner1 && (
              <span className="text-[10px] text-emerald-400">🏆</span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant/70 line-clamp-3 leading-relaxed">
            {expanded ? responses.response1 : truncate(responses.response1, 80)}
          </p>
        </div>

        <div
          className={`p-3 rounded-xl border ${
            isWinner2
              ? "bg-emerald-500/5 border-emerald-500/30"
              : "bg-surface-container-high/50 border-outline-variant/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-primary/80">
              🤖 {responses.model2 || "Modelo 2"}
            </span>
            {isWinner2 && (
              <span className="text-[10px] text-emerald-400">🏆</span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant/70 line-clamp-3 leading-relaxed">
            {expanded ? responses.response2 : truncate(responses.response2, 80)}
          </p>
        </div>
      </div>

      {/* Pie de tarjeta */}
      <div className="flex items-center justify-between pt-3 border-t border-primary/15">
        <div className="flex items-center gap-1.5 text-on-surface-variant/50">
          <span className="material-symbols-outlined text-[14px]">
            calendar_today
          </span>
          <span className="font-label-sm text-[11px]">
            {new Date(comparison.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleExpand}
            className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-bold transition-colors"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(comparison.id);
            }}
            className="p-1.5 rounded-lg text-on-surface-variant/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
