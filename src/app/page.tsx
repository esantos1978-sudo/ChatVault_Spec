"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "@/components/AuthForm";
import type { User } from "@supabase/supabase-js";

type Note = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  tag: string | null;
  ia_model?: string;
  source_type?: string;
  summary?: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // 🚀 CHIVATO CORREGIDO (Usa la variable real loadingSession)
  console.log("=== 🏠 RASTREO EN HOME === User:", user?.email, "| LoadingSession:", loadingSession);

  // Verificar sesión al montar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingSession(false);
    });

    // Escuchar cambios de autenticación en tiempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-400" />
      </div>
    );
  }

  // Si no hay sesión, mostrar formulario de autenticación
  if (!user) {
    return <AuthForm onAuth={() => {}} />;
  }

  // Si hay usuario, renderizamos el panel pasándole los datos del usuario
  return <NotesManager user={user} />;
}

// ============================================================================
// COMPONENTE GESTOR DE CHATS (Separado e independiente para evitar bugs)
// ============================================================================
function NotesManager({ user }: { user: any }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Campos del formulario
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState(""); 
  const [iaModel, setIaModel] = useState("gemini"); 
  const [summary, setSummary] = useState("");
  
  // Control de la pestaña activa en el modal: 'text' | 'url' | 'file'
  const [sourceType, setSourceType] = useState<"text" | "url" | "file">("text");
  const [sourceUrl, setSourceUrl] = useState("");

  const [selectedTag, setSelectedTag] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setNotes(data || []);
    } catch (err: any) {
      setError("Error al cargar las notas: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    console.log("=== 🛠️ PROBANDO ENVÍO === Tipo de origen:", sourceType, "| Título actual:", `"${title}"`);

   if (sourceType !== "url" && !title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    setSaving(true);

    let finalContent = content.trim();
    let finalTitle = title.trim();

    if (sourceType === "url") {
      if (!sourceUrl.trim()) {
        setError("La URL del chat es obligatoria");
        setSaving(false);
        return;
      }
      try {
        // Llamamos a nuestra nueva API interna para extraer el texto
        const res = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: sourceUrl.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al escanear la URL");
        
        finalContent = `URL original: ${sourceUrl}\n\n${data.content}`;
        if (!finalTitle) finalTitle = data.title;
      } catch (err: any) {
        setError("Error al extraer enlace: " + err.message + ". Guardando solo la URL.");
        finalContent = `URL del chat: ${sourceUrl}\n\n${content}`;
      }
    } else if (sourceType === "file") {
      finalContent = `[Archivo subido pendientes de procesar]\n\n${content}`;
    }

    const noteData = {
      title: title.trim(),
      content: finalContent,
      tag: tag.trim().toLowerCase() || null, 
      ia_model: iaModel,
      source_type: sourceType,
      summary: summary.trim() || null,
      user_id: user.id,
    };

    let resultError = null;

    if (editingNoteId) {
      const { error: updateError } = await supabase
        .from("notes")
        .update(noteData)
        .eq("id", editingNoteId);
      resultError = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("notes")
        .insert(noteData);
      resultError = insertError;
    }

    setSaving(false);

    if (resultError) {
      setError("Error al guardar la nota: " + resultError.message);
      return;
    }

    setTitle("");
    setContent("");
    setTag(""); 
    setIaModel("gemini");
    setSourceType("text");
    setSourceUrl("");
    setSummary("");
    setEditingNoteId(null);
    setSuccess(editingNoteId ? "¡Cerebro de IA actualizado!" : "¡Conversación de IA guardada!");
    setIsModalOpen(false); 
    setTimeout(() => setSuccess(null), 3000);

    fetchNotes();
  }

  function startEdit(note: any) {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content || "");
    setTag(note.tag || "");
    setIaModel(note.ia_model || "gemini");
    setSourceType(note.source_type || "text");
    setSummary(note.summary || "");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingNoteId(null);
    setTitle("");
    setContent("");
    setTag("");
    setIaModel("gemini");
    setSourceType("text");
    setSourceUrl("");
    setSummary("");
  }

  async function handleDeleteNote(id: number) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta nota?")) return;
    setError(null);
    const { error: deleteError } = await supabase.from("notes").delete().eq("id", id); 
    if (deleteError) setError("Error al eliminar la nota: " + deleteError.message);
    else fetchNotes();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  const allTags = Array.from(
    new Set(notes.map((n) => n.tag).filter((t) => t !== null && t !== ""))
  ) as string[];

  const filteredNotes = notes
    .filter((n) => (selectedTag ? n.tag === selectedTag : true))
    .filter((n) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        n.title.toLowerCase().includes(query) || 
        (n.content && n.content.toLowerCase().includes(query)) ||
        (n.summary && n.summary.toLowerCase().includes(query))
      );
    });

  // 🚀 CHIVATO DE CONTROL DE RENDERIZADO
  useEffect(() => {
    console.log("=== 🔍 RASTREO EN PANEL DE CONTROL ===");
    console.log("1. ¿Usuario activo?:", !!user);
    console.log("2. ¿Cargando notas de Supabase?:", loading);
    console.log("3. Notas totales en DB:", notes.length);
    console.log("4. Notas visibles filtradas:", filteredNotes.length);
    console.log("=======================================");
  }, [loading, notes, filteredNotes, user]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ================= SIDEBAR IZQUIERDO ================= */}
        <aside className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm h-fit space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">ChatVault</h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 truncate">{user?.email}</p>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <nav className="space-y-1">
            <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Navegación</p>
            <button 
              onClick={() => { setSelectedTag(null); setSearchQuery(""); }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${!selectedTag ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
            >
              <span>📁</span> Todos los chats
            </button>
          </nav>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <div className="space-y-1">
            <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">#️⃣ Etiquetas</p>
            {allTags.length === 0 ? (
              <p className="px-2 text-xs text-zinc-400 italic">No hay etiquetas</p>
            ) : (
              allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${selectedTag === t ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
                >
                  <span># {t}</span>
                  <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full text-zinc-400">
                    {notes.filter(n => n.tag === t).length}
                  </span>
                </button>
              ))
            )}
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <button onClick={handleLogout} className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Cerrar sesión
          </button>
        </aside>

        {/* ================= TABLÓN CENTRAL ================= */}
        <main className="lg:col-span-3 space-y-6">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">{error}</div>}
          {success && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">{success}</div>}

          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 capitalize">
              {selectedTag ? `Chats de #${selectedTag}` : "Historial de Inteligencia Artificial"}
              <span className="ml-2 text-sm font-normal text-zinc-400">({filteredNotes.length})</span>
            </h2>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              <span>➕</span> Registrar conversación
            </button>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </span>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar en títulos, resúmenes o conversaciones..." className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600 dark:border-zinc-700" /></div>
          ) : filteredNotes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
              <p className="text-zinc-500 dark:text-zinc-400">No se encontraron registros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map((note) => (
                <article key={note.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          🤖 {note.ia_model || "Sin Modelo"}
                        </span>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-1 line-clamp-2">{note.title}</h3>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEdit(note)} className="rounded p-1 text-zinc-400 hover:text-blue-600 dark:hover:bg-zinc-800 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg></button>
                        <button onClick={() => handleDeleteNote(note.id)} className="rounded p-1 text-zinc-400 hover:text-red-600 dark:hover:bg-zinc-800 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6m-4.74 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
                      </div>
                    </div>
                    
                    {note.summary && (
                      <div className="mb-3 p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-xs text-zinc-700 dark:text-zinc-300">
                        <span className="font-bold block text-amber-800 dark:text-amber-400 mb-0.5">📌 Resumen:</span>
                        <p className="line-clamp-3">{note.summary}</p>
                      </div>
                    )}

                    {note.content && <p className="whitespace-pre-wrap text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 italic">"{note.content}"</p>}
                  </div>
                  
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
                    {note.tag ? <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded capitalize">#{note.tag}</span> : <span />}
                    <time className="text-[10px] text-zinc-400">{new Date(note.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}</time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL AVANZADO CON PESTAÑAS ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                {editingNoteId ? "Modificar registro de IA" : "Guardar conversación con IA"}
              </h2>
              <button type="button" onClick={closeModal} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Título de la sesión</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Error CI/CD solucionado" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">¿Qué IA usaste?</label>
                <select value={iaModel} onChange={(e) => setIaModel(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none">
                  <option value="gemini">✨ Gemini (Google)</option>
                  <option value="chatgpt">💬 ChatGPT (OpenAI)</option>
                  <option value="claude">🔮 Claude (Anthropic)</option>
                  <option value="deepseek">🐳 DeepSeek</option>
                  <option value="otro">⚙️ Otro Modelo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Etiqueta (Tag)</label>
                <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Ej: programacion, cocina" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Resumen del hilo</label>
                <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Breve resumen de lo acordado..." className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none" />
              </div>
            </div>

            <div className="mb-4 border-b border-zinc-200 dark:border-zinc-800">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Origen del contenido</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSourceType("text")} className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${sourceType === "text" ? "border-blue-500 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}>
                  ✍️ Copiar/Pegar Texto
                </button>
                <button type="button" onClick={() => setSourceType("url")} className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${sourceType === "url" ? "border-blue-500 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}>
                  🔗 Enlace del Chat
                </button>
                <button type="button" onClick={() => setSourceType("file")} className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${sourceType === "file" ? "border-blue-500 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}>
                  📄 Subir Archivo
                </button>
              </div>
            </div>

            <div className="mb-5">
              {sourceType === "text" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Pega la conversación completa aquí abajo:</label>
                  <textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Pega el bloque de texto del chat..." className="w-full resize-none rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none" />
                </div>
              )}

              {sourceType === "url" && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Enlace compartido (URL del chat)</label>
                    <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://chatgpt.com/share/..." className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none" />
                  </div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded border border-amber-200/40">
                    💡 Nota: Al guardar, registraremos el enlace. En la próxima actualización añadiremos el extractor automático de texto.
                  </p>
                </div>
              )}

              {sourceType === "file" && (
                <div className="p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-center bg-zinc-50/50 dark:bg-zinc-800/20">
                  <span>📁</span>
                  <p className="mt-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Arrastra tu PDF, Word o Bloc de notas</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">O haz clic para seleccionar archivo</p>
                  <div className="mt-3 inline-block text-[10px] bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded">
                    Módulo de lectura en desarrollo (Próximo asalto)
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">Cancelar</button>
              <button type="button" onClick={handleSubmit} disabled={saving} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar sesión"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}