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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(9, 9, 11, 0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-zinc-900 shadow-premium border border-zinc-800/40 my-8 animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-5 pt-5 pb-3 border-b border-zinc-800/30 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
              Comparación detallada
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800/40 transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-zinc-400 group-hover:text-zinc-100 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="px-5 py-5 space-y-6">
          {/* Prompt asociado */}
          <div>
            <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-2 block">
              Prompt asociado
            </span>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-sm text-zinc-100 leading-relaxed">
              {prompt}
            </div>
          </div>

          {/* Respuestas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Modelo 1 */}
            <div
              className={`rounded-xl border p-4 transition-all ${
                isWinner1
                  ? "bg-emerald-950/10 border-emerald-800/40"
                  : "bg-zinc-900 border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-zinc-100">
                  {responses.model1 || "Modelo 1"}
                </h3>
                {isWinner1 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-[10px] font-medium">
                    <span className="material-symbols-outlined text-[12px]">
                      emoji_events
                    </span>
                    Ganador
                  </span>
                )}
              </div>
              <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {responses.response1 || "Respuesta vacía"}
              </div>
            </div>

            {/* Modelo 2 */}
            <div
              className={`rounded-xl border p-4 transition-all ${
                isWinner2
                  ? "bg-emerald-950/10 border-emerald-800/40"
                  : "bg-zinc-900 border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-zinc-100">
                  {responses.model2 || "Modelo 2"}
                </h3>
                {isWinner2 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-[10px] font-medium">
                    <span className="material-symbols-outlined text-[12px]">
                      emoji_events
                    </span>
                    Ganador
                  </span>
                )}
              </div>
              <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {responses.response2 || "Respuesta vacía"}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 pb-5 pt-4 border-t border-zinc-800/30 flex items-center justify-between">
          <span className="text-[10px] text-zinc-700">
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
            className="text-sm font-medium text-zinc-500 hover:text-zinc-400 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
