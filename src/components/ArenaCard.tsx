"use client";

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
    created_at: string;
  };
  onDelete: (id: string) => void;
  index?: number;
}

export function ArenaCard({ comparison, onDelete, index = 0 }: ArenaCardProps) {
  const { prompt, responses } = comparison;

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/80 p-5 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] justify-between min-h-[220px] overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Efectos visuales */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-blue-500/20 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Título o Prompt (truncado) */}
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {prompt}
        </h3>

        {/* Comparación en dos columnas */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50">
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              {responses.model1 || "Modelo 1"}
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 mt-1">
              {responses.response1}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50">
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              {responses.model2 || "Modelo 2"}
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 mt-1">
              {responses.response2}
            </p>
          </div>
        </div>
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
        <button
          onClick={() => onDelete(comparison.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
