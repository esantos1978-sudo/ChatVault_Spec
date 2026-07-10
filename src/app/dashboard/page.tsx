"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

// ✅ Componentes normales
import { NoteCard } from "@/components/NoteCard";
import { PromptCard } from "@/components/PromptCard";
import PromptModal from "@/components/PromptModal";
import { ArenaCard } from "@/components/ArenaCard";
import { ArenaModal } from "@/components/ArenaModal";
import { ArenaDetailModal } from "@/components/ArenaDetailModal";

// ✅ Ahora NoteModal tiene export default, así que es más simple
const NoteModal = dynamic(() => import("@/components/NoteModal"), {
  ssr: false,
});

interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  ai_model?: string;
  source_type?: string;
  source_url?: string;
  created_at: string;
  is_favorite?: boolean;
  prompt_id?: string;
  prompts?: {
    title: string;
  };
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  times_used: number;
  created_at: string;
  is_favorite?: boolean;
}

export default function Dashboard({ user }: { user: any }) {
  // ==================== ESTADOS GENERALES ====================
  const [activeTab, setActiveTab] = useState<"notes" | "prompts" | "arena">(
    "notes",
  );
  const [showFavorites, setShowFavorites] = useState(false);

  // ==================== ESTADOS PARA NOTAS ====================
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedAiModel, setSelectedAiModel] = useState<string | null>(null);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteSourceType, setNoteSourceType] = useState<"text" | "url" | "file">(
    "text",
  );
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteSummary, setNoteSummary] = useState("");
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [noteTagsInput, setNoteTagsInput] = useState("");
  const [noteSuggestions, setNoteSuggestions] = useState<string[]>([]);
  const [noteShowSuggestions, setNoteShowSuggestions] = useState(false);
  const [noteSelectedSuggestion, setNoteSelectedSuggestion] = useState(-1);
  const [noteAiModel, setNoteAiModel] = useState("DeepSeek-R1");
  const [noteSourceUrl, setNoteSourceUrl] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState(""); // 👈 NUEVO
  const [fileName, setFileName] = useState(""); // 👈 NUEVO

  // ==================== ESTADOS PARA PROMPTS ====================
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(true);
  const [promptSearchQuery, setPromptSearchQuery] = useState("");
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<
    string | null
  >(null);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [promptCategory, setPromptCategory] = useState("texto");
  const [promptTags, setPromptTags] = useState<string[]>([]);
  const [promptTagsInput, setPromptTagsInput] = useState("");
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [promptShowSuggestions, setPromptShowSuggestions] = useState(false);
  const [promptSelectedSuggestion, setPromptSelectedSuggestion] = useState(-1);
  const [promptSaving, setPromptSaving] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);

  // ==================== OBTENER PROMPTS PARA EL SELECTOR ====================
  const promptOptions = prompts.map((p) => ({
    id: p.id,
    title: p.title,
  }));

  // ==================== ESTADOS PARA LA ARENA ====================
  const [arenaComparisons, setArenaComparisons] = useState<any[]>([]);
  const [arenaLoading, setArenaLoading] = useState(true);
  const [arenaModalOpen, setArenaModalOpen] = useState(false);
  const [arenaSaving, setArenaSaving] = useState(false);
  const [arenaSearchQuery, setArenaSearchQuery] = useState("");
  const [arenaDetailModalOpen, setArenaDetailModalOpen] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<any>(null);

  // ==================== ESTADOS COMUNES ====================
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ==================== OBTENER ETIQUETAS POR SECCIÓN ====================
  // ✅ SOLO UNA VEZ DEFINIDAS
  const noteTagsFromNotes = Array.from(
    new Set(notes.flatMap((n) => n.tags || [])),
  );

  const promptTagsFromPrompts = Array.from(
    new Set(prompts.flatMap((p) => p.tags || [])),
  );

  // ==================== OBTENER MODELOS DE IA ÚNICOS ====================
  const allAiModels = Array.from(
    new Set(
      notes.map((n) => n.ai_model).filter((model): model is string => !!model),
    ),
  );

  // ==================== EFECTOS ====================
  useEffect(() => {
    fetchNotes();
    fetchPrompts();
    fetchArenaComparisons();
  }, []);

  // ==================== FUNCIONES PARA NOTAS ====================
  async function fetchNotes() {
    try {
      setNotesLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err: any) {
      console.error("Error cargando notas:", err.message);
    } finally {
      setNotesLoading(false);
    }
  }

  const filteredNotes = notes
    .filter((n) => (showFavorites ? n.is_favorite === true : true))
    .filter((n) => (selectedTag ? (n.tags || []).includes(selectedTag) : true))
    .filter((n) => (selectedAiModel ? n.ai_model === selectedAiModel : true))
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

  // ==================== FUNCIONES PARA PROMPTS ====================
  async function fetchPrompts() {
    try {
      setPromptsLoading(true);
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("times_used", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (err: any) {
      console.error("Error cargando prompts:", err.message);
    } finally {
      setPromptsLoading(false);
    }
  }

  const filteredPrompts = prompts
    .filter((p) => (showFavorites ? p.is_favorite === true : true))
    .filter((p) => (selectedTag ? (p.tags || []).includes(selectedTag) : true))
    .filter((p) =>
      selectedPromptCategory ? p.category === selectedPromptCategory : true,
    )
    .filter((p) => {
      const query = promptSearchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
      );
    });

  // ==================== FUNCIONES PARA LA ARENA ====================
  async function fetchArenaComparisons() {
    try {
      setArenaLoading(true);
      const { data, error } = await supabase
        .from("arena_comparisons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArenaComparisons(data || []);
    } catch (err: any) {
      console.error("Error cargando comparaciones:", err.message);
    } finally {
      setArenaLoading(false);
    }
  }

  const filteredArenaComparisons = arenaComparisons.filter((c) => {
    const query = arenaSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return c.prompt.toLowerCase().includes(query);
  });

  const handleArenaSubmit = async (data: any) => {
    try {
      setArenaSaving(true);
      const { error } = await supabase.from("arena_comparisons").insert([
        {
          prompt: data.prompt,
          responses: data.responses,
          winner: data.winner,
          user_id: user.id,
        },
      ]);

      if (error) throw error;
      toast.success("¡Comparación guardada! 🥊");
      setArenaModalOpen(false);
      fetchArenaComparisons();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setArenaSaving(false);
    }
  };

  const handleDeleteArenaComparison = async (id: string) => {
    if (!confirm("¿Eliminar esta comparación?")) return;
    try {
      const { error } = await supabase
        .from("arena_comparisons")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Comparación eliminada");
      fetchArenaComparisons();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };
  const openArenaDetail = (comparison: any) => {
    console.log("🟢 openArenaDetail ejecutado");
    setSelectedComparison(comparison);
    setArenaDetailModalOpen(true);
  };

  // ==================== TOGGLE FAVORITOS ====================
  const toggleFavorite = async (
    id: string,
    table: "notes" | "prompts",
    isFavorite: boolean,
  ) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_favorite: isFavorite })
        .eq("id", id);

      if (error) throw error;

      if (table === "notes") {
        setNotes(
          notes.map((n) =>
            n.id === id ? { ...n, is_favorite: isFavorite } : n,
          ),
        );
      } else {
        setPrompts(
          prompts.map((p) =>
            p.id === id ? { ...p, is_favorite: isFavorite } : p,
          ),
        );
      }

      toast.success(
        isFavorite ? "⭐ Añadido a favoritos" : "☆ Eliminado de favoritos",
      );
    } catch (err: any) {
      toast.error("Error al actualizar favorito: " + err.message);
    }
  };

  // ==================== HANDLE SUBMIT NOTAS ====================
  const handleNoteSubmit = async () => {
    if (!noteTitle.trim()) {
      toast.error("Por favor, escribe un título.");
      return;
    }

    try {
      setNoteSaving(true);
      const loadingToast = toast.loading(
        editingNoteId ? "Actualizando nota..." : "Guardando nota...",
      );

      const noteData = {
        title: noteTitle.trim(),
        content: noteContent.trim(),
        summary: noteSummary.trim() || null,
        tags: noteTags.length > 0 ? noteTags : null,
        ai_model: noteAiModel,
        source_type: noteSourceType,
        source_url: noteSourceType === "url" ? noteSourceUrl : null,
        user_id: user.id,
        prompt_id: selectedPromptId,
      };

      let result;
      if (editingNoteId) {
        result = await supabase
          .from("notes")
          .update(noteData)
          .eq("id", editingNoteId);
      } else {
        result = await supabase.from("notes").insert([noteData]);
      }

      if (result.error) throw result.error;

      toast.success(editingNoteId ? "¡Nota actualizada!" : "¡Nota guardada!", {
        id: loadingToast,
      });
      setNoteModalOpen(false);
      resetNoteForm();
      fetchNotes();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setNoteSaving(false);
    }
  };

  function resetNoteForm() {
    setNoteTitle("");
    setNoteContent("");
    setNoteSummary("");
    setNoteTags([]);
    setNoteTagsInput("");
    setNoteSourceUrl("");
    setNoteSourceType("text");
    setNoteAiModel("DeepSeek-R1");
    setEditingNoteId(null);
    setSelectedPromptId(null);
    setFileContent("");
    setFileName("");
  }

  function openNoteModal(note?: Note) {
    if (note) {
      setEditingNoteId(note.id);
      setNoteTitle(note.title);
      setNoteContent(note.content);
      setNoteSummary(note.summary || "");
      setNoteTags(note.tags || []);
      setNoteTagsInput((note.tags || []).join(", "));
      setNoteAiModel(note.ai_model || "DeepSeek-R1");
      setNoteSourceType(
        (note.source_type as "text" | "url" | "file") || "text",
      );
      setNoteSourceUrl(note.source_url || "");
      setSelectedPromptId(note.prompt_id || null);
    } else {
      resetNoteForm();
    }
    setNoteModalOpen(true);
  }

  // ==================== HANDLE SUBMIT PROMPTS ====================
  const handlePromptSubmit = async () => {
    if (!promptTitle.trim() || !promptContent.trim()) {
      toast.error("Por favor, completa el título y el contenido.");
      return;
    }

    try {
      setPromptSaving(true);
      const loadingToast = toast.loading(
        editingPromptId ? "Actualizando prompt..." : "Guardando prompt...",
      );

      const promptData = {
        title: promptTitle.trim(),
        content: promptContent.trim(),
        category: promptCategory,
        tags: promptTags.length > 0 ? promptTags : null,
        user_id: user.id,
      };

      let result;
      if (editingPromptId) {
        result = await supabase
          .from("prompts")
          .update(promptData)
          .eq("id", editingPromptId);
      } else {
        result = await supabase.from("prompts").insert([promptData]);
      }

      if (result.error) throw result.error;

      toast.success(
        editingPromptId ? "¡Prompt actualizado!" : "¡Prompt guardado!",
        { id: loadingToast },
      );
      setPromptModalOpen(false);
      resetPromptForm();
      fetchPrompts();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setPromptSaving(false);
    }
  };

  function resetPromptForm() {
    setPromptTitle("");
    setPromptContent("");
    setPromptCategory("texto");
    setPromptTags([]);
    setPromptTagsInput("");
    setEditingPromptId(null);
  }

  function openPromptModal(prompt?: Prompt) {
    if (prompt) {
      setEditingPromptId(prompt.id);
      setPromptTitle(prompt.title);
      setPromptContent(prompt.content);
      setPromptCategory(prompt.category);
      setPromptTags(prompt.tags || []);
      setPromptTagsInput((prompt.tags || []).join(", "));
    } else {
      resetPromptForm();
    }
    setPromptModalOpen(true);
  }

  // ==================== FUNCIONES CRUD PROMPTS ====================
  const handleDeletePrompt = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este prompt?")) return;

    try {
      const { error } = await supabase.from("prompts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Prompt eliminado");
      fetchPrompts();
    } catch (err: any) {
      toast.error("Error al eliminar: " + err.message);
    }
  };

  const handleCopyPrompt = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);

      const { error } = await supabase
        .from("prompts")
        .update({ times_used: prompt.times_used + 1 })
        .eq("id", prompt.id);

      if (error) throw error;

      toast.success("¡Prompt copiado al portapapeles! 📋");
      fetchPrompts();
    } catch (err: any) {
      toast.error("Error al copiar: " + err.message);
    }
  };

  // ==================== FUNCIONES DE NAVEGACIÓN Y FILTROS ====================
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("👋 Sesión cerrada correctamente");
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión. Inténtalo de nuevo.");
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta nota?")) return;
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
      toast.success("Nota eliminada");
      fetchNotes();
    } catch (err: any) {
      toast.error("Error al eliminar: " + err.message);
    }
  };

  const handleDeleteTag = async (tagToDelete: string) => {
    if (
      !confirm(
        `¿Eliminar la etiqueta "#${tagToDelete}" de todas las ${activeTab}?`,
      )
    )
      return;

    try {
      if (activeTab === "notes") {
        const notesWithTag = notes.filter((n) =>
          (n.tags || []).includes(tagToDelete),
        );
        const notePromises = notesWithTag.map((note) => {
          const updatedTags = (note.tags || []).filter(
            (t) => t !== tagToDelete,
          );
          return supabase
            .from("notes")
            .update({ tags: updatedTags.length > 0 ? updatedTags : null })
            .eq("id", note.id);
        });
        await Promise.all(notePromises);
        await fetchNotes();
      } else if (activeTab === "prompts") {
        const promptsWithTag = prompts.filter((p) =>
          (p.tags || []).includes(tagToDelete),
        );
        const promptPromises = promptsWithTag.map((prompt) => {
          const updatedTags = (prompt.tags || []).filter(
            (t) => t !== tagToDelete,
          );
          return supabase
            .from("prompts")
            .update({ tags: updatedTags.length > 0 ? updatedTags : null })
            .eq("id", prompt.id);
        });
        await Promise.all(promptPromises);
        await fetchPrompts();
      }

      if (selectedTag === tagToDelete) setSelectedTag(null);
      toast.success(`Etiqueta "#${tagToDelete}" eliminada de ${activeTab}`);
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const addNoteSuggestion = (index: number) => {
    const suggestion = noteSuggestions[index];
    if (!suggestion) return;
    const lastTagIndex = noteTags.length - 1;
    const newTags = noteTags.filter((_, i) => i !== lastTagIndex);
    const updatedTags = [...newTags, suggestion];
    setNoteTags(updatedTags);
    setNoteTagsInput(updatedTags.join(", "));
    setNoteShowSuggestions(false);
    setNoteSelectedSuggestion(-1);
  };

  const addPromptSuggestion = (index: number) => {
    const suggestion = promptSuggestions[index];
    if (!suggestion) return;
    const lastTagIndex = promptTags.length - 1;
    const newTags = promptTags.filter((_, i) => i !== lastTagIndex);
    const updatedTags = [...newTags, suggestion];
    setPromptTags(updatedTags);
    setPromptTagsInput(updatedTags.join(", "));
    setPromptShowSuggestions(false);
    setPromptSelectedSuggestion(-1);
  };

  // ==================== RENDER ====================
  return (
    <div className="flex h-screen w-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 flex flex-col gap-4 select-none h-full">
        {/* LOGO */}
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl">🔒</span>
          <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            ChatVault
          </h1>
        </div>

        {/* TABS: Notas / Prompts / Arena */}
        <div className="flex rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 p-1">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "notes"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            📝 Notas
          </button>
          <button
            onClick={() => setActiveTab("prompts")}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "prompts"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            📚 Prompts
          </button>
          <button
            onClick={() => setActiveTab("arena")}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "arena"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            🥊 Arena
          </button>
        </div>

        {/* 3. 🔄 BOTÓN DE RESETEO DE FILTROS */}
        <button
          onClick={() => {
            setSelectedTag(null);
            setSelectedAiModel(null);
            setSelectedPromptCategory(null);
            setDateFilter("all");
            setStartDate("");
            setEndDate("");
            setSearchQuery("");
            setPromptSearchQuery("");
            setArenaSearchQuery("");
            setShowFavorites(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors border border-dashed border-zinc-300 dark:border-zinc-700"
        >
          <span className="text-base">🔄</span>
          Mostrar todo
          <span className="ml-auto text-[10px] text-zinc-400">
            (resetear filtros)
          </span>
        </button>

        {/* Línea separadora */}
        <div className="border-t border-zinc-200/50 dark:border-zinc-800/50" />

        {/* FILTRO DE FAVORITOS */}
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            showFavorites
              ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
          }`}
        >
          ⭐ {showFavorites ? "Mostrando favoritos" : "Ver favoritos"}
        </button>

        {/* 1. FILTRO POR IA (PRIMERO) */}
        {activeTab === "notes" && allAiModels.length > 0 && (
          <div className="space-y-1">
            <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              🤖 Modelos de IA
            </p>
            <div className="space-y-0.5">
              {allAiModels.map((model) => (
                <button
                  key={model}
                  onClick={() =>
                    setSelectedAiModel(selectedAiModel === model ? null : model)
                  }
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                    selectedAiModel === model
                      ? "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <span>{model}</span>
                  <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full text-zinc-400">
                    {notes.filter((n) => n.ai_model === model).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. ETIQUETAS POR SECCIÓN (Independientes) */}
        <div className="space-y-1 flex-none">
          <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            #️⃣ Etiquetas{" "}
            {activeTab === "notes"
              ? "(Notas)"
              : activeTab === "prompts"
                ? "(Prompts)"
                : ""}
          </p>
          <div className="max-h-32 overflow-y-auto pr-1 space-y-1 scroll-tags">
            {activeTab === "notes" && (
              <>
                {noteTagsFromNotes.length === 0 ? (
                  <p className="px-2 text-xs text-zinc-400 italic">
                    No hay etiquetas en notas
                  </p>
                ) : (
                  noteTagsFromNotes.map((t) => (
                    <div
                      key={t}
                      className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <button
                        onClick={() =>
                          setSelectedTag(selectedTag === t ? null : t)
                        }
                        className={`flex-1 text-left text-sm font-medium capitalize transition-colors ${
                          selectedTag === t
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        # {t}
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full text-zinc-400">
                          {
                            notes.filter((n) => (n.tags || []).includes(t))
                              .length
                          }
                        </span>
                        <button
                          onClick={() => handleDeleteTag(t)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === "prompts" && (
              <>
                {promptTagsFromPrompts.length === 0 ? (
                  <p className="px-2 text-xs text-zinc-400 italic">
                    No hay etiquetas en prompts
                  </p>
                ) : (
                  promptTagsFromPrompts.map((t) => (
                    <div
                      key={t}
                      className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <button
                        onClick={() =>
                          setSelectedTag(selectedTag === t ? null : t)
                        }
                        className={`flex-1 text-left text-sm font-medium capitalize transition-colors ${
                          selectedTag === t
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        # {t}
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full text-zinc-400">
                          {
                            prompts.filter((p) => (p.tags || []).includes(t))
                              .length
                          }
                        </span>
                        <button
                          onClick={() => handleDeleteTag(t)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === "arena" && (
              <p className="px-2 text-xs text-zinc-400 italic">
                Las etiquetas de la Arena estarán disponibles pronto
              </p>
            )}
          </div>
        </div>

        {/* 3. FILTROS POR FECHA (TERCERO) */}
        {activeTab === "notes" && (
          <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
            <p className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              🕒 Por Fecha
            </p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setDateFilter("today");
                  setStartDate("");
                  setEndDate("");
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  dateFilter === "today"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`}
              >
                ☀️ Hoy
              </button>
              <button
                onClick={() => {
                  setDateFilter("week");
                  setStartDate("");
                  setEndDate("");
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  dateFilter === "week"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`}
              >
                📅 Últimos 7 días
              </button>
              <button
                onClick={() => {
                  setDateFilter("month");
                  setStartDate("");
                  setEndDate("");
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  dateFilter === "month"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`}
              >
                🗓️ Últimos 30 días
              </button>
            </div>

            {/* RANGO PERSONALIZADO */}
            <div className="pt-2 mt-1 border-t border-zinc-100 dark:border-zinc-800/40 space-y-1.5">
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
        )}

        {/* CATEGORÍAS (Solo visibles en la tab de Prompts) */}
        {activeTab === "prompts" && (
          <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
            <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              📂 Categorías
            </p>
            <div className="space-y-0.5">
              {["imagen", "texto", "codigo", "video", "mcp", "otro"].map(
                (cat) => {
                  const count = prompts.filter(
                    (p) => p.category === cat,
                  ).length;
                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        setSelectedPromptCategory(
                          selectedPromptCategory === cat ? null : cat,
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                        selectedPromptCategory === cat
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full text-zinc-400">
                        {count}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        )}
        {/* 📊 ESTADÍSTICAS */}
        <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
          <div className="flex justify-between items-center border-b border-zinc-100/50 dark:border-zinc-800/50 pb-1">
            <p className="px-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              📊 Resumen
            </p>
          </div>
          <div className="space-y-1.5 px-1 text-xs text-zinc-600 dark:text-zinc-400 mt-1.5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">📝 Notas</span>
              <span className="font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full text-[11px]">
                {notes.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">📚 Prompts</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full text-[11px]">
                {prompts.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                🥊 Comparaciones
              </span>
              <span className="font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full text-[11px]">
                {arenaComparisons.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">⭐ Favoritas</span>
              <span className="font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full text-[11px]">
                {notes.filter((n) => n.is_favorite).length +
                  prompts.filter((p) => p.is_favorite).length}
              </span>
            </div>

            {/* Prompt más usado */}
            {prompts.length > 0 && (
              <div className="mt-1 pt-1 border-t border-zinc-100/50 dark:border-zinc-800/50">
                <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                  🔥 Más usado:
                </p>
                <p className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300 truncate flex items-center justify-between">
                  <span className="truncate max-w-[120px]">
                    {prompts.sort((a, b) => b.times_used - a.times_used)[0]
                      ?.title || "Ninguno"}
                  </span>
                  <span className="text-zinc-400 font-normal bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full text-[10px]">
                    {prompts.sort((a, b) => b.times_used - a.times_used)[0]
                      ?.times_used || 0}
                  </span>
                </p>
              </div>
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

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-950">
        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder={
                activeTab === "notes"
                  ? "Buscar en notas..."
                  : activeTab === "prompts"
                    ? "Buscar en prompts (título, contenido, tags)..."
                    : "Buscar en comparaciones..."
              }
              value={
                activeTab === "notes"
                  ? searchQuery
                  : activeTab === "prompts"
                    ? promptSearchQuery
                    : arenaSearchQuery
              }
              onChange={(e) => {
                if (activeTab === "notes") setSearchQuery(e.target.value);
                else if (activeTab === "prompts")
                  setPromptSearchQuery(e.target.value);
                else setArenaSearchQuery(e.target.value);
              }}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>

          <button
            onClick={() => {
              if (activeTab === "notes") openNoteModal();
              else if (activeTab === "prompts") openPromptModal();
              else setArenaModalOpen(true);
            }}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors ml-4"
          >
            {activeTab === "notes" && "➕ Nueva nota"}
            {activeTab === "prompts" && "📚 Nuevo prompt"}
            {activeTab === "arena" && "🥊 Nueva comparación"}
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

        {/* CONTENIDO SEGÚN TAB */}
        <section className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-zinc-50/50 via-white/50 to-zinc-50/30 dark:from-zinc-950 dark:via-zinc-950/95 dark:to-zinc-950">
          {/* ==================== TAB NOTAS ==================== */}
          {activeTab === "notes" && (
            <>
              {notesLoading ? (
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
                    No hay notas
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    Crea tu primera nota o ajusta los filtros
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {filteredNotes.map((note, index) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={openNoteModal}
                      onDelete={handleDeleteNote}
                      onToggleFavorite={(id, isFavorite) =>
                        toggleFavorite(id, "notes", isFavorite)
                      }
                      index={index}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ==================== TAB PROMPTS ==================== */}
          {activeTab === "prompts" && (
            <>
              {promptsLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 p-5 min-h-[200px] animate-pulse"
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
                      <div className="h-8 w-1/3 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                  ))}
                </div>
              ) : filteredPrompts.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/30">
                  <span className="text-4xl mb-4">📚</span>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    No hay prompts
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    Guarda tu primer prompt reutilizable
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredPrompts.map((prompt, index) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onEdit={openPromptModal}
                      onDelete={handleDeletePrompt}
                      onCopy={handleCopyPrompt}
                      onToggleFavorite={(id, isFavorite) =>
                        toggleFavorite(id, "prompts", isFavorite)
                      }
                      index={index}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ==================== TAB ARENA ==================== */}
          {activeTab === "arena" && (
            <>
              {arenaLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 p-5 min-h-[200px] animate-pulse"
                    >
                      <div className="h-5 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-16 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-16 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                      </div>
                      <div className="h-8 w-1/3 rounded-lg bg-zinc-200 dark:bg-zinc-800 mt-3" />
                    </div>
                  ))}
                </div>
              ) : filteredArenaComparisons.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/30">
                  <span className="text-4xl mb-4">🥊</span>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    No hay comparaciones
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    Crea tu primera comparación en la Arena
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredArenaComparisons.map((comparison, index) => (
                    <ArenaCard
                      key={comparison.id}
                      comparison={comparison}
                      onDelete={handleDeleteArenaComparison}
                      onExpand={openArenaDetail}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* ==================== MODALES ==================== */}
      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSubmit={handleNoteSubmit}
        title={noteTitle}
        setTitle={setNoteTitle}
        content={noteContent}
        setContent={setNoteContent}
        summary={noteSummary}
        setSummary={setNoteSummary}
        tags={noteTags}
        tagsInput={noteTagsInput}
        setTagsInput={setNoteTagsInput}
        setTags={setNoteTags}
        aiModel={noteAiModel}
        setAiModel={setNoteAiModel}
        sourceType={noteSourceType}
        setSourceType={setNoteSourceType}
        sourceUrl={noteSourceUrl}
        setSourceUrl={setNoteSourceUrl}
        saving={noteSaving}
        allTags={noteTagsFromNotes}
        suggestions={noteSuggestions}
        showSuggestions={noteShowSuggestions}
        selectedSuggestion={noteSelectedSuggestion}
        addSuggestion={addNoteSuggestion}
        setSuggestions={setNoteSuggestions}
        setShowSuggestions={setNoteShowSuggestions}
        setSelectedSuggestion={setNoteSelectedSuggestion}
        editingNoteId={editingNoteId}
        prompts={promptOptions} // 👈 PASA LA LISTA DE PROMPTS
        selectedPromptId={selectedPromptId}
        setSelectedPromptId={setSelectedPromptId}
        fileContent={fileContent} // 👈 AÑADE
        setFileContent={setFileContent} // 👈 AÑADE
        fileName={fileName} // 👈 AÑADE
        setFileName={setFileName}
      />

      <PromptModal
        isOpen={promptModalOpen}
        onClose={() => setPromptModalOpen(false)}
        onSubmit={handlePromptSubmit}
        title={promptTitle}
        setTitle={setPromptTitle}
        content={promptContent}
        setContent={setPromptContent}
        category={promptCategory}
        setCategory={setPromptCategory}
        tags={promptTags}
        tagsInput={promptTagsInput}
        setTagsInput={setPromptTagsInput}
        setTags={setPromptTags}
        saving={promptSaving}
        allTags={promptTagsFromPrompts}
        suggestions={promptSuggestions}
        showSuggestions={promptShowSuggestions}
        selectedSuggestion={promptSelectedSuggestion}
        addSuggestion={addPromptSuggestion}
        setSuggestions={setPromptSuggestions}
        setShowSuggestions={setPromptShowSuggestions}
        setSelectedSuggestion={setPromptSelectedSuggestion}
        editingId={editingPromptId}
      />

      <ArenaModal
        isOpen={arenaModalOpen}
        onClose={() => setArenaModalOpen(false)}
        onSubmit={handleArenaSubmit}
        saving={arenaSaving}
      />
      {/* ✅ MODAL DE COMPARACIÓN DETALLADA (NUEVO) */}
      <ArenaDetailModal
        isOpen={arenaDetailModalOpen}
        onClose={() => setArenaDetailModalOpen(false)}
        comparison={selectedComparison}
      />
    </div>
  );
}
