"use client";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  setTitle: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  tags: string[];
  tagsInput: string;
  setTagsInput: (val: string) => void;
  setTags: (val: string[]) => void;
  saving: boolean;
  allTags: string[];
  suggestions: string[];
  showSuggestions: boolean;
  selectedSuggestion: number;
  addSuggestion: (index: number) => void;
  setSuggestions: (val: string[]) => void;
  setShowSuggestions: (val: boolean) => void;
  setSelectedSuggestion: (val: number | ((prev: number) => number)) => void;
  editingId?: string | null;
}

const CATEGORIES = [
  { value: "imagen", label: "🖼️ Imagen" },
  { value: "texto", label: "📝 Texto" },
  { value: "codigo", label: "💻 Código" },
  { value: "video", label: "🎬 Video" },
  { value: "mcp", label: "🔌 MCP" },
  { value: "otro", label: "📂 Otro" },
];

export default function PromptModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  content,
  setContent,
  category,
  setCategory,
  tags,
  tagsInput,
  setTagsInput,
  setTags,
  saving,
  allTags,
  suggestions,
  showSuggestions,
  selectedSuggestion,
  addSuggestion,
  setSuggestions,
  setShowSuggestions,
  setSelectedSuggestion,
  editingId,
}: PromptModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
    >
      <div className="w-full max-w-3xl rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-zinc-800/50 p-6 md:p-8 my-8 max-h-[90vh] overflow-y-auto animate-zoom-in">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {editingId
                ? "✏️ Editar prompt"
                : "📚 Guardar prompt reutilizable"}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {editingId
                ? "Modifica los datos de este prompt"
                : "Crea prompts que puedas usar una y otra vez en tus conversaciones"}
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

        {/* CONTENIDO DEL MODAL */}
        <div className="space-y-5">
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              📌 Titulo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Generar imágenes de paisajes realistas"
              className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              📂 CATEGORIA
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* ETIQUETAS */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              🏷️ Etiquetas
            </label>
            <div className="relative">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  setTagsInput(raw);

                  if (raw.includes(",")) {
                    const array = raw
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t.length > 0);
                    setTags(array);
                  }

                  const lastTag = raw.split(",").pop()?.trim() || "";
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
                  } else if (e.key === "Enter") {
                    e.preventDefault();

                    if (
                      selectedSuggestion >= 0 &&
                      selectedSuggestion < suggestions.length
                    ) {
                      addSuggestion(selectedSuggestion);
                      return;
                    }

                    const raw = tagsInput.trim();
                    if (raw) {
                      const cleanTags = raw
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t.length > 0);

                      if (cleanTags.length > 0) {
                        const allTags = [...tags, ...cleanTags];
                        const uniqueTags = Array.from(new Set(allTags));
                        setTags(uniqueTags);
                        setTagsInput(uniqueTags.join(", "));
                        setShowSuggestions(false);
                        setSelectedSuggestion(-1);
                      }
                    }
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
                placeholder="Ej: creatividad, diseño, ilustración"
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
                          {allTags.filter((t) => t === suggestion).length} usos
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
          {/* Contenido del Prompt */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              📝 Prompt
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el prompt que quieres guardar para futuras conversaciones..."
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
            disabled={saving}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 flex items-center gap-2 gemstone-gradient shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]`}
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
            ) : (
              <>
                <span>💾</span>
                Guardar prompt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
