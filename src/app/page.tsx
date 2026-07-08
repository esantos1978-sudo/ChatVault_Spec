"use client";

import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import AuthForm from "../components/AuthForm";

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

// ==================== COMPONENTE HOME ====================
export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("👤 Sesión obtenida en Home:", session?.user?.id);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("👤 Cambio de autenticación en Home:", session?.user?.id);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log("🔐 No hay usuario, mostrando AuthForm");
    return <AuthForm onAuth={() => {}} />;
  }

  console.log("✅ Usuario logueado:", user.id);
  return <NotesManager user={user} />;
}

// ==================== COMPONENTE NOTESMANAGER ====================
function NotesManager({ user }: { user: any }) {
  // ==================== ESTADOS ====================
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceType, setSourceType] = useState<"text" | "url" | "file">("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tag, setTag] = useState("");
  const [aiModel, setAiModel] = useState("DeepSeek-R1");
  const [sourceUrl, setSourceUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ==================== EFECTOS ====================
  useEffect(() => {
    fetchNotes();
  }, []);

  // ==================== FUNCIONES ====================

  async function fetchNotes() {
    console.log("📥 fetchNotes iniciado");
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      console.log("✅ notes actualizado:", data?.length || 0, "notas");
    } catch (err: any) {
      console.error("❌ Error en fetchNotes:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const allTags = Array.from(
    new Set(notes.map((n) => n.tag).filter((t): t is string => !!t)),
  );

  const openModal = () => {
    console.log("📂 Abriendo modal");
    setTitle("");
    setContent("");
    setSummary("");
    setTag("");
    setSourceUrl("");
    setSourceType("text");
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("📂 Cerrando modal");
    setIsModalOpen(false);
    setError(null);
    setSuccess(null);
  };

  const startEdit = (note: Note) => {
    console.log("✏️ Editando nota:", note.id);
    setTitle(note.title);
    setContent(note.content);
    setSummary(note.summary || "");
    setTag(note.tag || "");
    setAiModel(note.ai_model || "DeepSeek-R1");
    setSourceType((note.source_type as "text" | "url" | "file") || "text");
    setSourceUrl(note.source_url || "");
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (id: string) => {
    console.log("🗑️ Borrando nota:", id);
    if (!confirm("¿Estás seguro de que quieres eliminar esta nota?")) return;

    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
      console.log("✅ Nota borrada correctamente");
      fetchNotes();
    } catch (err: any) {
      console.error("❌ Error al borrar:", err.message);
      alert("Error al eliminar: " + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleSubmit = async () => {
    console.log("🚀 handleSubmit ejecutado");
    console.log("👤 user recibido en NotesManager:", user?.id);
    console.log("📝 sourceType:", sourceType);
    console.log("📝 title:", title);
    console.log("📝 sourceUrl:", sourceUrl);

    setError(null);
    setSuccess(null);

    if (sourceType === "text" && !title.trim()) {
      setError("Por favor, escribe un título para guardar tu nota de texto.");
      console.log("❌ Error: Título vacío en modo texto");
      return;
    }
    if (sourceType === "url" && !sourceUrl.trim()) {
      setError("Por favor, introduce una URL válida.");
      console.log("❌ Error: URL vacía");
      return;
    }

    if (!user) {
      setError("Error: No se pudo identificar al usuario.");
      setSaving(false);
      console.log("❌ Error: No hay usuario en NotesManager");
      return;
    }

    try {
      setSaving(true);
      console.log("⏳ setSaving(true)");

      let finalTitle = title;
      let finalContent = content;

      if (sourceType === "url") {
        let cleanUrl = sourceUrl.trim();
        if (
          !cleanUrl.startsWith("http://") &&
          !cleanUrl.startsWith("https://")
        ) {
          cleanUrl = "https://" + cleanUrl;
          setSourceUrl(cleanUrl);
        }
        console.log("🌐 URL limpia:", cleanUrl);

        const res = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: cleanUrl }),
        });

        console.log("📡 Status de scrape:", res.status);

        const scrapeData = await res.json();
        console.log("📦 scrapeData:", scrapeData);

        if (res.ok) {
          finalTitle = title.trim() ? title : scrapeData.title;
          finalContent = scrapeData.content;
          console.log("✅ Título final:", finalTitle);
        } else {
          finalTitle = title.trim() ? title : "Enlace Guardado";
          finalContent = `[No se pudo leer automáticamente]: ${cleanUrl}`;
          console.log("⚠️ Fallo en scrape, usando datos de respaldo");
        }
      }

      const noteData = {
        title: finalTitle || "Conversación sin título",
        content: finalContent || "Contenido vacío",
        summary: summary || null,
        tag: tag.trim().toLowerCase() || null,
        ai_model: aiModel,
        source_type: sourceType,
        source_url: sourceType === "url" ? sourceUrl : null,
        user_id: user.id,
      };
      console.log("📤 Datos a insertar:", noteData);
      console.log("✅ user_id:", user.id);

      const { error } = await supabase.from("notes").insert([noteData]);
      console.log("📥 Respuesta Supabase:", error || "✅ Éxito");

      if (error) throw error;

      setSuccess("¡Nota guardada correctamente!");
      console.log("✅ Nota guardada correctamente");

      setTimeout(() => setSuccess(null), 3000);
      closeModal();
      fetchNotes();
      console.log("🔄 fetchNotes() ejecutado después de guardar");
    } catch (err: any) {
      console.error("❌ Error en handleSubmit:", err);
      setError("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
      console.log("⏳ setSaving(false)");
    }
  };

  // ==================== FILTROS ====================
  const filteredNotes = notes
    .filter((n) => (selectedTag ? n.tag === selectedTag : true))
    .filter((n) => {
      const noteDate = new Date(n.created_at);
      const now = new Date();

      if (startDate || endDate) {
        const noteString = noteDate.toISOString().split("T")[0];
        if (startDate && noteString < startDate) return false;
        if (endDate && noteString > endDate) return false;
        return true;
      }

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

  // ==================== RENDER ====================
  return (
    <div className="flex h-screen w-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col gap-6 select-none h-full">
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl">🔒</span>
          <h1 className="text-lg font-bold tracking-tight">ChatVault</h1>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto">
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
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              !selectedTag && dateFilter === "all" && !startDate && !endDate
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            }`}
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
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                dateFilter === "today"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              }`}
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
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                dateFilter === "week"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              }`}
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
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                dateFilter === "month"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              }`}
            >
              <span>🗓️</span> Últimos 30 días
            </button>

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

        <div className="space-y-1 flex-1 overflow-hidden">
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
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                    selectedTag === t
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  }`}
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

        <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ================= CONTENIDO CENTRAL ================= */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-950">
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

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            ✅ {success}
          </div>
        )}

        {/* ================= REJILLA DE TARJETAS REDISEÑADAS ================= */}
        <section className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-zinc-50/50 via-white/50 to-zinc-50/30 dark:from-zinc-950 dark:via-zinc-950/95 dark:to-zinc-950">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 p-5 min-h-[240px] animate-pulse"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                      <div className="h-6 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                    <div className="flex gap-1">
                      <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                      <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                  </div>
                  <div className="h-5 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3" />
                  <div className="h-16 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-3" />
                  <div className="h-10 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/30">
              <span className="text-4xl mb-4">📭</span>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                No se encontraron registros
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Prueba a ajustar los filtros o crea una nueva nota
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="group relative flex flex-col rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/80 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out justify-between min-h-[240px] overflow-hidden"
                >
                  {/* Efecto de brillo sutil en la esquina superior izquierda */}
                  <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-500" />

                  {/* Efecto de borde brillante en hover */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-blue-500/20 transition-all duration-300 pointer-events-none" />

                  <div className="relative z-10">
                    {/* Cabecera: IA + Etiqueta + Botones */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-zinc-100 to-zinc-200/80 dark:from-zinc-800 dark:to-zinc-700/80 px-3 py-1 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {note.ai_model || "Desconocido"}
                        </span>
                        {note.tag && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-50 to-blue-100/80 dark:from-blue-950/50 dark:to-blue-900/30 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30">
                            <span className="text-[8px]">#</span>
                            {note.tag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => startEdit(note)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all duration-200"
                          title="Editar nota"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                          title="Eliminar nota"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Título */}
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {note.title}
                    </h3>

                    {/* Resumen */}
                    {note.summary && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-50/80 to-amber-100/40 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/30">
                        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 font-medium line-clamp-2 leading-relaxed">
                          {note.summary}
                        </p>
                      </div>
                    )}

                    {/* Contenido clickeable */}
                    <div
                      onClick={() => startEdit(note)}
                      className="cursor-pointer mt-3 group/content"
                    >
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 overflow-hidden leading-relaxed group-hover/content:text-zinc-700 dark:group-hover/content:text-zinc-300 transition-colors duration-200">
                        {note.content}
                      </p>
                    </div>
                  </div>

                  {/* Pie de tarjeta */}
                  <div className="relative z-10 mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                        />
                      </svg>
                      <span>
                        {new Date(note.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {note.source_url && (
                      <a
                        href={note.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-all duration-200"
                      >
                        <span>Ver enlace</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ================= MODAL PREMIUM ================= */}
      {isModalOpen && (
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
                  {title ? "✏️ Editar Historial" : "📝 Guardar Historial de IA"}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {title
                    ? "Modifica los datos de esta conversación"
                    : "Archiva tus chats con IA de forma organizada"}
                </p>
              </div>
              <button
                onClick={closeModal}
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
                    <option value="Claude-3.5-Sonnet">
                      🔮 Claude 3.5 Sonnet
                    </option>
                    <option value="Gemini-1.5-Pro">✨ Gemini 1.5 Pro</option>
                    <option value="Llama-3">🦙 Llama 3 (Meta)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    🏷️ Etiqueta
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="Escribe o selecciona una..."
                      list="existing-tags"
                      className="w-full rounded-xl border-0 bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200"
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
                      💡 <strong>Opcional:</strong> Deja el título vacío y
                      nuestro servidor extraerá automáticamente el nombre del
                      chat.
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
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSubmit}
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
      )}
    </div>
  );
}
