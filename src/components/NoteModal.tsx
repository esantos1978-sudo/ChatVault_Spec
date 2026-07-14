"use client";

import { useState, useRef, useEffect } from "react";

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

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200";

const labelClass = "text-xs font-medium text-zinc-500 mb-1.5 block";

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
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 hover:border-zinc-700 transition-all duration-200 flex items-center justify-between gap-2 text-left"
      >
        <span className={value ? "text-zinc-100" : "text-zinc-600"}>
          {value ? selectedLabel : placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
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
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 shadow-premium py-1 max-h-64 overflow-hidden flex flex-col">
          <div className="px-2 pb-1 pt-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder || "Buscar..."}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && !allowCustom && (
              <div className="px-3 py-3 text-xs text-zinc-600 text-center">
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
                className={`w-full px-3 py-1.5 text-left text-xs transition-colors duration-150 flex items-center justify-between ${
                  value === option.value
                    ? "bg-zinc-800/60 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-300"
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
                    className="w-3.5 h-3.5 text-violet-500"
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
                  <div className="border-t border-zinc-800/40 mt-1 pt-1" />
                )}
                <div className="px-3 py-1.5">
                  <div className="text-[10px] text-zinc-600 mb-1">
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
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
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

  // ============================================================
  // 🚀 FUNCIÓN PARA SUBIR ARCHIVOS (CON WORKER CONFIGURADO)
  // ============================================================
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("📄 Archivo seleccionado:", file.name);
    console.log("📄 Tipo:", file.type);
    console.log("📄 Tamaño:", file.size, "bytes");

    setFileName(file.name);

    // Si es TXT o MD, leer directamente
    if (file.type === "text/plain" || file.name.endsWith(".md")) {
      console.log("📄 Leyendo TXT/MD...");
      const text = await file.text();
      console.log(
        "📄 Texto extraído (primeros 100 chars):",
        text.substring(0, 100),
      );
      setFileContent(text);
      return;
    }

    // Si es PDF, cargar pdfjs-dist SOLO EN EL CLIENTE
    if (file.type === "application/pdf") {
      try {
        // ✅ CARGA DINÁMICA: solo se ejecuta en el navegador
        const pdfjsLib = await import("pdfjs-dist");

        // ✅  CONFIGURAR EL WORKER CON VERSIÓN 3.11.174
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

        console.log("📄 Worker configurado correctamente");
        console.log("📄 Versión de pdf.js instalada:", pdfjsLib.version);

        console.log("📄 Leyendo PDF...");
        const arrayBuffer = await file.arrayBuffer();
        console.log(
          "📄 ArrayBuffer obtenido:",
          arrayBuffer.byteLength,
          "bytes",
        );

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        console.log("📄 PDF cargado, páginas:", pdf.numPages);

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          console.log(`📄 Procesando página ${i}...`);
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          fullText += pageText + "\n";
          console.log(`📄 Página ${i}: ${pageText.length} caracteres`);
        }

        console.log("📄 Texto total extraído:", fullText.length, "caracteres");
        setFileContent(fullText);
      } catch (error) {
        console.error("❌ Error al leer PDF:", error);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(9, 9, 11, 0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-4xl rounded-xl bg-zinc-900 shadow-premium border border-zinc-800/40 my-8 max-h-[90vh] overflow-y-auto animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-800/30 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
              {editingNoteId ? "Editar Nota" : "Guardar conversación"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {editingNoteId
                ? "Modifica los datos de esta conversación"
                : "Archiva tus chats con IA de forma organizada"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800/40 transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors"
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
        <div className="px-6 py-7 space-y-7">
          {/* PESTAÑAS (tabs horizontales tipo Linear) */}
          <div className="flex gap-6 border-b border-zinc-800/30">
            <button
              type="button"
              onClick={() => setSourceType("text")}
              className={`pb-2 px-4 text-sm font-medium transition-all duration-200 border-b-2 -mb-[1px] ${
                sourceType === "text"
                  ? "text-zinc-100 border-zinc-100"
                  : "text-zinc-500 border-transparent hover:text-zinc-300"
              }`}
            >
              Pegar conversación
            </button>
            <button
              type="button"
              onClick={() => setSourceType("url")}
              className={`pb-2 px-4 text-sm font-medium transition-all duration-200 border-b-2 -mb-[1px] ${
                sourceType === "url"
                  ? "text-zinc-100 border-zinc-100"
                  : "text-zinc-500 border-transparent hover:text-zinc-300"
              }`}
            >
              Enlace compartido
            </button>
            <button
              type="button"
              onClick={() => setSourceType("file")}
              className={`pb-2 px-4 text-sm font-medium transition-all duration-200 border-b-2 -mb-[1px] ${
                sourceType === "file"
                  ? "text-zinc-100 border-zinc-100"
                  : "text-zinc-500 border-transparent hover:text-zinc-300"
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
              className={
                "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-lg font-semibold text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
              }
            />
          </div>

          {/* ===== CONTENIDO (según tipo de fuente) ===== */}
          {sourceType === "text" && (
            <div>
              <label className={labelClass}>Contenido del chat</label>
              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Usuario: ¿Cómo arreglo este error?..."
                className={
                  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-none leading-7 min-h-[240px]"
                }
              />
            </div>
          )}

          {sourceType === "url" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-900/60 p-3 border border-zinc-800/30">
                <p className="text-xs text-zinc-400">
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
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg p-8 bg-zinc-950/30 hover:border-zinc-500 transition-colors duration-200">
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
                  <p className="text-sm font-medium text-zinc-400">
                    Haz clic para subir un archivo
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    Formatos: PDF, TXT, MD
                  </p>
                </label>

                {fileName && (
                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-between gap-2 text-sm bg-zinc-800/40 p-3 rounded-lg border border-zinc-700/50">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <span>📄</span>
                        <span className="font-medium truncate max-w-[200px]">
                          {fileName}
                        </span>
                        <span className="text-[10px] text-zinc-500">
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
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    {fileContent && (
                      <div className="mt-2 text-xs text-zinc-500 max-h-20 overflow-y-auto bg-zinc-900/40 p-2 rounded border border-zinc-800/30">
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

          {/* ===== DIVISOR ===== */}
          <div className="divider" />

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
                <p className="text-[10px] text-zinc-500 mt-1">
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
                <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 shadow-premium py-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => addSuggestion(index)}
                      className={`w-full px-3 py-1.5 text-left text-xs transition-colors duration-150 ${
                        index === selectedSuggestion
                          ? "bg-zinc-800/60 text-zinc-100"
                          : "text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-300"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="text-zinc-600">#</span>
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-zinc-800/60 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300 border border-zinc-700/50"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = tags.filter((_, i) => i !== idx);
                          setTags(newTags);
                          setTagsInput(newTags.join(", "));
                        }}
                        className="hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RESUMEN (opcional) */}
          <div>
            <label className={labelClass}>Resumen del hilo</label>
            <textarea
              rows={1}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Puntos clave o conclusiones..."
              className={
                "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-none"
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 pb-6 pt-5 border-t border-zinc-800/30 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-400 transition-colors duration-200"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={saving || (sourceType === "file" && !fileContent)}
            className={`h-9 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 flex items-center gap-2 ${
              saving || (sourceType === "file" && !fileContent)
                ? "bg-zinc-700 cursor-not-allowed"
                : "gemstone-gradient shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
