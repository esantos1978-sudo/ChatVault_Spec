"use client";

import { useState } from "react";
import toast from "react-hot-toast";

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
  onViewDetails?: (prompt: any) => void;
  index?: number;
}

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onCopy,
  onToggleFavorite,
  onViewDetails,
  index = 0,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group bg-zinc-900/70 rounded-2xl border border-zinc-800/40 hover:bg-zinc-800/30 hover:border-zinc-700/40 transition-all duration-180 ease-out p-6 flex flex-col h-full relative cursor-pointer"
      onClick={() => onEdit(prompt)}
    >
      {/* Badge de categoría */}
      <div className="mb-5">
        {(() => {
          const categoryConfig: Record<
            string,
            { style: string; label: string }
          > = {
            texto: {
              style:
                "bg-blue-950/20 border-blue-800/20 text-blue-300 hover:bg-blue-950/30",
              label: "Texto",
            },
            imagen: {
              style:
                "bg-fuchsia-950/20 border-fuchsia-800/20 text-fuchsia-300 hover:bg-fuchsia-950/30",
              label: "Imagen",
            },
            video: {
              style:
                "bg-rose-950/20 border-rose-800/20 text-rose-300 hover:bg-rose-950/30",
              label: "Video",
            },
            codigo: {
              style:
                "bg-emerald-950/20 border-emerald-800/20 text-emerald-300 hover:bg-emerald-950/30",
              label: "Código",
            },
          };
          const key = prompt.category.toLowerCase();
          const config = categoryConfig[key] || {
            style:
              "bg-zinc-800/30 border-zinc-700/30 text-zinc-400 hover:bg-zinc-800/40",
            label: prompt.category,
          };
          return (
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium border transition-all duration-180 ${config.style}`}
            >
              {config.label}
            </span>
          );
        })()}
      </div>

      {/* Título */}
      <h3 className="text-[17px] font-bold text-white leading-tight mb-5 line-clamp-1">
        {prompt.title}
      </h3>

      {/* Preview del prompt */}
      <p className="text-sm text-zinc-500/80 leading-[1.65] flex-grow mb-5 line-clamp-3">
        {prompt.content}
      </p>

      {/* Footer: Tags + Acciones */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/30">
        {/* Tags a la izquierda */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {prompt.tags && prompt.tags.length > 0 ? (
            prompt.tags.slice(0, 2).map((t) => (
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
          {prompt.tags && prompt.tags.length > 2 && (
            <span className="text-[9px] text-zinc-700 shrink-0">
              +{prompt.tags.length - 2}
            </span>
          )}
        </div>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-0 shrink-0">
          {/* Usos */}
          <span className="text-[10px] text-zinc-700 mr-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">bolt</span>
            {prompt.times_used}
          </span>

          {/* Fecha */}
          <span className="text-[10px] text-zinc-700 mr-3">
            {new Date(prompt.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>

          {/* Ver detalles */}
          {onViewDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(prompt);
              }}
              className="p-[3px] rounded-lg text-zinc-600 hover:text-sky-400 hover:bg-zinc-800/60 transition-all duration-180"
              title="Ver detalles y relaciones"
            >
              <span className="material-symbols-outlined text-[16px]">
                visibility
              </span>
            </button>
          )}

          {/* Copiar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="p-[3px] rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all duration-180"
            title="Copiar prompt"
          >
            <span className="material-symbols-outlined text-[16px]">
              content_copy
            </span>
          </button>

          {/* Favorito */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt.id, !prompt.is_favorite);
            }}
            className="p-[3px] rounded-lg text-zinc-600 hover:text-amber-400 hover:bg-zinc-800/60 transition-all duration-180"
            title={
              prompt.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{
                fontVariationSettings: prompt.is_favorite
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
              onDelete(prompt.id);
            }}
            className="p-[3px] rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800/60 transition-all duration-180"
            title="Eliminar prompt"
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
