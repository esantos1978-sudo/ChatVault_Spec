"use client";

interface ArenaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  } | null;
}

export function ArenaDetailModal({
  isOpen,
  onClose,
  comparison,
}: ArenaDetailModalProps) {
  if (!isOpen || !comparison) return null;

  const { prompt, responses, winner } = comparison;

  const isWinner1 = winner === "model1";
  const isWinner2 = winner === "model2";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-zinc-800/50 p-6 md:p-8 animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              🥊 Comparación detallada
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
              Prompt: {prompt}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* CONTENIDO: Dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MODELO 1 */}
          <div
            className={`rounded-xl border p-5 transition-all ${
              isWinner1
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/50 shadow-md shadow-emerald-500/10"
                : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {responses.model1 || "Modelo 1"}
              </span>
              {isWinner1 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-medium border border-emerald-200/50 dark:border-emerald-800/30">
                  🏆 Ganador
                </span>
              )}
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {responses.response1 || "Respuesta vacía"}
              </p>
            </div>
          </div>

          {/* MODELO 2 */}
          <div
            className={`rounded-xl border p-5 transition-all ${
              isWinner2
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/50 shadow-md shadow-emerald-500/10"
                : "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-800/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {responses.model2 || "Modelo 2"}
              </span>
              {isWinner2 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-medium border border-emerald-200/50 dark:border-emerald-800/30">
                  🏆 Ganador
                </span>
              )}
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {responses.response2 || "Respuesta vacía"}
              </p>
            </div>
          </div>
        </div>

        {/* PIE */}
        <div className="mt-6 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-xs text-zinc-400">
          <span>
            Comparación creada el{" "}
            {new Date(comparison.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
