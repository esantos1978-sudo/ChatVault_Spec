"use client";

import { useState, useRef, useEffect } from "react";

interface ArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    prompt: string;
    prompt_id: string | null;
    responses: {
      model1: string;
      response1: string;
      model2: string;
      response2: string;
    };
    winner: string | null;
  }) => void;
  saving: boolean;
  prompts: { id: string; title: string; content: string }[];
  selectedPromptId: string | null;
  setSelectedPromptId: (id: string | null) => void;
}

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

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200";

const labelClass = "text-xs font-medium text-zinc-500 mb-1.5 block";

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

export default function ArenaModal({
  isOpen,
  onClose,
  onSubmit,
  saving,
  prompts,
  selectedPromptId,
  setSelectedPromptId,
}: ArenaModalProps) {
  const [prompt, setPrompt] = useState("");
  const [model1, setModel1] = useState("");
  const [response1, setResponse1] = useState("");
  const [model2, setModel2] = useState("");
  const [response2, setResponse2] = useState("");
  const [winner, setWinner] = useState<string | null>(null);

  // Estados para los modelos personalizados ("Otro")
  const [customModel1, setCustomModel1] = useState("");
  const [customModel2, setCustomModel2] = useState("");

  if (!isOpen) return null;

  const modelOptions = AI_MODELS.map((m) => ({ value: m, label: m }));

  const handleSubmit = () => {
    if (!prompt.trim() || !response1.trim() || !response2.trim()) {
      return;
    }

    onSubmit({
      prompt: prompt.trim(),
      prompt_id: selectedPromptId,
      responses: {
        model1: model1.trim() || "Modelo 1",
        response1: response1.trim(),
        model2: model2.trim() || "Modelo 2",
        response2: response2.trim(),
      },
      winner,
    });

    // Limpiar formulario
    setPrompt("");
    setModel1("");
    setResponse1("");
    setModel2("");
    setResponse2("");
    setWinner(null);
    setCustomModel1("");
    setCustomModel2("");
  };

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
              Comparar respuestas de IA
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Compara el mismo prompt entre distintos modelos y guarda cuál
              obtuvo el mejor resultado.
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

        {/* CONTENIDO */}
        <div className="px-6 py-7 space-y-8">
          {/* ===== ① SELECTOR DE PROMPT GUARDADO ===== */}
          <div>
            <label className={labelClass}>
              Cargar prompt guardado (opcional)
            </label>
            <PopoverSelect
              value={selectedPromptId || ""}
              onChange={(val) => {
                setSelectedPromptId(val || null);
                if (val) {
                  const selected = prompts.find((p) => p.id === val);
                  if (selected) setPrompt(selected.content);
                } else {
                  setPrompt("");
                }
              }}
              options={[
                { value: "", label: "Ninguno" },
                ...prompts.map((p) => ({ value: p.id, label: p.title })),
              ]}
              placeholder="Seleccionar prompt..."
              searchPlaceholder="Buscar prompt..."
            />
          </div>

          {/* ===== ② PROMPT ===== */}
          <div>
            <label className={labelClass}>Prompt a comparar</label>
            <textarea
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Pega aquí el prompt que quieres ejecutar en ambos modelos..."
              className={
                "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-none leading-7 min-h-[180px]"
              }
            />
          </div>

          {/* ===== ③ MODELOS ===== */}
          <div>
            <label className={labelClass}>Modelos</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Modelo A */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                  Modelo A
                </span>
                <PopoverSelect
                  value={model1 === "otro" ? "" : model1}
                  onChange={(val) => {
                    setModel1(val);
                    setCustomModel1("");
                  }}
                  options={modelOptions}
                  placeholder="Seleccionar modelo..."
                  searchPlaceholder="Buscar modelo..."
                  allowCustom
                  customValue={customModel1}
                  onCustomChange={setCustomModel1}
                  onCustomSubmit={() => {
                    if (customModel1.trim()) {
                      setModel1(customModel1.trim());
                    }
                  }}
                />
                {model1 === "otro" && customModel1 && (
                  <p className="text-[10px] text-zinc-500">
                    Modelo personalizado: {customModel1}
                  </p>
                )}
              </div>

              {/* Modelo B */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                  Modelo B
                </span>
                <PopoverSelect
                  value={model2 === "otro" ? "" : model2}
                  onChange={(val) => {
                    setModel2(val);
                    setCustomModel2("");
                  }}
                  options={modelOptions}
                  placeholder="Seleccionar modelo..."
                  searchPlaceholder="Buscar modelo..."
                  allowCustom
                  customValue={customModel2}
                  onCustomChange={setCustomModel2}
                  onCustomSubmit={() => {
                    if (customModel2.trim()) {
                      setModel2(customModel2.trim());
                    }
                  }}
                />
                {model2 === "otro" && customModel2 && (
                  <p className="text-[10px] text-zinc-500">
                    Modelo personalizado: {customModel2}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ===== ④ RESPUESTAS ===== */}
          <div>
            <label className={labelClass}>Respuestas</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-medium text-zinc-600 mb-2 block">
                  Respuesta {model1 || "Modelo A"}
                </span>
                <textarea
                  rows={8}
                  value={response1}
                  onChange={(e) => setResponse1(e.target.value)}
                  placeholder="Pega aquí la respuesta del primer modelo..."
                  className={
                    "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-none leading-7 min-h-[200px]"
                  }
                />
              </div>
              <div>
                <span className="text-[10px] font-medium text-zinc-600 mb-2 block">
                  Respuesta {model2 || "Modelo B"}
                </span>
                <textarea
                  rows={8}
                  value={response2}
                  onChange={(e) => setResponse2(e.target.value)}
                  placeholder="Pega aquí la respuesta del segundo modelo..."
                  className={
                    "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-none leading-7 min-h-[200px]"
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== ⑤ GANADOR ===== */}
          <div>
            <label className={labelClass}>Selecciona el ganador</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setWinner(winner === "model1" ? null : "model1")}
                className={`h-12 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold ${
                  winner === "model1"
                    ? "border-violet-500 bg-violet-500/10 text-violet-400 shadow-lg shadow-violet-500/10"
                    : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {winner === "model1"
                    ? "check_circle"
                    : "radio_button_unchecked"}
                </span>
                {model1 || "Modelo A"}
              </button>
              <button
                type="button"
                onClick={() => setWinner(winner === "model2" ? null : "model2")}
                className={`h-12 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold ${
                  winner === "model2"
                    ? "border-violet-500 bg-violet-500/10 text-violet-400 shadow-lg shadow-violet-500/10"
                    : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {winner === "model2"
                    ? "check_circle"
                    : "radio_button_unchecked"}
                </span>
                {model2 || "Modelo B"}
              </button>
            </div>
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
            onClick={handleSubmit}
            disabled={
              saving || !prompt.trim() || !response1.trim() || !response2.trim()
            }
            className={`h-9 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 flex items-center gap-2 ${
              saving || !prompt.trim() || !response1.trim() || !response2.trim()
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
            ) : (
              "Guardar batalla"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
