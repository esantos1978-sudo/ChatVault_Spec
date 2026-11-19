"use client";

import { useState, useRef, useEffect } from "react";
import ConversationContent from "./ConversationContent";

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
  editingNoteId?: string | null;
  // Props para selector de prompts
  prompts: { id: string; title: string }[];
  selectedPromptId: string | null;
  setSelectedPromptId: (id: string | null) => void;
  // Props para carga de archivos
  fileContent: string;
  setFileContent: (val: string) => void;
  fileName: string;
  setFileName: (val: string) => void;
}

/* Piel de los campos: .kl-input (44px) y .kl-input--area (textarea). La
   tipografía/tokens llegan del scope .kl-portal del contenedor del modal. */
const inputClass = "kl-input";

const textareaClass = "kl-input kl-input--area";

const labelClass = "kl-field-label mb-1.5 block";

// ============================================================
// MODELOS DE IA DISPONIBLES
// ============================================================
const AI_MODELS = [
  "ChatGPT-4o",
  "ChatGPT-4o-mini",
  "ChatGPT-o1",
  "ChatGPT-o3-mini",
  "Claude 3.5 Sonnet",
  "Claude 3.7 Sonnet",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
  "Gemini 2.5 Pro",
  "DeepSeek-R1",
  "DeepSeek-V3",
  "Llama 3",
  "Llama 3.1",
  "Llama 4",
  "Mistral Large",
  "Mistral Small",
  "Grok-2",
  "Grok-3",
  "Perplexity Sonar",
  "Perplexity Pro",
];

