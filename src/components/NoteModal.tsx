"use client";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  setTitle: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  tags: string[];
  tagsInput: string;
  setTagsInput: (val: string) => void;
  setTags: (val: string[]) => void;
  aiModel: string;
  setAiModel: (val: string) => void;
  sourceType: "text" | "url" | "file";
  setSourceType: (val: "text" | "url" | "file") => void;
  sourceUrl: string;
  setSourceUrl: (val: string) => void;
  saving: boolean;
  allTags: string[];
  suggestions: string[];
  showSuggestions: boolean;
  selectedSuggestion: number;
  addSuggestion: (index: number) => void;
  setSuggestions: (val: string[]) => void;
  setShowSuggestions: (val: boolean) => void;
  setSelectedSuggestion: (val: number | ((prev: number) => number)) => void;
  editingTitle?: string;
  editingNoteId?: string | null;
}

export function NoteModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  content,
  setContent,
  summary,
  setSummary,
  tags,
  tagsInput,
  setTagsInput,
  setTags,
  aiModel,
  setAiModel,
  sourceType,
  setSourceType,
  sourceUrl,
  setSourceUrl,
  saving,
  allTags,
  suggestions,
  showSuggestions,
  selectedSuggestion,
  addSuggestion,
  setSuggestions,
  setShowSuggestions,
  setSelectedSuggestion,
  editingTitle,
  editingNoteId,
}: NoteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
    >
      <div
        className="w-full max-w-4xl rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-zinc-800/50 p-8 my-8 animate-in fade-in zoom-in-95 duration-200"
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {editingTitle
                ? "✏️ Editar Historial"
                : "📝 Guardar Historial de IA"}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {editingTitle
                ? "Modifica los datos de esta conversación"
                : "Archiva tus chats con IA de forma organizada"}
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

        {/* PESTAÑAS */}
        <div className="mb-6 flex gap-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <button
            type="button"
            onClick={() => setSourceType("text")}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 ${
              sourceType === "text"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              ✍️ Texto Copiado
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSourceType("url")}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 ${
              sourceType === "url"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              🔗 Enlace del Chat
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSourceType("file")}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 ${
              sourceType === "file"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              📄 Subir Archivo
            </span>
          </button>
        </div>

        {/* CONTENIDO DEL MODAL */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* MODELO IA */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                🤖 Modelo de IA
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
              >
                <option value="DeepSeek-R1">🧠 DeepSeek-R1</option>
                <option value="ChatGPT-4o">💬 ChatGPT-4o</option>
                <option value="Claude-3.5-Sonnet">🔮 Claude 3.5 Sonnet</option>
                <option value="Gemini-1.5-Pro">✨ Gemini 1.5 Pro</option>
                <option value="Llama-3">🦙 Llama 3 (Meta)</option>
              </select>
            </div>

            {/* ETIQUETAS */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                🏷️ Etiquetas (separadas por comas)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setTagsInput(raw);
                    const array = raw
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t.length > 0);
                    setTags(array);
                    const lastTag =
                      array.length > 0 ? array[array.length - 1] : "";
                    if (lastTag.length > 0) {
                      const filtered = allTags.filter((t) =>
                        t.toLowerCase().includes(lastTag.toLowerCase()),
                      );
                      setSuggestions(filtered);
                      setShowSuggestions(filtered.length > 0);
                    } else {
                      setShowSuggestions(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setSelectedSuggestion((prev: number) =>
                        prev < suggestions.length - 1 ? prev + 1 : prev,
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setSelectedSuggestion((prev: number) =>
                        prev > 0 ? prev - 1 : -1,
                      );
                    } else if (e.key === "Enter" && selectedSuggestion >= 0) {
                      e.preventDefault();
                      addSuggestion(selectedSuggestion);
                    } else if (e.key === "Escape") {
                      setShowSuggestions(false);
                      setSelectedSuggestion(-1);
                    }
                  }}
                  onFocus={() => {
                    if (tagsInput.length > 0) {
                      const lastTag = tagsInput.split(",").pop()?.trim() || "";
                      if (lastTag.length > 0) {
                        const filtered = allTags.filter((t) =>
                          t.toLowerCase().includes(lastTag.toLowerCase()),
                        );
                        setSuggestions(filtered);
                        setShowSuggestions(filtered.length > 0);
                      }
                    }
                  }}
                  placeholder="Ej: programacion, deepseek, fix"
                  className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
                />

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg py-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => addSuggestion(index)}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          index === selectedSuggestion
                            ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="text-[10px] text-zinc-400">#</span>
                          {suggestion}
                          <span className="text-[10px] text-zinc-400 ml-auto">
                            {allTags.filter((t) => t === suggestion).length}{" "}
                            notas
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = tags.filter((_, i) => i !== idx);
                            setTags(newTags);
                            setTagsInput(newTags.join(", "));
                          }}
                          className="hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CAMPOS DINÁMICOS SEGÚN TIPO DE FUENTE */}
          {sourceType === "text" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  📌 Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Fix del bug de autenticación..."
                  className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  💬 Contenido del Chat
                </label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Usuario: ¿Cómo arreglo este error?..."
                  className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200 resize-none"
                />
              </div>
            </div>
          )}

          {sourceType === "url" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-blue-50/80 dark:bg-blue-950/20 p-4 border border-blue-100 dark:border-blue-800/30">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>Opcional:</strong> Deja el título vacío y nuestro
                  servidor extraerá automáticamente el nombre del chat.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  📌 Título personalizado
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Mi chat sobre arquitectura"
                  className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  🔗 URL del Chat
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://chat.deepseek.com/a/chat/..."
                  className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
                />
              </div>
            </div>
          )}

          {sourceType === "file" && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30 p-12">
              <span className="text-4xl mb-3">🛠️</span>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Módulo de lectura en desarrollo
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Soporte para PDFs, TXT y documentos en el próximo asalto.
              </p>
            </div>
          )}

          {/* RESUMEN */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              📋 Resumen del hilo
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Resume los puntos clave o conclusiones del chat con la IA..."
              className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200 resize-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 pt-5 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={saving || sourceType === "file"}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 flex items-center gap-2 ${
              sourceType === "file"
                ? "bg-zinc-400 dark:bg-zinc-700 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            }`}
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : sourceType === "file" ? (
              "Próximamente 🛠️"
            ) : (
              <>
                <span>🚀</span>
                Guardar Conversación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
