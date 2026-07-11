"use client";

import { useState } from "react";

interface ArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    prompt: string;
    responses: {
      model1: string;
      response1: string;
      model2: string;
      response2: string;
    };
    winner: string | null;
  }) => void;
  saving: boolean;
}

export default function ArenaModal({
  isOpen,
  onClose,
  onSubmit,
  saving,
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

  const handleSubmit = () => {
    if (!prompt.trim() || !response1.trim() || !response2.trim()) {
      return;
    }

    onSubmit({
      prompt: prompt.trim(),
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-zinc-800/50 p-6 md:p-8 my-8 max-h-[90vh] overflow-y-auto animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              🥊 Comparar respuestas de IA
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Prueba el mismo prompt en dos modelos distintos y elige el ganador
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
              📝 Prompt a probar
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Escribe el prompt que quieres probar en ambos modelos..."
              className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200 resize-none"
            />
          </div>

          {/* Modelo 1 */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              🤖 Modelo 1
            </label>
            <select
              value={model1}
              onChange={(e) => {
                const value = e.target.value;
                setModel1(value);
                if (value !== "otro") {
                  setCustomModel1("");
                }
              }}
              className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
            >
              <option value="ChatGPT-4o">💬 ChatGPT-4o</option>
              <option value="ChatGPT-4o-mini">💬 ChatGPT-4o-mini</option>
              <option value="ChatGPT-o1">🧠 ChatGPT-o1</option>
              <option value="ChatGPT-o3-mini">🧠 ChatGPT-o3-mini</option>
              <option value="Claude-3.5-Sonnet">🔮 Claude 3.5 Sonnet</option>
              <option value="Claude-3.7-Sonnet">🔮 Claude 3.7 Sonnet</option>
              <option value="Gemini-1.5-Pro">✨ Gemini 1.5 Pro</option>
              <option value="Gemini-2.0-Flash">✨ Gemini 2.0 Flash</option>
              <option value="Gemini-2.5-Pro">✨ Gemini 2.5 Pro</option>
              <option value="DeepSeek-R1">🧠 DeepSeek-R1</option>
              <option value="DeepSeek-V3">🧠 DeepSeek-V3</option>
              <option value="Llama-3">🦙 Llama 3</option>
              <option value="Llama-3.1">🦙 Llama 3.1</option>
              <option value="Llama-4">🦙 Llama 4</option>
              <option value="Mistral-Large">🌊 Mistral Large</option>
              <option value="Mistral-Small">🌊 Mistral Small</option>
              <option value="Grok-2">🤖 Grok-2</option>
              <option value="Grok-3">🤖 Grok-3</option>
              <option value="Perplexity-Sonar">🔍 Perplexity Sonar</option>
              <option value="Perplexity-Pro">🔍 Perplexity Pro</option>
              <option value="otro">📦 Otro (escribir manualmente)</option>
            </select>

            {/* Input "Otro" para Modelo 1 */}
            {model1 === "otro" && (
              <input
                type="text"
                value={customModel1}
                onChange={(e) => setCustomModel1(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = customModel1.trim();
                    if (value) {
                      setModel1(value);
                    }
                  }
                }}
                onBlur={() => {
                  const value = customModel1.trim();
                  if (value) {
                    setModel1(value);
                  }
                }}
                placeholder="Escribe el nombre del modelo y presiona Enter..."
                className="mt-2 w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
              />
            )}
          </div>

          {/* Respuesta Modelo 1 */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              📄 Contenido
            </label>
            <textarea
              rows={4}
              value={response1}
              onChange={(e) => setResponse1(e.target.value)}
              placeholder="Pega aquí la respuesta del primer modelo..."
              className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200 resize-none"
            />
          </div>

          {/* Modelo 2 */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              🤖 Modelo 2
            </label>
            <select
              value={model2}
              onChange={(e) => {
                const value = e.target.value;
                setModel2(value);
                if (value !== "otro") {
                  setCustomModel2("");
                }
              }}
              className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
            >
              <option value="ChatGPT-4o">💬 ChatGPT-4o</option>
              <option value="ChatGPT-4o-mini">💬 ChatGPT-4o-mini</option>
              <option value="ChatGPT-o1">🧠 ChatGPT-o1</option>
              <option value="ChatGPT-o3-mini">🧠 ChatGPT-o3-mini</option>
              <option value="Claude-3.5-Sonnet">🔮 Claude 3.5 Sonnet</option>
              <option value="Claude-3.7-Sonnet">🔮 Claude 3.7 Sonnet</option>
              <option value="Gemini-1.5-Pro">✨ Gemini 1.5 Pro</option>
              <option value="Gemini-2.0-Flash">✨ Gemini 2.0 Flash</option>
              <option value="Gemini-2.5-Pro">✨ Gemini 2.5 Pro</option>
              <option value="DeepSeek-R1">🧠 DeepSeek-R1</option>
              <option value="DeepSeek-V3">🧠 DeepSeek-V3</option>
              <option value="Llama-3">🦙 Llama 3</option>
              <option value="Llama-3.1">🦙 Llama 3.1</option>
              <option value="Llama-4">🦙 Llama 4</option>
              <option value="Mistral-Large">🌊 Mistral Large</option>
              <option value="Mistral-Small">🌊 Mistral Small</option>
              <option value="Grok-2">🤖 Grok-2</option>
              <option value="Grok-3">🤖 Grok-3</option>
              <option value="Perplexity-Sonar">🔍 Perplexity Sonar</option>
              <option value="Perplexity-Pro">🔍 Perplexity Pro</option>
              <option value="otro">📦 Otro (escribir manualmente)</option>
            </select>

            {/* Input "Otro" para Modelo 2 */}
            {model2 === "otro" && (
              <input
                type="text"
                value={customModel2}
                onChange={(e) => setCustomModel2(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = customModel2.trim();
                    if (value) {
                      setModel2(value);
                    }
                  }
                }}
                onBlur={() => {
                  const value = customModel2.trim();
                  if (value) {
                    setModel2(value);
                  }
                }}
                placeholder="Escribe el nombre del modelo y presiona Enter..."
                className="mt-2 w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
              />
            )}
          </div>

          {/* Respuesta Modelo 2 */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              📄 Contenido
            </label>
            <textarea
              rows={4}
              value={response2}
              onChange={(e) => setResponse2(e.target.value)}
              placeholder="Pega aquí la respuesta del segundo modelo..."
              className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200 resize-none"
            />
          </div>

          {/* Votación */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              🏆 ¿Qué modelo dio la mejor respuesta?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setWinner(winner === "model1" ? null : "model1")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  winner === "model1"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-2 border-blue-500 dark:border-blue-400"
                    : "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
                }`}
              >
                {winner === "model1" ? "✅ Modelo 1" : "⭐ Modelo 1"}
              </button>
              <button
                type="button"
                onClick={() => setWinner(winner === "model2" ? null : "model2")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  winner === "model2"
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-2 border-purple-500 dark:border-purple-400"
                    : "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
                }`}
              >
                {winner === "model2" ? "✅ Modelo 2" : "⭐ Modelo 2"}
              </button>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1.5 text-center">
              {winner
                ? "Haz clic en el ganador para deseleccionarlo"
                : "Selecciona qué modelo dio la mejor respuesta"}
            </p>
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
            onClick={handleSubmit}
            disabled={
              saving || !prompt.trim() || !response1.trim() || !response2.trim()
            }
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 flex items-center gap-2 ${
              saving || !prompt.trim() || !response1.trim() || !response2.trim()
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
                <span>🏆</span>
                Guardar comparación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
