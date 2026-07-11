"use client";

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
    prompt_id?: string; // 👈 Referencia al prompt
    prompts?: { title: string }; // 👈 Relación de Supabase
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
  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/80 p-5 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] justify-between min-h-[240px] overflow-hidden animate-fade-in-up cursor-pointer"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onEdit(note)}
    >
      {/* Efecto de brillo */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-blue-500/20 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Cabecera: IA + Etiquetas + Botones */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-zinc-100 to-zinc-200/80 dark:from-zinc-800 dark:to-zinc-700/80 px-3 py-1 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {note.ai_model || "Desconocido"}
            </span>
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {note.tags.map((t) => (
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
            {/* ⭐ BOTÓN DE FAVORITOS */}
            <button
              onClick={() => onToggleFavorite(note.id, !note.is_favorite)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
              title={
                note.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={note.is_favorite ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-3.5 h-3.5 ${note.is_favorite ? "text-yellow-400" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z"
                />
              </svg>
            </button>

            {/* Editar */}
            <button
              onClick={() => onEdit(note)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all duration-200"
              title="Editar nota"
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

            {/* Eliminar */}
            <button
              onClick={() => onDelete(note.id)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
              title="Eliminar nota"
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
          {note.title}
        </h3>

        {/* 🔗 PROMPT ASOCIADO - Justo debajo del título */}
        {note.prompts?.title && (
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-[10px] font-medium border border-purple-200/50 dark:border-purple-800/30">
            🔗 {note.prompts.title}
          </div>
        )}

        {/* Resumen */}
        {note.summary && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-50/80 to-amber-100/40 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/30">
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 font-medium line-clamp-2 leading-relaxed">
              {note.summary}
            </p>
          </div>
        )}

        {/* Contenido clickeable */}
        <div
          onClick={() => onEdit(note)}
          className="cursor-pointer mt-3 group/content"
        >
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 overflow-hidden leading-relaxed group-hover/content:text-zinc-700 dark:group-hover/content:text-zinc-300 transition-colors duration-300">
            {note.content}
          </p>
        </div>
      </div>

      {/* Pie de tarjeta */}
      <div className="relative z-10 mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-400">
        <div className="flex items-center gap-1.5">
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
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span>
            {new Date(note.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {note.source_url && (
          <a
            href={note.source_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-all duration-200"
          >
            <span>Ver enlace</span>
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
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
