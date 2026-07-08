"use client";

import { useState } from "react";

interface ArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  saving: boolean;
}

const MODELS = [
  { value: "chatgpt-4o", label: "💬 ChatGPT-4o" },
  { value: "claude-3.5", label: "🔮 Claude 3.5 Sonnet" },
  { value: "gemini-1.5", label: "✨ Gemini 1.5 Pro" },
  { value: "deepseek-v3", label: "🧠 DeepSeek-V3" },
  { value: "llama-3", label: "🦙 Llama 3" },
  { value: "otro", label: "📂 Otro" },
];

export function ArenaModal({
  isOpen,
  onClose,
  onSubmit,
  saving,
}: ArenaModalProps) {
  const [prompt, setPrompt] = useState("");
  const [model1, setModel1] = useState("chatgpt-4o");
  const [response1, setResponse1] = useState("");
  const [model2, setModel2] = useState("claude-3.5");
  const [response2, setResponse2] = useState("");
  const [winner, setWinner] = useState<"model1" | "model2" | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!prompt.trim() || !response1.trim() || !response2.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    onSubmit({
      prompt: prompt.trim(),
      responses: {
        model1,
        response1: response1.trim(),
        model2,
        response2: response2.trim(),
      },
      winner: winner, // 👈 AÑADE ESTA LÍNEA
    });

    // Resetear formulario
    setPrompt("");
    setResponse1("");
    setResponse2("");
    setModel1("chatgpt-4o");
    setModel2("claude-3.5");
    setWinner(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
    >
      <div className="w-full max-w-3xl rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-zinc-800/50 p-8 my-8 animate-zoom-in">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              🥊 Arena de LLMs
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Compara respuestas de diferentes modelos de IA
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

        {/* CONTENIDO */}
        <div className="space-y-5">
          {/* Prompt */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              📝 Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Escribe el prompt que quieres comparar..."
              className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200 resize-none"
            />
          </div>

          {/* Comparación: Modelo 1 vs Modelo 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                🤖 Modelo 1
              </label>
              <select
                value={model1}
                onChange={(e) => setModel1(e.target.value)}
                className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
              >
                {MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                🤖 Modelo 2
              </label>
              <select
                value={model2}
                onChange={(e) => setModel2(e.target.value)}
                className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
              >
                {MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Respuestas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                💬 Respuesta 1
              </label>
              <textarea
                rows={4}
                value={response1}
                onChange={(e) => setResponse1(e.target.value)}
                placeholder="Pega aquí la respuesta del Modelo 1..."
                className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                💬 Respuesta 2
              </label>
              <textarea
                rows={4}
                value={response2}
                onChange={(e) => setResponse2(e.target.value)}
                placeholder="Pega aquí la respuesta del Modelo 2..."
                className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200 resize-none"
              />
            </div>
          </div>
        </div>
        {/* 🆕 VOTACIÓN: ¿Qué respuesta es mejor? */}
        <div className="mt-2">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            🏆 ¿Qué respuesta es mejor?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setWinner("model1")}
              className={`flex-1 py-2 rounded-lg border transition-all ${
                winner === "model1"
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                  : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              🥇{" "}
              {model1
                ? MODELS.find((m) => m.value === model1)?.label
                : "Modelo 1"}
            </button>
            <button
              type="button"
              onClick={() => setWinner("model2")}
              className={`flex-1 py-2 rounded-lg border transition-all ${
                winner === "model2"
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                  : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              🥇{" "}
              {model2
                ? MODELS.find((m) => m.value === model2)?.label
                : "Modelo 2"}
            </button>
          </div>
          <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">
            Selecciona qué respuesta te ha parecido mejor (opcional)
          </p>
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
            onClick={handleSubmit}
            disabled={saving}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 flex items-center gap-2 ${
              saving
                ? "bg-zinc-400 dark:bg-zinc-700 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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
              <>
                <span>🥊</span>
                Guardar Comparación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
