"use client";

import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import AuthForm from "../components/AuthForm"; // Ajusta la ruta si es necesario

// ==================== COMPONENTE PRINCIPAL (HOME) ====================
export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("👤 Sesión obtenida en Home:", session?.user?.id);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("👤 Cambio de autenticación en Home:", session?.user?.id);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600"></div>
      </div>
    );
  }

  // Si no hay usuario, mostrar el formulario de login
  if (!user) {
    console.log("🔐 No hay usuario, mostrando AuthForm");
    return <AuthForm onAuth={() => {}} />;
  }

  // Si hay usuario, mostrar el panel de notas
  console.log("✅ Usuario logueado:", user.id);
  return <NotesManager user={user} />;
}

// ==================== COMPONENTE NOTESMANAGER ====================
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

function NotesManager({ user }: { user: any }) {
  // ==================== ESTADOS ====================
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filtros Temporales
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Formulario del Modal
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

  // Cargar notas
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
  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Recargar la página para que el componente Home detecte el cambio
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Extraer etiquetas únicas
  const allTags = Array.from(
    new Set(notes.map((n) => n.tag).filter((t): t is string => !!t)),
  );

  // Abrir modal
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

  // Cerrar modal
  const closeModal = () => {
    console.log("📂 Cerrando modal");
    setIsModalOpen(false);
    setError(null);
    setSuccess(null);
  };

  // Editar nota
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

  // Borrar nota
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

  // GUARDAR NOTA (handleSubmit)
  const handleSubmit = async () => {
    console.log("🚀 handleSubmit ejecutado");
    console.log("📝 sourceType:", sourceType);
    console.log("📝 title:", title);
    console.log("📝 sourceUrl:", sourceUrl);
    console.log("👤 user recibido en NotesManager:", user?.id);

    setError(null);
    setSuccess(null);

    // Validaciones
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

    try {
      setSaving(true);
      console.log("⏳ setSaving(true)");

      let finalTitle = title;
      let finalContent = content;

      // Si es modo URL, disparamos a nuestra API del backend
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

      // 🔥 USAR EL USER RECIBIDO COMO PROP
      if (!user) {
        setError("Error: No se pudo identificar al usuario.");
        setSaving(false);
        console.log("❌ Error: No hay usuario en NotesManager");
        return;
      }

      // Datos a insertar con user.id
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
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col gap-6 select-none h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl">🔒</span>
          <h1 className="text-lg font-bold tracking-tight">ChatVault</h1>
        </div>

        {/* Navegación */}
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
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              !selectedTag && dateFilter === "all" && !startDate && !endDate
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            }`}
          >
            <span>📁</span> Todos los chats
          </button>

          {/* ... resto de la navegación (filtros de fecha, calendario, etc.) ... */}
        </nav>

        <hr className="border-zinc-200 dark:border-zinc-800" />

        {/* Etiquetas */}
        <div className="space-y-1 flex-1 overflow-hidden">
          <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            #️⃣ Etiquetas
          </p>
          <div className="max-h-48 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
            {/* ... lista de etiquetas ... */}
          </div>
        </div>

        {/* 👇 BOTÓN DE CERRAR SESIÓN (SIEMPRE AL FINAL) */}
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

      {/* CONTENIDO CENTRAL */}
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

        {/* Mensajes de error/success */}
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
                  className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-900 justify-between min-h-[220px]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                        🤖 {note.ai_model || "Desconocido"}
                      </span>
                      <div className="flex items-center gap-1">
                        {note.tag && (
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 capitalize">
                            #{note.tag}
                          </span>
                        )}
                        <button
                          onClick={() => startEdit(note)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                          title="Editar nota"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
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
                          className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800"
                          title="Eliminar nota"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
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

                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
                      {note.title}
                    </h3>

                    {note.summary && (
                      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-zinc-100 dark:border-zinc-800/60 line-clamp-2">
                        {note.summary}
                      </p>
                    )}

                    <div
                      onClick={() => startEdit(note)}
                      className="cursor-pointer mt-3"
                    >
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-4 overflow-hidden leading-relaxed hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                        {note.content}
                      </p>
                    </div>
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

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {title ? "Editar Historial" : "Guardar Historial de IA"}
              </h2>
              <button
                onClick={closeModal}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

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