// ============================================================
// POPOVER COMPONENTE REUTILIZABLE
// ============================================================
function PopoverSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  allowCustom,
  customValue,
  onCustomChange,
  onCustomSubmit,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  customValue?: string;
  onCustomChange?: (val: string) => void;
  onCustomSubmit?: () => void;
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
            {filtered.length === 0 && !allowCustom && (
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
            {allowCustom && (
              <>
                {filtered.length > 0 && (
                  <div className="kl-divider mt-1" />
                )}
                <div className="px-3 py-1.5">
                  <div className="kl-field-label mb-1">
                    Otro (escribir manualmente)
                  </div>
                  <input
                    type="text"
                    value={customValue || ""}
                    onChange={(e) => onCustomChange?.(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onCustomSubmit?.();
                        setOpen(false);
                        setSearch("");
                      }
                    }}
                    placeholder="Escribe el nombre..."
                    className="kl-input kl-input--sm"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NoteModal({
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
  editingNoteId,
  prompts,
  selectedPromptId,
  setSelectedPromptId,
  fileContent,
  setFileContent,
  fileName,
  setFileName,
}: NoteModalProps) {
  if (!isOpen) return null;

  // Estado local para el input "Otro" del selector de modelos
  const [customModel, setCustomModel] = useState("");

  // Estado local para alternar entre edición y vista previa del contenido
  const [contentTab, setContentTab] = useState<"edit" | "preview">("edit");

  // ============================================================
  // 🚀 FUNCIÓN PARA SUBIR ARCHIVOS (CON WORKER CONFIGURADO)
  // ============================================================
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // Si es TXT o MD, leer directamente
    if (file.type === "text/plain" || file.name.endsWith(".md")) {
      const text = await file.text();
      setFileContent(text);
      return;
    }

    // Si es PDF, cargar pdfjs-dist SOLO EN EL CLIENTE
    if (file.type === "application/pdf") {
      // ✅ Asegurar que solo se ejecuta en el navegador
      if (typeof window === "undefined") return;

      try {
        // ✅ CARGA DINÁMICA: Usamos la versión legacy (ES module) que está
        // diseñada específicamente para navegadores y no tiene dependencias
        // nativas como 'canvas'. La versión principal (build/pdf.js) incluye
        // código para Node.js que requiere 'canvas'.
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.js");

        // ✅ CONFIGURAR EL WORKER CON CDN (evita dependencias nativas)
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          fullText += pageText + "\n";
        }

        setFileContent(fullText);
      } catch (error) {
        // ✅ TypeScript seguro: verificar si error es una instancia de Error
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al leer el PDF";
        setFileContent(`Error al leer el archivo PDF: ${errorMessage}`);
      }
    }
  };

  // Opciones para el popover de modelo
  const modelOptions = AI_MODELS.map((m) => ({ value: m, label: m }));

  // Opciones para el popover de prompt
  const promptOptions = [
    { value: "", label: "Ninguno" },
    ...prompts.map((p) => ({ value: p.id, label: p.title })),
  ];

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
        aria-labelledby="note-modal-title"
        className="kl-modal w-[calc(100%-2rem)] sm:w-full max-w-3xl my-8 max-h-[90dvh] overflow-y-auto animate-zoom-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="kl-modal-header sticky top-0 z-10 px-5 pt-5 pb-3 flex items-start justify-between gap-3">
          <div>
            <h2 id="note-modal-title" className="kl-modal-title text-lg">
              {editingNoteId ? "Editar Nota" : "Guardar conversación"}
            </h2>
            <p className="kl-modal-sub mt-0.5">
              {editingNoteId
                ? "Modifica los datos de esta conversación"
                : "Archiva tus chats con IA de forma organizada"}
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

        {/* CONTENIDO DEL MODAL */}
        <div className="px-5 py-5 space-y-5">
          {/* PESTAÑAS (tabs horizontales tipo Linear) */}
          <div className="flex gap-6 border-b border-[color:rgba(73,68,84,0.35)]">
            <button
              type="button"
              onClick={() => setSourceType("text")}
              className={`kl-tab -mb-[1px] px-4 pb-2 ${
                sourceType === "text" ? "kl-tab--active" : ""
              }`}
            >
              Pegar conversación
            </button>
            <button
              type="button"
              onClick={() => setSourceType("url")}
              className={`kl-tab -mb-[1px] px-4 pb-2 ${
                sourceType === "url" ? "kl-tab--active" : ""
              }`}
            >
              Enlace compartido
            </button>
            <button
              type="button"
              onClick={() => setSourceType("file")}
              className={`kl-tab -mb-[1px] px-4 pb-2 ${
                sourceType === "file" ? "kl-tab--active" : ""
              }`}
            >
              Subir archivo
            </button>
          </div>

          {/* ===== TÍTULO (siempre visible) ===== */}
          <div>
            <label className={labelClass}>Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Fix del bug de autenticación..."
              className="kl-input kl-input--title"
            />
          </div>

          {/* ===== CONTENIDO (según tipo de fuente) ===== */}
          {sourceType === "text" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass}>Contenido del chat</label>
                {/* Tabs de edición/previsualización solo cuando se edita una nota existente */}
                {editingNoteId && (
                  <div className="kl-panel flex gap-1 p-0.5">
                    <button
                      type="button"
                      onClick={() => setContentTab("edit")}
                      className={`kl-segment px-3 py-1 text-xs font-medium rounded-md ${
                        contentTab === "edit" ? "kl-segment--active" : ""
                      }`}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentTab("preview")}
                      className={`kl-segment px-3 py-1 text-xs font-medium rounded-md ${
                        contentTab === "preview" ? "kl-segment--active" : ""
                      }`}
                    >
                      Vista previa
                    </button>
                  </div>
                )}
              </div>
              {contentTab === "edit" || !editingNoteId ? (
                <textarea
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Usuario: ¿Cómo arreglo este error?..."
                  className={`${textareaClass} resize-none min-h-[240px]`}
                />
              ) : (
                <div className="kl-panel w-full px-4 py-4 min-h-[240px] max-h-[480px] overflow-y-auto">
                  {content.trim() ? (
                    <ConversationContent content={content} />
                  ) : (
                    <p className="text-sm italic kl-text-muted">
                      Sin contenido que mostrar.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {sourceType === "url" && (
            <div className="space-y-4">
              <div className="kl-panel p-3">
                <p className="text-xs kl-text-soft">
                  Opcional: deja el título vacío y nuestro servidor extraerá
                  automáticamente el nombre del chat.
                </p>
              </div>
              <div>
                <label className={labelClass}>URL del chat</label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://chat.deepseek.com/a/chat/..."
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {sourceType === "file" && (
            <div className="space-y-4">
              {/* ZONA DE SUBIDA DE ARCHIVOS */}
              <div className="kl-dropzone flex flex-col items-center justify-center p-8">
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2 w-full"
                >
                  <span className="text-3xl">📄</span>
                  <p className="text-sm font-medium kl-text-soft">
                    Haz clic para subir un archivo
                  </p>
                  <p className="kl-meta">
                    Formatos: PDF, TXT, MD
                  </p>
                </label>

                {fileName && (
                  <div className="mt-4 w-full">
                    <div className="kl-card flex items-center justify-between gap-2 text-sm p-3">
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <span className="font-medium truncate max-w-[200px] kl-text-soft">
                          {fileName}
                        </span>
                        <span className="kl-meta">
                          ({fileContent.length} caracteres)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setFileContent("");
                          setFileName("");
                          const input = document.getElementById(
                            "file-upload",
                          ) as HTMLInputElement;
                          if (input) input.value = "";
                        }}
                        aria-label="Quitar archivo"
                        className="kl-icon-btn kl-icon-btn--danger shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                    {fileContent && (
                      <div className="kl-panel mt-2 text-xs kl-text-muted max-h-20 overflow-y-auto p-2">
                        <p className="whitespace-pre-wrap line-clamp-3">
                          {fileContent.substring(0, 300)}...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== RESUMEN ===== */}
          <div>
            <label className={labelClass}>Resumen</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Resume aquí las ideas más importantes de esta conversación para poder localizar rápidamente la información en el futuro."
              className={`${textareaClass} resize-none min-h-[80px]`}
            />
          </div>

          {/* ===== DIVISOR ===== */}
          <div className="kl-divider" />

          {/* ===== METADATOS ===== */}
          {/* MODELO IA + PROMPT ASOCIADO (grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Modelo IA</label>
              <PopoverSelect
                value={aiModel === "otro" ? "" : aiModel}
                onChange={(val) => {
                  setAiModel(val);
                  setCustomModel("");
                }}
                options={modelOptions}
                placeholder="Seleccionar modelo..."
                searchPlaceholder="Buscar modelo..."
                allowCustom
                customValue={customModel}
                onCustomChange={setCustomModel}
                onCustomSubmit={() => {
                  if (customModel.trim()) {
                    setAiModel(customModel.trim());
                  }
                }}
              />
              {aiModel === "otro" && customModel && (
                <p className="kl-meta mt-1">
                  Modelo personalizado: {customModel}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Prompt asociado</label>
              <PopoverSelect
                value={selectedPromptId || ""}
                onChange={(val) => setSelectedPromptId(val || null)}
                options={promptOptions}
                placeholder="Seleccionar prompt..."
                searchPlaceholder="Buscar prompt..."
              />
            </div>
          </div>

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
                placeholder="programacion, deepseek, fix"
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
        <div className="kl-modal-footer sticky bottom-0 px-5 pb-5 pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
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
            disabled={saving || (sourceType === "file" && !fileContent)}
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
            ) : sourceType === "file" ? (
              fileContent ? (
                "Guardar Archivo"
              ) : (
                "Sube un archivo primero"
              )
            ) : (
              "Guardar Nota"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
