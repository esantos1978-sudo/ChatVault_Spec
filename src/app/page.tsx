"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "@/components/AuthForm";
import type { User } from "@supabase/supabase-js";

type Note = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  tags: string[];
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

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

  // Usuario autenticado — mostrar el gestor de notas
  return <NotesManager user={user} />;
}

function NotesManager({ user }: { user: any }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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

    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase.from("notes").insert({
      title: title.trim(),
      content: content.trim(),
      user_id: user.id,
    });

    setSaving(false);

    if (insertError) {
      setError("Error al guardar la nota: " + insertError.message);
      return;
    }

    setTitle("");
    setContent("");
    setSuccess("¡Nota guardada correctamente!");
    setIsModalOpen(false); 
    setTimeout(() => setSuccess(null), 3000);

    fetchNotes();
  }

  async function handleDeleteNote(id: number) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      return;
    }

    setError(null);

    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("id", id); 

    if (deleteError) {
      setError("Error al eliminar la nota: " + deleteError.message);
    } else {
      fetchNotes();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Contenedor Grid Principal: 1 columna en móvil, 4 en pantallas grandes (lg) */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ================= COLUMNA IZQUIERDA: SIDEBAR ================= */}
        <aside className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm h-fit space-y-6">
          {/* Nombre de la App y Usuario */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              ChatVault
            </h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {user.email}
            </p>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* Bloque de Filtros */}
          <nav className="space-y-1">
            <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Filtros
            </p>
            <button className="flex w-full items-center gap-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <span>🤖</span> Chat con IA
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
              <span>#️⃣</span> Etiquetas (Tags)
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
              <span>📅</span> Por Fecha
            </button>
          </nav>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* Botón Cerrar Sesión en la parte inferior del Sidebar */}
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Cerrar sesión
          </button>
        </aside>

        {/* ================= COLUMNA CENTRAL/DERECHA: TABLÓN DE NOTAS ================= */}
        <main className="lg:col-span-3 space-y-6">
          {/* Mensajes de feedback del sistema */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
              {success}
            </div>
          )}

          {/* Barra superior del tablón: Título y Botón de Nueva Nota */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
              Tus notas
              {notes.length > 0 && (
                <span className="ml-2 text-sm font-normal text-zinc-400">
                  ({notes.length})
                </span>
              )}
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nueva nota
            </button>
          </div>

          {/* Grid de notas en formato tarjetas (2 columnas de notas) */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-400" />
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
              <p className="text-zinc-500 dark:text-zinc-400">
                No hay notas todavía. ¡Crea tu primera nota!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                        {note.title}
                      </h3>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800 transition-colors shrink-0"
                        title="Eliminar nota"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6m-4.74 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                    {note.content && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-4">
                        {note.content}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                    <time className="text-[10px] text-zinc-400">
                      {new Date(note.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL FLOTANTE (Sigue funcionando igual) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                Crear nueva nota
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Título
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Escribe un título..."
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="content" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Contenido
              </label>
              <textarea
                id="content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe el contenido de tu nota..."
                className="w-full resize-none rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar nota"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}