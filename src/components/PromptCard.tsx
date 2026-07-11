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

// Mapeo de categorías a colores para los badges
const categoryColors: Record<string, string> = {
  imagen:
    "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/30",
  texto:
    "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/30",
  codigo:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/30",
  video:
    "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300 border-red-200/50 dark:border-red-800/30",
  mcp: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/30",
  otro: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/30 dark:text-zinc-300 border-zinc-200/50 dark:border-zinc-800/30",
};

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onCopy,
  index = 0,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    onCopy(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const colorClass = categoryColors[prompt.category] || categoryColors.otro;

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/80 p-5 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] justify-between min-h-[200px] overflow-hidden animate-fade-in-up cursor-pointer"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onEdit(prompt)}
    >
      {/* Efectos visuales (igual que NoteCard) */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-blue-500/20 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Cabecera: Categoría + Etiquetas + Botones */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold border ${colorClass}`}
            >
              {prompt.category}
            </span>
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {prompt.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-50 to-blue-100/80 dark:from-blue-950/50 dark:to-blue-900/30 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30"
                  >
                    <span className="text-[8px]">#</span>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={() => onEdit(prompt)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all duration-200"
              title="Editar prompt"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(prompt.id)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
              title="Eliminar prompt"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {prompt.title}
        </h3>

        {/* Contenido del prompt (truncado) */}
        <div
          className="mt-2 cursor-pointer group/content"
          onClick={() => onEdit(prompt)}
        >
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 overflow-hidden leading-relaxed group-hover/content:text-zinc-700 dark:group-hover/content:text-zinc-300 transition-colors duration-300">
            {prompt.content}
          </p>
        </div>
      </div>

      {/* Pie de tarjeta: Usos + fecha + botón copiar */}
      <div className="relative z-10 mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            {prompt.times_used}
          </span>
          <span>
            {new Date(prompt.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <button
          onClick={() => onCopy(prompt)}
          className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
            />
          </svg>
          Copiar
        </button>
      </div>
    </div>
  );
}
