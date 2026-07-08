"use client";

import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import AuthForm from "../components/AuthForm";
import { NoteCard } from "../components/NoteCard";
import { NoteModal } from "../components/NoteModal";

interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tag?: string;
  tags?: string[];
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
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
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

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags || [])));

  const openModal = () => {
    console.log("📂 Abriendo modal");
    setTitle("");
    setContent("");
    setSummary("");
    setTags([]);
    setTagsInput("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
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
    setTags(note.tags || []);
    setTagsInput((note.tags || []).join(", "));
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    setAiModel(note.ai_model || "DeepSeek-R1");
    setSourceType((note.source_type as "text" | "url" | "file") || "text");
    setSourceUrl(note.source_url || "");
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const addSuggestion = (index: number) => {
    const suggestion = suggestions[index];
    if (!suggestion) return;

    const lastTagIndex = tags.length - 1;
    const newTags = tags.filter((_, i) => i !== lastTagIndex);
    const updatedTags = [...newTags, suggestion];
    setTags(updatedTags);
    setTagsInput(updatedTags.join(", "));
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
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
    console.log("🏷️ tags:", tags);

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
        tags: tags.length > 0 ? tags : null,
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
    .filter((n) => (selectedTag ? (n.tags || []).includes(selectedTag) : true))
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
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col gap-6 select-none h-full">
        {/* LOGO */}
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl">🔒</span>
          <h1 className="text-lg font-bold tracking-tight">ChatVault</h1>
        </div>

        {/* NAVEGACIÓN */}
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

          {/* FILTROS DE FECHA */}
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

            {/* RANGO PERSONALIZADO */}
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

        {/* ETIQUETAS */}
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
                    {notes.filter((n) => (n.tags || []).includes(t)).length}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* CERRAR SESIÓN */}
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
        {/* HEADER */}
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

        {/* MENSAJES */}
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

        {/* REJILLA DE TARJETAS */}
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
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={startEdit}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ================= MODAL ================= */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        summary={summary}
        setSummary={setSummary}
        tags={tags}
        tagsInput={tagsInput}
        setTagsInput={setTagsInput}
        setTags={setTags}
        aiModel={aiModel}
        setAiModel={setAiModel}
        sourceType={sourceType}
        setSourceType={setSourceType}
        sourceUrl={sourceUrl}
        setSourceUrl={setSourceUrl}
        saving={saving}
        allTags={allTags}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        selectedSuggestion={selectedSuggestion}
        addSuggestion={addSuggestion}
        setSuggestions={setSuggestions}
        setShowSuggestions={setShowSuggestions}
        setSelectedSuggestion={setSelectedSuggestion}
        editingTitle={title || undefined}
      />
    </div>
  );
}
