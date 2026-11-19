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

/* Piel de los campos: .kl-input--area (textarea). La tipografía/tokens llegan
   del scope .kl-portal del contenedor del modal. */
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
        aria-labelledby="arena-modal-title"
        className="kl-modal w-[calc(100%-2rem)] sm:w-full max-w-4xl my-8 max-h-[90dvh] overflow-y-auto animate-zoom-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="kl-modal-header sticky top-0 z-10 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="arena-modal-title" className="kl-modal-title text-xl">
              Comparar respuestas de IA
            </h2>
            <p className="kl-modal-sub mt-1">
              Compara el mismo prompt entre distintos modelos y guarda cuál
              obtuvo el mejor resultado.
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

        {/* CONTENIDO */}
        <div className="px-5 sm:px-6 py-5 sm:py-7 space-y-6 sm:space-y-8 flex-1">
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
              className={`${textareaClass} resize-none min-h-[180px]`}
            />
          </div>

          {/* ===== ③ MODELOS ===== */}
          <div>
            <label className={labelClass}>Modelos</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Modelo A */}
              <div className="kl-card p-4 space-y-3">
                <span className="kl-card-label">
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
                  <p className="kl-meta">
                    Modelo personalizado: {customModel1}
                  </p>
                )}
              </div>

              {/* Modelo B */}
              <div className="kl-card p-4 space-y-3">
                <span className="kl-card-label">
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
                  <p className="kl-meta">
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
                <span className="kl-card-label mb-2 block">
                  Respuesta {model1 || "Modelo A"}
                </span>
                <textarea
                  rows={8}
                  value={response1}
                  onChange={(e) => setResponse1(e.target.value)}
                  placeholder="Pega aquí la respuesta del primer modelo..."
                  className={`${textareaClass} resize-none min-h-[200px]`}
                />
              </div>
              <div>
                <span className="kl-card-label mb-2 block">
                  Respuesta {model2 || "Modelo B"}
                </span>
                <textarea
                  rows={8}
                  value={response2}
                  onChange={(e) => setResponse2(e.target.value)}
                  placeholder="Pega aquí la respuesta del segundo modelo..."
                  className={`${textareaClass} resize-none min-h-[200px]`}
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
                className={`kl-winner-btn h-12 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-semibold ${
                  winner === "model1" ? "kl-winner-btn--active" : ""
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
                className={`kl-winner-btn h-12 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-semibold ${
                  winner === "model2" ? "kl-winner-btn--active" : ""
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
            onClick={handleSubmit}
            disabled={
              saving || !prompt.trim() || !response1.trim() || !response2.trim()
            }
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
              "Guardar comparación"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
