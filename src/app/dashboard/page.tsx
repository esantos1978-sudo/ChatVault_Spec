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
import ArenaModal from "@/components/ArenaModal";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // ==================== ATAJO DE TECLADO ⌘K ====================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Buscar"]',
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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

      // ✅ DETERMINAR EL CONTENIDO FINAL
      let finalContent = noteContent.trim();

      // ✅ SI ES UN ARCHIVO Y HAY CONTENIDO EXTRAÍDO, USARLO
      if (noteSourceType === "file" && fileContent) {
        finalContent = fileContent;
        console.log(
          "📄 Usando contenido del archivo:",
          finalContent.length,
          "caracteres",
        );
      }

      const noteData = {
        title: noteTitle.trim(),
        content: finalContent, // 👈 AHORA USA EL CONTENIDO CORRECTO
        summary: noteSummary.trim() || null,
        tags: noteTags.length > 0 ? noteTags : null,
        ai_model: noteAiModel,
        source_type: noteSourceType,
        source_url: noteSourceType === "url" ? noteSourceUrl : null,
        user_id: user.id,
        prompt_id: selectedPromptId,
      };

      console.log("📤 Datos a guardar:", noteData);

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
      <aside
        className={`fixed md:relative top-0 left-0 z-50 w-60 h-full bg-zinc-950 border-r border-zinc-800/40 flex flex-col select-none overflow-y-auto transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* LOGO - CENTRADO Y MÁS GRANDE */}
        <div className="flex justify-center pt-6 pb-5 px-3">
          <img
            src="/images/kimberlite-logo.png"
            alt="Kimberlite"
            className="h-18 w-auto"
          />
        </div>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="flex flex-col px-2 gap-0.5">
          <button
            onClick={() => setActiveTab("notes")}
            className={`sidebar-item ${activeTab === "notes" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              description
            </span>
            <span>Notas</span>
            <span className="count">{notes.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("prompts")}
            className={`sidebar-item ${activeTab === "prompts" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Prompts</span>
            <span className="count">{prompts.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("arena")}
            className={`sidebar-item ${activeTab === "arena" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              swords
            </span>
            <span>Arena</span>
            <span className="count">{arenaComparisons.length}</span>
          </button>
        </nav>

        <div className="divider mx-3 my-2" />

        {/* FILTROS */}
        <div className="flex flex-col px-2 gap-0.5">
          {/* FAVORITOS */}
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`sidebar-item ${showFavorites ? "active" : ""}`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{
                fontVariationSettings: showFavorites ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              star
            </span>
            <span>Favoritos</span>
          </button>

          {/* RESET FILTROS */}
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
            className="sidebar-item"
          >
            <span className="material-symbols-outlined text-[18px]">
              refresh
            </span>
            <span>Mostrar todo</span>
          </button>
        </div>

        {/* MODELOS DE IA */}
        {activeTab === "notes" && allAiModels.length > 0 && (
          <>
            <div className="divider mx-3 my-2" />
            <div className="sidebar-section-label">Modelos de IA</div>
            <div className="flex flex-col px-2 gap-0.5 max-h-32 overflow-y-auto">
              {allAiModels.map((model) => (
                <button
                  key={model}
                  onClick={() =>
                    setSelectedAiModel(selectedAiModel === model ? null : model)
                  }
                  className={`sidebar-item ${selectedAiModel === model ? "active" : ""}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    neurology
                  </span>
                  <span className="truncate">{model}</span>
                  <span className="count">
                    {notes.filter((n) => n.ai_model === model).length}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ETIQUETAS */}
        <div className="divider mx-3 my-2" />
        <div className="sidebar-section-label">
          Etiquetas
          {activeTab === "notes"
            ? " — Notas"
            : activeTab === "prompts"
              ? " — Prompts"
              : ""}
        </div>
        <div className="flex flex-col px-2 gap-0.5 max-h-32 overflow-y-auto">
          {activeTab === "notes" && (
            <>
              {noteTagsFromNotes.length === 0 ? (
                <span className="px-3 py-2 text-xs text-zinc-600 italic">
                  Sin etiquetas
                </span>
              ) : (
                noteTagsFromNotes.map((t) => (
                  <div key={t} className="group flex items-center">
                    <button
                      onClick={() =>
                        setSelectedTag(selectedTag === t ? null : t)
                      }
                      className={`sidebar-item flex-1 ${selectedTag === t ? "active" : ""}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        sell
                      </span>
                      <span>{t}</span>
                      <span className="count">
                        {notes.filter((n) => (n.tags || []).includes(t)).length}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteTag(t)}
                      className="opacity-0 group-hover:opacity-100 p-1 mr-1 text-zinc-600 hover:text-red-400 transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        close
                      </span>
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "prompts" && (
            <>
              {promptTagsFromPrompts.length === 0 ? (
                <span className="px-3 py-2 text-xs text-zinc-600 italic">
                  Sin etiquetas
                </span>
              ) : (
                promptTagsFromPrompts.map((t) => (
                  <div key={t} className="group flex items-center">
                    <button
                      onClick={() =>
                        setSelectedTag(selectedTag === t ? null : t)
                      }
                      className={`sidebar-item flex-1 ${selectedTag === t ? "active" : ""}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        sell
                      </span>
                      <span>{t}</span>
                      <span className="count">
                        {
                          prompts.filter((p) => (p.tags || []).includes(t))
                            .length
                        }
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteTag(t)}
                      className="opacity-0 group-hover:opacity-100 p-1 mr-1 text-zinc-600 hover:text-red-400 transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        close
                      </span>
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "arena" && (
            <span className="px-3 py-2 text-xs text-zinc-600 italic">
              Próximamente
            </span>
          )}
        </div>

        {/* FILTROS POR FECHA */}
        {activeTab === "notes" && (
          <>
            <div className="divider mx-3 my-2" />
            <div className="sidebar-section-label">Por fecha</div>
            <div className="flex flex-col px-2 gap-0.5">
              {[
                { key: "today", label: "Hoy", icon: "today" },
                { key: "week", label: "Últimos 7 días", icon: "date_range" },
                {
                  key: "month",
                  label: "Últimos 30 días",
                  icon: "calendar_month",
                },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setDateFilter(key as "today" | "week" | "month");
                    setStartDate("");
                    setEndDate("");
                  }}
                  className={`sidebar-item ${dateFilter === key ? "active" : ""}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {icon}
                  </span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* RANGO PERSONALIZADO */}
            <div className="px-3 pt-2 mt-1 space-y-1.5">
              <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                Rango personalizado
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="text-[10px] text-zinc-600 block mb-0.5">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDateFilter("all");
                    }}
                    className="w-full text-[11px] rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-zinc-300 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-180"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-600 block mb-0.5">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDateFilter("all");
                    }}
                    className="w-full text-[11px] rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-zinc-300 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-180"
                  />
                </div>
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="w-full text-left text-[10px] text-zinc-600 hover:text-zinc-400 font-medium transition-colors"
                >
                  Limpiar fechas
                </button>
              )}
            </div>
          </>
        )}

        {/* CATEGORÍAS (Prompts) */}
        {activeTab === "prompts" && (
          <>
            <div className="divider mx-3 my-2" />
            <div className="sidebar-section-label">Categorías</div>
            <div className="flex flex-col px-2 gap-0.5">
              {["imagen", "texto", "codigo", "video"].map((cat) => {
                const count = prompts.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedPromptCategory(
                        selectedPromptCategory === cat ? null : cat,
                      )
                    }
                    className={`sidebar-item ${selectedPromptCategory === cat ? "active" : ""}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      folder
                    </span>
                    <span className="capitalize">{cat}</span>
                    <span className="count">{count}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* CERRAR SESIÓN */}
        <div className="mt-auto px-2 pt-2 pb-4">
          <button onClick={handleLogout} className="sidebar-item">
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-950 pt-16">
        <header className="h-16 fixed top-0 right-0 left-0 md:left-[240px] z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/30 dark:border-zinc-800/30 flex items-center justify-between px-5 md:px-8">
          {/* Botón de menú (solo en móviles) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 rounded-lg transition-all duration-180"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>

          {/* Búsqueda */}
          <div className="flex-1 max-w-xl ml-3 md:ml-0">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-400 transition-colors duration-180 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar en notas... (⌘ K)"
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
                className="w-full h-[44px] rounded-lg border border-zinc-800 bg-zinc-950 px-3 pl-10 text-sm text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-180"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-3 md:gap-5">
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 rounded-lg transition-all duration-180">
                <span className="material-symbols-outlined text-[18px]">
                  notifications
                </span>
              </button>
              <button className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 rounded-lg transition-all duration-180">
                <span className="material-symbols-outlined text-[18px]">
                  help
                </span>
              </button>
            </div>

            <div className="h-6 w-px bg-zinc-200/50 dark:bg-zinc-800/40 hidden md:block" />

            {/* Botón Nueva nota */}
            <button
              onClick={() => {
                if (activeTab === "notes") openNoteModal();
                else if (activeTab === "prompts") openPromptModal();
                else setArenaModalOpen(true);
              }}
              className="flex items-center gap-1.5 gemstone-gradient text-white px-3 py-2 md:px-4 md:py-2 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 transition-all duration-180 text-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span className="hidden sm:inline">
                {activeTab === "notes" && "Nota"}
                {activeTab === "prompts" && "Prompt"}
                {activeTab === "arena" && "Batalla"}
              </span>
              <span className="sm:hidden">
                {activeTab === "notes" && "+"}
                {activeTab === "prompts" && "+"}
                {activeTab === "arena" && "+"}
              </span>
            </button>
          </div>
        </header>

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">
              check_circle
            </span>
            {success}
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
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-zinc-800/20 bg-zinc-900/20">
                  <span className="material-symbols-outlined text-[32px] text-zinc-700 mb-4">
                    inbox
                  </span>
                  <p className="text-sm font-medium text-zinc-500">
                    No hay notas
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
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
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-zinc-800/20 bg-zinc-900/20">
                  <span className="material-symbols-outlined text-[32px] text-zinc-700 mb-4">
                    library_books
                  </span>
                  <p className="text-sm font-medium text-zinc-500">
                    No hay prompts
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
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
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-zinc-800/20 bg-zinc-900/20">
                  <span className="material-symbols-outlined text-[32px] text-zinc-700 mb-4">
                    swords
                  </span>
                  <p className="text-sm font-medium text-zinc-500">
                    No hay comparaciones
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
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
