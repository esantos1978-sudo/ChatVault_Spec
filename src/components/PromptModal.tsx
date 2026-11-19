"use client";

import { useState, useRef, useEffect } from "react";

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
  { value: "imagen", label: "Imagen" },
  { value: "texto", label: "Texto" },
  { value: "codigo", label: "Código" },
  { value: "video", label: "Video" },
];

/* Piel de los campos: .kl-input (44px) y .kl-input--area (textarea). La
   tipografía/tokens llegan del scope .kl-portal del contenedor del modal. */
const inputClass = "kl-input";

const textareaClass = "kl-input kl-input--area";

const labelClass = "kl-field-label mb-1.5 block";

// ============================================================
// POPOVER COMPONENTE REUTILIZABLE
// ============================================================
function PopoverSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedLabel = options.find((o) => o.value === value)?.label || value;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="kl-input flex items-center justify-between gap-2 text-left"
      >
        <span className={value ? undefined : "kl-text-muted"}>
          {value ? selectedLabel : placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {open && (
        <div className="kl-popover absolute z-30 mt-1 w-full py-1 max-h-64 overflow-hidden flex flex-col">
          <div className="px-2 pb-1 pt-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder || "Buscar..."}
              className="kl-input kl-input--sm"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <div className="kl-popover-empty px-3 py-3 text-center">
                Sin resultados
              </div>
            )}
            {filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={`kl-popover-item w-full px-3 py-1.5 text-left flex items-center justify-between ${
                  value === option.value ? "kl-popover-item--active" : ""
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.value,
    label: c.label,
  }));

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
        aria-labelledby="prompt-modal-title"
        className="kl-modal w-[calc(100%-2rem)] sm:w-full max-w-3xl my-8 max-h-[90dvh] overflow-y-auto animate-zoom-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="kl-modal-header sticky top-0 z-10 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="prompt-modal-title" className="kl-modal-title text-xl">
              {editingId ? "Editar Prompt" : "Nuevo Prompt"}
            </h2>
            <p className="kl-modal-sub mt-1">
              {editingId
                ? "Modifica los datos de este prompt"
                : "Crea prompts reutilizables para tus conversaciones"}
            </p>
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
              className="w-5 h-5"
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
        <div className="px-5 sm:px-6 py-5 space-y-5 flex-1">
          {/* Título */}
          <div>
            <label className={labelClass}>Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Generar imágenes de paisajes realistas"
              className="kl-input kl-input--title"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className={labelClass}>Categoría</label>
            <PopoverSelect
              value={category}
              onChange={(val) => setCategory(val)}
              options={categoryOptions}
              placeholder="Seleccionar categoría..."
              searchPlaceholder="Buscar categoría..."
            />
          </div>

          {/* Contenido del Prompt */}
          <div>
            <label className={labelClass}>Prompt</label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el prompt que quieres guardar para futuras conversaciones..."
              className={`${textareaClass} resize-none min-h-[160px]`}
            />
          </div>

          {/* DIVISOR */}
          <div className="kl-divider" />

          {/* ETIQUETAS */}
          <div>
            <label className={labelClass}>Etiquetas</label>

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
                placeholder="creatividad, diseño, ilustración"
                className={inputClass}
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="kl-popover absolute z-20 mt-1 w-full max-h-48 overflow-y-auto py-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => addSuggestion(index)}
                      className={`kl-popover-item w-full px-3 py-1.5 text-left ${
                        index === selectedSuggestion
                          ? "kl-popover-item--active"
                          : ""
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="kl-text-muted">#</span>
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t, idx) => (
                    <span key={idx} className="kl-chip gap-1">
                      #{t}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = tags.filter((_, i) => i !== idx);
                          setTags(newTags);
                          setTagsInput(newTags.join(", "));
                        }}
                        aria-label={`Quitar etiqueta ${t}`}
                        className="kl-tag-remove"
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

        {/* FOOTER */}
        <div className="kl-modal-footer sticky bottom-0 px-5 sm:px-6 pb-5 sm:pb-6 pt-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="kl-btn kl-btn--ghost"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="kl-btn kl-btn--primary w-full sm:w-auto"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
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
              "Guardar Prompt"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
