"use client";

import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";

interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tag?: string;
  ai_model?: string;
  source_type?: string;
  source_url?: string;
  created_at: string;
}

export default function NotesManager() {
  // Estados principales
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Estados para Filtros Temporales (Botones + Calendario)
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Estados del Formulario del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceType, setSourceType] = useState<"text" | "url" | "file">("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tag, setTag] = useState("");
  const [aiModel, setAiModel] = useState("DeepSeek-R1");
  const [sourceUrl, setSourceUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Cargar notas desde Supabase al arrancar
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err: any) {
      console.error("Error cargando notas:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // Extraer etiquetas únicas de tus notas actuales para el Sidebar e Input inteligente
  const allTags = Array.from(
    new Set(notes.map((n) => n.tag).filter((t): t is string => !!t)),
  );

  // Abrir y cerrar modal limpiando campos viejos
  const openModal = () => {
    setTitle("");
    setContent("");
    setSummary("");
    setTag("");
    setSourceUrl("");
    setSourceType("text");
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Acción del botón principal para guardar la nota
  const handleSubmit = async () => {
    if (sourceType === "text" && !title.trim()) {
      alert("Por favor, escribe un título para guardar tu nota de texto.");
      return;
    }
    if (sourceType === "url" && !sourceUrl.trim()) {
      alert("Por favor, introduce una URL válida.");
      return;
    }

    try {
      setSaving(true);
      let finalTitle = title;
      let finalContent = content;

      // Si es modo URL, disparamos a nuestra API del backend para raspar y limpiar
      if (sourceType === "url") {
        const res = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: sourceUrl }),
        });
        const scrapeData = await res.json();

        if (res.ok) {
          finalTitle = title.trim() ? title : scrapeData.title;
          finalContent = scrapeData.content;
        } else {
          finalTitle = title.trim() ? title : "Enlace Guardado";
          finalContent = `[No se pudo leer automáticamente]: ${sourceUrl}`;
        }
      }

      // Guardamos la información limpia en Supabase
      const { error } = await supabase.from("notes").insert([
        {
          title: finalTitle || "Conversación sin título",
          content: finalContent,
          summary: summary || null,
          tag: tag.trim().toLowerCase() || null,
          ai_model: aiModel,
          source_type: sourceType,
          source_url: sourceType === "url" ? sourceUrl : null,
        },
      ]);

      if (error) throw error;

      closeModal();
      fetchNotes();
    } catch (err: any) {
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // 🧠 EL SÚPER FILTRO INTELIGENTE DE NOTAS (Etiqueta + Fecha + Buscador)
  const filteredNotes = notes
    .filter((n) => (selectedTag ? n.tag === selectedTag : true))
    .filter((n) => {
      const noteDate = new Date(n.created_at);
      const now = new Date();

      // Prioridad 1: Si hay rango manual en el calendario
      if (startDate || endDate) {
        const noteString = noteDate.toISOString().split("T")[0];
        if (startDate && noteString < startDate) return false;
        if (endDate && noteString > endDate) return false;
        return true;
      }

      // Prioridad 2: Si no hay calendario, aplican los botones rápidos laterales
      if (dateFilter === "all") return true;
      if (dateFilter === "today")
        return noteDate.toDateString() === now.toDateString();

      if (dateFilter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return noteDate >= oneWeekAgo;
      }

      if (dateFilter === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return noteDate >= oneMonthAgo;
      }

      return true;
    })
    .filter((n) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        n.title.toLowerCase().includes(query) ||
        (n.content && n.content.toLowerCase().includes(query)) ||
        (n.summary && n.summary.toLowerCase().includes(query))
      );
    });

  return (
    <div className="flex h-screen w-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 overflow-hidden">
      {/* ================= SIDEBAR IZQUIERDO ================= */}
      <aside className="w-64 border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col gap-6 select-none">
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl">🔒</span>
          <h1 className="text-lg font-bold tracking-tight">ChatVault</h1>
        </div>

        {/* NAVEGACIÓN Y FILTROS TEMPORALES */}
        <nav className="space-y-1">
          <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Navegación
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedTag(null);
              setDateFilter("all");
              setStartDate("");
              setEndDate("");
              setSearchQuery("");
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${!selectedTag && dateFilter === "all" && !startDate && !endDate ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"}`}
          >
            <span>📁</span> Todos los chats
          </button>

          <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800/50 space-y-1">
            <p className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              🕒 Por Fecha
            </p>

            <button
              type="button"
              onClick={() => {
                setDateFilter("today");
                setStartDate("");
                setEndDate("");
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${dateFilter === "today" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"}`}
            >
              <span>☀️</span> Hoy
            </button>

            <button
              type="button"
              onClick={() => {
                setDateFilter("week");
                setStartDate("");
                setEndDate("");
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${dateFilter === "week" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"}`}
            >
              <span>📅</span> Últimos 7 días
            </button>

            <button
              type="button"
              onClick={() => {
                setDateFilter("month");
                setStartDate("");
                setEndDate("");
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${dateFilter === "month" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"}`}
            >
              <span>🗓️</span> Últimos 30 días
            </button>

            {/* CALENDARIO AD-HOC (RANGOS PERSONALIZADOS) */}
            <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800/40 space-y-1.5">
              <p className="px-2 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                Rango personalizado
              </p>
              <div className="grid grid-cols-2 gap-1.5 px-2">
                <div>
                  <label className="text-[9px] text-zinc-400 block mb-0.5">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDateFilter("all");
                    }}
                    className="w-full text-[10px] rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1 text-zinc-600 dark:text-zinc-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-400 block mb-0.5">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDateFilter("all");
                    }}
                    className="w-full text-[10px] rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1 text-zinc-600 dark:text-zinc-300 focus:outline-none"
                  />
                </div>
              </div>

              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="w-full px-2 text-left text-[10px] text-red-500 hover:text-red-600 font-medium transition-colors mt-1"
                >
                  ❌ Limpiar calendario
                </button>
              )}
            </div>
          </div>
        </nav>

        <hr className="border-zinc-200 dark:border-zinc-800" />

        {/* CONTENEDOR DE ETIQUETAS CON SCROLL BLINDADO */}
        <div className="space-y-1">
          <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            #️⃣ Etiquetas
          </p>
          <div className="max-h-48 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
            {allTags.length === 0 ? (
              <p className="px-2 text-xs text-zinc-400 italic">
                No hay etiquetas
              </p>
            ) : (
              allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${selectedTag === t ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"}`}
                >
                  <span># {t}</span>
                  <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full text-zinc-400">
                    {notes.filter((n) => n.tag === t).length}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* ================= CONTENIDO CENTRAL ================= */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-950">
        {/* BARRA SUPERIOR (BUSCADOR + BOTÓN ACCIÓN) */}
        <header className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div className="w-96">
            <input
              type="text"
              placeholder="Buscar por título, resumen o contenido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>
          <button
            onClick={openModal}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            ➕ Registrar conversación
          </button>
        </header>

        {/* REJILLA DE TARJETAS */}
        <section className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-zinc-950">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-sm text-zinc-500">
              Cargando tu baúl...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-zinc-400 italic">
              No se encontraron registros
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 justify-between min-h-[220px]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                        🤖 {note.ai_model || "Desconocido"}
                      </span>
                      {note.tag && (
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 capitalize">
                          #{note.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
                      {note.title}
                    </h3>
                    {note.summary && (
                      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-zinc-100 dark:border-zinc-800/60 line-clamp-2">
                        {note.summary}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-4 overflow-hidden leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    {note.source_url && (
                      <a
                        href={note.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline inline-flex items-center gap-0.5 font-medium"
                      >
                        Ver enlace 🔗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ================= MODAL AVANZADO ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
            {/* TÍTULO DEL MODAL */}
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Guardar Historial de IA
              </h2>
              <button
                onClick={closeModal}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            {/* SECTOR DE PESTAÑAS */}
            <div className="mb-6 flex border-b border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setSourceType("text")}
                className={
                  sourceType === "text"
                    ? "py-2 px-4 text-sm font-medium border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "py-2 px-4 text-sm font-medium border-b-2 border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }
              >
                ✍️ Texto Copiado
              </button>
              <button
                type="button"
                onClick={() => setSourceType("url")}
                className={
                  sourceType === "url"
                    ? "py-2 px-4 text-sm font-medium border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "py-2 px-4 text-sm font-medium border-b-2 border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }
              >
                🔗 Enlace del Chat
              </button>
              <button
                type="button"
                onClick={() => setSourceType("file")}
                className={
                  sourceType === "file"
                    ? "py-2 px-4 text-sm font-medium border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "py-2 px-4 text-sm font-medium border-b-2 border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }
              >
                📄 Subir Archivo
              </button>
            </div>

            {/* FORMULARIO DINÁMICO */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    ¿Qué IA usaste?
                  </label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="DeepSeek-R1">DeepSeek-R1</option>
                    <option value="ChatGPT-4o">ChatGPT-4o</option>
                    <option value="Claude-3.5-Sonnet">Claude 3.5 Sonnet</option>
                    <option value="Gemini-1.5-Pro">Gemini 1.5 Pro</option>
                    <option value="Llama-3">Llama 3 (Meta)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Etiqueta (Tag)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="Escribe o selecciona una..."
                      list="existing-tags"
                      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none"
                    />
                    <datalist id="existing-tags">
                      {allTags.map((t) => (
                        <option key={t} value={t} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {sourceType === "text" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Título de la nota
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Fix del bug de login en NextJS"
                      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Contenido del Chat
                    </label>
                    <textarea
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Usuario: ¿Cómo arreglo este error?..."
                      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {sourceType === "url" && (
                <>
                  <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    💡 <strong>Opcional:</strong> Si dejas el título vacío,
                    nuestro servidor extraerá de forma limpia el nombre del chat
                    externo en segundo plano.
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Título personalizado (Opcional)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Mi chat de DeepSeek sobre layouts"
                      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      URL pública del chat compartido
                    </label>
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://chat.deepseek.com/a/chat/..."
                      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {sourceType === "file" && (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-xl p-8 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/30">
                  <span className="text-3xl mb-2">🛠️</span>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Módulo de lectura en desarrollo
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Soporte para PDFs y documentos en el próximo asalto.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Resumen extendido del hilo
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Resume aquí detalladamente los puntos clave o conclusiones del chat con la IA..."
                  className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            {/* BOTONES ACCIONES */}
            <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || sourceType === "file"}
                className={
                  sourceType === "file"
                    ? "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-zinc-400 dark:bg-zinc-700 cursor-not-allowed"
                    : "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                }
              >
                {saving
                  ? "Guardando..."
                  : sourceType === "file"
                    ? "Próximamente... 🛠️"
                    : "Guardar Conversación 🚀"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
