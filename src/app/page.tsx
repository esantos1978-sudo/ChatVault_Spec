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

function NotesManager({ user }: { user: User }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError("Error al cargar notas: " + fetchError.message);
    } else {
      setNotes(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

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
    setTimeout(() => setSuccess(null), 3000);

    fetchNotes();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Encabezado con usuario */}
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                ChatVault
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Conectado como{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {user.email}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* Mensajes */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Formulario */}
        <form className="mb-12 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Nueva nota
          </h2>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
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
            <label
              htmlFor="content"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
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

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {saving ? "Guardando..." : "Guardar nota"}
          </button>
        </form>

        {/* Lista de notas */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Tus notas
            {notes.length > 0 && (
              <span className="ml-2 text-sm font-normal text-zinc-400">
                ({notes.length})
              </span>
            )}
          </h2>

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
            <div className="space-y-4">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-1 flex items-start justify-between gap-4">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {note.title}
                    </h3>
                    <time className="shrink-0 text-xs text-zinc-400">
                      {new Date(note.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  {note.content && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {note.content}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}