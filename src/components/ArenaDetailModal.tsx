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
      className="kl-portal kl-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="arena-detail-title"
        className="kl-modal w-[calc(100%-2rem)] sm:w-full max-w-4xl my-8 max-h-[90dvh] overflow-y-auto animate-zoom-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="kl-modal-header sticky top-0 z-10 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="arena-detail-title" className="kl-modal-title text-lg">
              Comparación detallada
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="kl-icon-btn shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
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

        {/* CONTENIDO */}
        <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-6 sm:space-y-8 flex-1">
          {/* Prompt asociado */}
          <div>
            <span className="kl-eyebrow kl-eyebrow--xs mb-2 block">
              Prompt asociado
            </span>
            <div className="kl-panel px-4 py-3.5 kl-card-text whitespace-pre-wrap">
              {prompt}
            </div>
          </div>

          {/* Respuestas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Modelo 1 */}
            <div className={`kl-card p-4 ${isWinner1 ? "kl-arena-winner" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="kl-card-title text-sm">
                  {responses.model1 || "Modelo 1"}
                </h3>
                {isWinner1 && (
                  <span className="kl-chip kl-chip--win gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      emoji_events
                    </span>
                    Ganador
                  </span>
                )}
              </div>
              <div className="kl-card-text whitespace-pre-wrap">
                {responses.response1 || "Respuesta vacía"}
              </div>
            </div>

            {/* Modelo 2 */}
            <div className={`kl-card p-4 ${isWinner2 ? "kl-arena-winner" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="kl-card-title text-sm">
                  {responses.model2 || "Modelo 2"}
                </h3>
                {isWinner2 && (
                  <span className="kl-chip kl-chip--win gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      emoji_events
                    </span>
                    Ganador
                  </span>
                )}
              </div>
              <div className="kl-card-text whitespace-pre-wrap">
                {responses.response2 || "Respuesta vacía"}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="kl-modal-footer sticky bottom-0 px-5 sm:px-6 pb-5 sm:pb-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="kl-meta">
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
            className="kl-btn kl-btn--ghost w-full sm:w-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
