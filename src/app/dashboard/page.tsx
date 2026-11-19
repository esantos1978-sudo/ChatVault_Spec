"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

// 🎨 Lenguaje visual compartido con la landing (FASE 1: tokens + shell)
import {
  Inter,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "@/app/dashboard-tokens.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-kl-body",
  display: "swap",
});

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-kl-display",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-kl-mono",
  display: "swap",
});

// ✅ Componentes normales (síncronos, siempre visibles)
import { NoteCard } from "@/components/NoteCard";
import { PromptCard } from "@/components/PromptCard";
import { SkillCard } from "@/components/SkillCard";
import { ArenaCard } from "@/components/ArenaCard";
import { NoteCardSkeleton } from "@/components/NoteCardSkeleton";
import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { SkillCardSkeleton } from "@/components/SkillCardSkeleton";
import { ArenaCardSkeleton } from "@/components/ArenaCardSkeleton";

// ✅ Modales cargados bajo demanda (solo cuando se abren)
const NoteModal = dynamic(() => import("@/components/NoteModal"), {
  ssr: false,
});
const PromptModal = dynamic(() => import("@/components/PromptModal"), {
  ssr: false,
});
const SkillModal = dynamic(() => import("@/components/SkillModal"), {
  ssr: false,
});
const ArenaModal = dynamic(() => import("@/components/ArenaModal"), {
  ssr: false,
});
const ArenaDetailModal = dynamic(
  () =>
    import("@/components/ArenaDetailModal").then((mod) => ({
      default: mod.ArenaDetailModal,
    })),
  { ssr: false },
);
const PromptDetailModal = dynamic(
  () => import("@/components/PromptDetailModal"),
  { ssr: false },
);

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

interface Skill {
  id: string;
  title: string;
  description?: string | null;
  content: string;
  category: string;
  tags?: string[];
  times_used: number;
  created_at: string;
  is_favorite?: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  // ==================== OBTENER USUARIO AUTENTICADO ====================
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // replace (no push) para que el botón atrás no rebote entre /dashboard y /
        router.replace("/");
        return;
      }
      setUser(user);
      setAuthLoading(false);
    };
    getUser();
  }, [router]);

  // ==================== ESTADOS GENERALES ====================
  const [activeTab, setActiveTab] = useState<
    "prompts" | "skills" | "notes" | "arena"
  >("prompts");
  const [showFavorites, setShowFavorites] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  // ==================== ESTADOS PARA SKILLS ====================
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<
    string | null
  >(null);

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillTitle, setSkillTitle] = useState("");
  const [skillDescription, setSkillDescription] = useState("");
  const [skillContent, setSkillContent] = useState("");
  const [skillCategory, setSkillCategory] = useState("General");
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [skillTagsInput, setSkillTagsInput] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [skillShowSuggestions, setSkillShowSuggestions] = useState(false);
  const [skillSelectedSuggestion, setSkillSelectedSuggestion] = useState(-1);
  const [skillSaving, setSkillSaving] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  // ==================== OBTENER PROMPTS PARA EL SELECTOR ====================
  const promptOptions = prompts.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
  }));

  // ==================== ESTADOS PARA LA ARENA ====================
  const [arenaComparisons, setArenaComparisons] = useState<any[]>([]);
  const [arenaLoading, setArenaLoading] = useState(true);
  const [arenaModalOpen, setArenaModalOpen] = useState(false);
  const [arenaSaving, setArenaSaving] = useState(false);
  const [arenaSearchQuery, setArenaSearchQuery] = useState("");
  const [arenaDetailModalOpen, setArenaDetailModalOpen] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<any>(null);
  const [arenaSelectedPromptId, setArenaSelectedPromptId] = useState<
    string | null
  >(null);

  // ==================== ESTADOS PARA PROMPT DETAIL MODAL ====================
  const [promptDetailModalOpen, setPromptDetailModalOpen] = useState(false);
  const [selectedPromptForDetail, setSelectedPromptForDetail] =
    useState<Prompt | null>(null);

  // ==================== OBTENER ETIQUETAS POR SECCIÓN ====================
  // ✅ SOLO UNA VEZ DEFINIDAS
  const noteTagsFromNotes = Array.from(
    new Set(notes.flatMap((n) => n.tags || [])),
  );

  const promptTagsFromPrompts = Array.from(
    new Set(prompts.flatMap((p) => p.tags || [])),
  );

  const skillTagsFromSkills = Array.from(
    new Set(skills.flatMap((s) => s.tags || [])),
  );

  const skillCategories = Array.from(
    new Set(skills.map((s) => s.category).filter((c): c is string => !!c)),
  );

  // ==================== OBTENER MODELOS DE IA ÚNICOS ====================
  const allAiModels = Array.from(
    new Set(
      notes.map((n) => n.ai_model).filter((model): model is string => !!model),
    ),
  );

  // ==================== EFECTOS ====================
  useEffect(() => {
    // Solo cargar datos cuando el usuario esté autenticado
    if (user && !authLoading) {
      fetchNotes();
      fetchPrompts();
      fetchSkills();
      fetchArenaComparisons();
    }
  }, [user, authLoading]);

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

  // ==================== DRAWER: ESCAPE, FOCUS, BODY SCROLL ====================
  useEffect(() => {
    if (!sidebarOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus al drawer
    setTimeout(() => {
      sidebarRef.current?.focus();
    }, 100);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen]);

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
      toast.error("Error cargando notas: " + err.message);
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
      // ✅ Siempre abrir en la pestaña "Pegar conversación" para ver el contenido
      setNoteSourceType("text");
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
      toast.error("Error cargando prompts: " + err.message);
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

  // ==================== FUNCIONES PARA SKILLS ====================
  async function fetchSkills() {
    try {
      setSkillsLoading(true);
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("times_used", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (err: unknown) {
      toast.error(
        "Error cargando skills: " +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      setSkillsLoading(false);
    }
  }

  const filteredSkills = skills
    .filter((s) => (showFavorites ? s.is_favorite === true : true))
    .filter((s) => (selectedTag ? (s.tags || []).includes(selectedTag) : true))
    .filter((s) =>
      selectedSkillCategory ? s.category === selectedSkillCategory : true,
    )
    .filter((s) => {
      const query = skillSearchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        s.title.toLowerCase().includes(query) ||
        (s.description || "").toLowerCase().includes(query) ||
        (s.content || "").toLowerCase().includes(query) ||
        (s.tags && s.tags.some((t) => t.toLowerCase().includes(query)))
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
      toast.error("Error cargando comparaciones: " + err.message);
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
    if (arenaSaving) return; // Prevenir doble clic
    if (!user?.id) {
      console.error("Usuario no autenticado");
      toast.error("Error: sesión expirada. Por favor, inicia sesión de nuevo.");
      return;
    }
    try {
      setArenaSaving(true);
      const { error } = await supabase.from("arena_comparisons").insert([
        {
          prompt: data.prompt,
          prompt_id: data.prompt_id || null,
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
    setSelectedComparison(comparison);
    setArenaDetailModalOpen(true);
  };

  // ==================== TOGGLE FAVORITOS ====================
  const toggleFavorite = async (
    id: string,
    table: "notes" | "prompts" | "skills",
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
      } else if (table === "prompts") {
        setPrompts(
          prompts.map((p) =>
            p.id === id ? { ...p, is_favorite: isFavorite } : p,
          ),
        );
      } else {
        setSkills(
          skills.map((s) =>
            s.id === id ? { ...s, is_favorite: isFavorite } : s,
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
    if (noteSaving) return; // Prevenir doble clic
    if (!user?.id) {
      console.error("Usuario no autenticado");
      toast.error("Error: sesión expirada. Por favor, inicia sesión de nuevo.");
      return;
    }
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
    if (promptSaving) return; // Prevenir doble clic
    if (!user?.id) {
      console.error("Usuario no autenticado");
      toast.error("Error: sesión expirada. Por favor, inicia sesión de nuevo.");
      return;
    }
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
    if (!prompt?.id) {
      console.error("Prompt no encontrado");
      return;
    }
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

  // ==================== HANDLE SUBMIT SKILLS ====================
  const handleSkillSubmit = async () => {
    if (!skillTitle.trim() || !skillContent.trim()) {
      toast.error("Por favor, completa el título y las instrucciones.");
      return;
    }

    try {
      setSkillSaving(true);
      const loadingToast = toast.loading(
        editingSkillId ? "Actualizando skill..." : "Guardando skill...",
      );

      const skillData = {
        title: skillTitle.trim(),
        description: skillDescription.trim() || null,
        content: skillContent.trim(),
        category: skillCategory.trim() || "General",
        tags: skillTags.length > 0 ? skillTags : null,
        user_id: user.id,
      };

      let result;
      if (editingSkillId) {
        result = await supabase
          .from("skills")
          .update(skillData)
          .eq("id", editingSkillId);
      } else {
        result = await supabase.from("skills").insert([skillData]);
      }

      if (result.error) throw result.error;

      toast.success(editingSkillId ? "¡Skill actualizado!" : "¡Skill guardado!", {
        id: loadingToast,
      });
      setSkillModalOpen(false);
      resetSkillForm();
      fetchSkills();
    } catch (err: unknown) {
      toast.error(
        "Error: " + (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      setSkillSaving(false);
    }
  };

  function resetSkillForm() {
    setSkillTitle("");
    setSkillDescription("");
    setSkillContent("");
    setSkillCategory("General");
    setSkillTags([]);
    setSkillTagsInput("");
    setEditingSkillId(null);
  }

  function openSkillModal(skill?: Skill) {
    if (skill) {
      setEditingSkillId(skill.id);
      setSkillTitle(skill.title);
      setSkillDescription(skill.description || "");
      setSkillContent(skill.content);
      setSkillCategory(skill.category || "General");
      setSkillTags(skill.tags || []);
      setSkillTagsInput((skill.tags || []).join(", "));
    } else {
      resetSkillForm();
    }
    setSkillModalOpen(true);
  }

  // ==================== FUNCIONES CRUD SKILLS ====================
  const handleDeleteSkill = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este skill?")) return;

    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      toast.success("Skill eliminado");
      fetchSkills();
    } catch (err: unknown) {
      toast.error(
        "Error al eliminar: " +
          (err instanceof Error ? err.message : String(err)),
      );
    }
  };

  const handleCopySkill = async (skill: Skill) => {
    try {
      await navigator.clipboard.writeText(skill.content);

      const { error } = await supabase
        .from("skills")
        .update({ times_used: (skill.times_used ?? 0) + 1 })
        .eq("id", skill.id);

      if (error) throw error;

      toast.success("¡Skill copiado al portapapeles! 📋");
      fetchSkills();
    } catch (err: unknown) {
      toast.error(
        "Error al copiar: " + (err instanceof Error ? err.message : String(err)),
      );
    }
  };

  // ==================== FUNCIONES DE NAVEGACIÓN Y FILTROS ====================
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("👋 Sesión cerrada correctamente");
      router.push("/");
    } catch (error) {
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
      } else if (activeTab === "skills") {
        const skillsWithTag = skills.filter((s) =>
          (s.tags || []).includes(tagToDelete),
        );
        const skillPromises = skillsWithTag.map((skill) => {
          const updatedTags = (skill.tags || []).filter(
            (t) => t !== tagToDelete,
          );
          return supabase
            .from("skills")
            .update({ tags: updatedTags.length > 0 ? updatedTags : null })
            .eq("id", skill.id);
        });
        await Promise.all(skillPromises);
        await fetchSkills();
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

  const addSkillSuggestion = (index: number) => {
    const suggestion = skillSuggestions[index];
    if (!suggestion) return;
    const lastTagIndex = skillTags.length - 1;
    const newTags = skillTags.filter((_, i) => i !== lastTagIndex);
    const updatedTags = [...newTags, suggestion];
    setSkillTags(updatedTags);
    setSkillTagsInput(updatedTags.join(", "));
    setSkillShowSuggestions(false);
    setSkillSelectedSuggestion(-1);
  };

  // ==================== CERRAR DRAWER AL NAVEGAR ====================
  const navigateAndClose = (tab: "prompts" | "skills" | "notes" | "arena") => {
    setActiveTab(tab);
    setSidebarOpen(false);
    menuButtonRef.current?.focus();
  };

  // ==================== RENDER ====================
  return (
    <div
      className={`kl-dash flex h-dvh w-full overflow-hidden ${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      {/* ================= OVERLAY DEL DRAWER ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => {
            setSidebarOpen(false);
            menuButtonRef.current?.focus();
          }}
          aria-hidden="true"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        ref={sidebarRef}
        tabIndex={-1}
        role="dialog"
        aria-modal={sidebarOpen ? "true" : undefined}
        aria-label="Menú de navegación"
        id="sidebar-drawer"
        className={`kl-dash-sidebar fixed md:relative top-0 left-0 z-50 w-[280px] md:w-60 h-full flex flex-col select-none overflow-y-auto transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* LOGO - CENTRADO Y MÁS GRANDE */}
        <div className="kl-dash-brand flex justify-center pt-6 pb-5 px-3">
          <Image
            src="/images/kimberlite-logo.png"
            alt="Kimberlite"
            width={198}
            height={72}
            className="h-18 w-auto"
          />
        </div>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="flex flex-col px-2 gap-0.5">
          <button
            onClick={() => navigateAndClose("prompts")}
            className={`kl-nav-item ${activeTab === "prompts" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Prompts</span>
            <span className="kl-chip">{prompts.length}</span>
          </button>
          <button
            onClick={() => navigateAndClose("notes")}
            className={`kl-nav-item ${activeTab === "notes" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              description
            </span>
            <span>Notas</span>
            <span className="kl-chip">{notes.length}</span>
          </button>
          <button
            onClick={() => navigateAndClose("arena")}
            className={`kl-nav-item ${activeTab === "arena" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              swords
            </span>
            <span>Arena</span>
            <span className="kl-chip">{arenaComparisons.length}</span>
          </button>
          <button
            onClick={() => navigateAndClose("skills")}
            className={`kl-nav-item ${activeTab === "skills" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              psychology
            </span>
            <span>Skills</span>
            <span className="kl-chip">{skills.length}</span>
          </button>
        </nav>

        <div className="kl-divider mx-3 my-2" />

        {/* FILTROS */}
        <div className="flex flex-col px-2 gap-0.5">
          {/* FAVORITOS */}
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`kl-nav-item ${showFavorites ? "active" : ""}`}
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
              setSelectedSkillCategory(null);
              setDateFilter("all");
              setStartDate("");
              setEndDate("");
              setSearchQuery("");
              setPromptSearchQuery("");
              setSkillSearchQuery("");
              setArenaSearchQuery("");
              setShowFavorites(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="kl-nav-item"
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
            <div className="kl-divider mx-3 my-2" />
            <div className="kl-eyebrow kl-nav-label">Modelos de IA</div>
            <div className="flex flex-col px-2 gap-0.5 max-h-32 overflow-y-auto">
              {allAiModels.map((model) => (
                <button
                  key={model}
                  onClick={() =>
                    setSelectedAiModel(selectedAiModel === model ? null : model)
                  }
                  className={`kl-nav-item ${selectedAiModel === model ? "active" : ""}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    neurology
                  </span>
                  <span className="truncate">{model}</span>
                  <span className="kl-chip">
                    {notes.filter((n) => n.ai_model === model).length}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ETIQUETAS */}
        <div className="kl-divider mx-3 my-2" />
        <div className="kl-eyebrow kl-nav-label">
          Etiquetas
          {activeTab === "notes"
            ? " — Notas"
            : activeTab === "prompts"
              ? " — Prompts"
              : activeTab === "skills"
                ? " — Skills"
                : ""}
        </div>
        <div className="flex flex-col px-2 gap-0.5 max-h-32 overflow-y-auto">
          {activeTab === "notes" && (
            <>
              {noteTagsFromNotes.length === 0 ? (
                <span className="kl-nav-empty px-3 py-2">
                  Sin etiquetas
                </span>
              ) : (
                noteTagsFromNotes.map((t) => (
                  <div key={t} className="group flex items-center">
                    <button
                      onClick={() =>
                        setSelectedTag(selectedTag === t ? null : t)
                      }
                      className={`kl-nav-item flex-1 ${selectedTag === t ? "active" : ""}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        sell
                      </span>
                      <span>{t}</span>
                      <span className="kl-chip">
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
                <span className="kl-nav-empty px-3 py-2">
                  Sin etiquetas
                </span>
              ) : (
                promptTagsFromPrompts.map((t) => (
                  <div key={t} className="group flex items-center">
                    <button
                      onClick={() =>
                        setSelectedTag(selectedTag === t ? null : t)
                      }
                      className={`kl-nav-item flex-1 ${selectedTag === t ? "active" : ""}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        sell
                      </span>
                      <span>{t}</span>
                      <span className="kl-chip">
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

          {activeTab === "skills" && (
            <>
              {skillTagsFromSkills.length === 0 ? (
                <span className="kl-nav-empty px-3 py-2">
                  Sin etiquetas
                </span>
              ) : (
                skillTagsFromSkills.map((t) => (
                  <div key={t} className="group flex items-center">
                    <button
                      onClick={() =>
                        setSelectedTag(selectedTag === t ? null : t)
                      }
                      className={`kl-nav-item flex-1 ${selectedTag === t ? "active" : ""}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        sell
                      </span>
                      <span>{t}</span>
                      <span className="kl-chip">
                        {skills.filter((s) => (s.tags || []).includes(t)).length}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteTag(t)}
                      className="opacity-0 group-hover:opacity-100 p-1 mr-1 text-zinc-600 hover:text-red-400 transition-all"
                      aria-label={`Eliminar etiqueta ${t}`}
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
            <span className="kl-nav-empty px-3 py-2">
              Próximamente
            </span>
          )}
        </div>

        {/* FILTROS POR FECHA */}
        {activeTab === "notes" && (
          <>
            <div className="kl-divider mx-3 my-2" />
            <div className="kl-eyebrow kl-nav-label">Por fecha</div>
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
                  className={`kl-nav-item ${dateFilter === key ? "active" : ""}`}
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
              <span className="kl-eyebrow kl-eyebrow--muted kl-eyebrow--xs">
                Rango personalizado
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="kl-field-label block mb-0.5">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDateFilter("all");
                    }}
                    className="kl-input kl-input--sm"
                  />
                </div>
                <div>
                  <label className="kl-field-label block mb-0.5">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDateFilter("all");
                    }}
                    className="kl-input kl-input--sm"
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
            <div className="kl-divider mx-3 my-2" />
            <div className="kl-eyebrow kl-nav-label">Categorías</div>
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
                    className={`kl-nav-item ${selectedPromptCategory === cat ? "active" : ""}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      folder
                    </span>
                    <span className="capitalize">{cat}</span>
                    <span className="kl-chip">{count}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* CATEGORÍAS (Skills) */}
        {activeTab === "skills" && skillCategories.length > 0 && (
          <>
            <div className="kl-divider mx-3 my-2" />
            <div className="kl-eyebrow kl-nav-label">Categorías</div>
            <div className="flex flex-col px-2 gap-0.5 max-h-40 overflow-y-auto">
              {skillCategories.map((cat) => {
                const count = skills.filter((s) => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedSkillCategory(
                        selectedSkillCategory === cat ? null : cat,
                      )
                    }
                    className={`kl-nav-item ${selectedSkillCategory === cat ? "active" : ""}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      folder
                    </span>
                    <span className="truncate">{cat}</span>
                    <span className="kl-chip">{count}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ==================== CUENTA ==================== */}
        <div className="mt-auto px-2 pt-4">
          <div className="kl-eyebrow kl-nav-label">Cuenta</div>

          <a
            href="/settings"
            className="kl-nav-item kl-nav-item--muted"
          >
            <span className="material-symbols-outlined text-[18px]">
              settings
            </span>
            <span>Configuración</span>
          </a>

          <button
            onClick={handleLogout}
            className="kl-nav-item kl-nav-item--muted"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <main className="kl-dash-main flex-1 flex flex-col min-w-0 overflow-hidden pt-16">
        <header className="kl-dash-header h-16 fixed top-0 right-0 left-0 md:left-60 z-10 flex items-center justify-between gap-2 px-4 md:px-8">
          {/* Botón de menú (solo en móviles) */}
          <button
            ref={menuButtonRef}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="kl-icon-btn kl-dash-menu-toggle shrink-0"
            aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={sidebarOpen}
            aria-controls="sidebar-drawer"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>

          {/* Búsqueda */}
          <div className="flex-1 min-w-0 max-w-xl">
            <div className="kl-search relative">
              <span className="kl-search-icon material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder={
                  activeTab === "arena"
                    ? "Buscar comparaciones..."
                    : activeTab === "prompts"
                      ? "Buscar prompts..."
                      : activeTab === "skills"
                        ? "Buscar skills..."
                        : "Buscar notas..."
                }
                value={
                  activeTab === "notes"
                    ? searchQuery
                    : activeTab === "prompts"
                      ? promptSearchQuery
                      : activeTab === "skills"
                        ? skillSearchQuery
                        : arenaSearchQuery
                }
                onChange={(e) => {
                  if (activeTab === "notes") setSearchQuery(e.target.value);
                  else if (activeTab === "prompts")
                    setPromptSearchQuery(e.target.value);
                  else if (activeTab === "skills")
                    setSkillSearchQuery(e.target.value);
                  else setArenaSearchQuery(e.target.value);
                }}
                aria-label="Buscar en la sección activa"
                className="kl-input kl-input--search"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 md:gap-5 shrink-0">
            <div className="flex items-center gap-1">
              <button
                className="kl-icon-btn"
                aria-label="Notificaciones"
              >
                <span className="material-symbols-outlined text-[18px]">
                  notifications
                </span>
              </button>
              <button
                className="kl-icon-btn"
                aria-label="Ayuda"
              >
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
                else if (activeTab === "skills") openSkillModal();
                else setArenaModalOpen(true);
              }}
              className="kl-btn kl-btn--sm kl-btn--primary"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span className="hidden sm:inline">
                {activeTab === "notes" && "Nota"}
                {activeTab === "prompts" && "Prompt"}
                {activeTab === "skills" && "Skill"}
                {activeTab === "arena" && "Comparación"}
              </span>
              <span className="sm:hidden">
                {activeTab === "notes" && "+"}
                {activeTab === "prompts" && "+"}
                {activeTab === "skills" && "+"}
                {activeTab === "arena" && "+"}
              </span>
            </button>
          </div>
        </header>

        {/* CONTENIDO SEGÚN TAB */}
        <section className="kl-dash-canvas flex-1 overflow-y-auto p-4 md:p-6">
          {/* ==================== TAB NOTAS ==================== */}
          {activeTab === "notes" && (
            <>
              {notesLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <NoteCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/20 bg-zinc-900/20 px-4 md:px-8 py-10 md:py-16">
                  <div className="max-w-md text-center space-y-6">
                    {/* Icono */}
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-800/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[28px] text-zinc-400">
                        diamond
                      </span>
                    </div>

                    {/* Título */}
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        Cada conversación importante merece conservarse
                      </h3>
                      <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                        El conocimiento solo tiene valor si puedes encontrarlo.
                      </p>
                    </div>

                    {/* Botón */}
                    <button
                      onClick={() => openNoteModal()}
                      className="inline-flex items-center gap-2 gemstone-gradient text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 transition-all duration-180 text-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        add
                      </span>
                      Guardar mi primera Nota
                    </button>

                    {/* Tarjeta de ejemplo no interactiva */}
                    <div className="mt-10 opacity-80 pointer-events-none select-none">
                      <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/60 p-5 text-left">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400 border border-violet-500/20">
                              ChatGPT-4o
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-700/50">
                              #arquitectura
                            </span>
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">
                          Diseño de sistema escalable
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                          Para diseñar un sistema escalable, empieza por
                          identificar los cuellos de botella...
                        </p>
                      </div>
                      <p className="text-[10px] text-zinc-600 mt-3 text-center">
                        Vista previa de una nota.
                      </p>
                    </div>
                  </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <PromptCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredPrompts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/20 bg-zinc-900/20 px-4 md:px-8 py-10 md:py-16">
                  <div className="max-w-lg text-center space-y-6">
                    {/* Icono */}
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-800/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[28px] text-zinc-400">
                        bolt
                      </span>
                    </div>

                    {/* Título */}
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        Empieza construyendo tu biblioteca de conocimiento.
                      </h3>
                      <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                        Los mejores resultados empiezan con un buen prompt.
                        Guárdalos aquí para reutilizarlos siempre que los
                        necesites.
                      </p>
                    </div>

                    {/* Frase de marca */}
                    <p className="text-sm italic text-zinc-400 leading-relaxed">
                      Un buen prompt no se escribe dos veces.
                    </p>

                    {/* Botón */}
                    <button
                      onClick={() => openPromptModal()}
                      className="inline-flex items-center gap-2 gemstone-gradient text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 transition-all duration-180 text-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        add
                      </span>
                      Guardar mi primer Prompt
                    </button>

                    {/* Tarjeta de ejemplo no interactiva */}
                    <div className="mt-10 opacity-80 pointer-events-none select-none">
                      <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/60 p-6 text-left">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                              texto
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-700/50">
                              #copywriting
                            </span>
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">
                          Generador de copy para landing
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                          Eres un experto en copywriting. Genera 5 variaciones
                          de titular para una landing page de...
                        </p>
                      </div>
                      <p className="text-[10px] text-zinc-600 mt-3 text-center">
                        Tus mejores prompts vivirán aquí.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
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
                      onViewDetails={(p) => {
                        setSelectedPromptForDetail(p);
                        setPromptDetailModalOpen(true);
                      }}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ==================== TAB SKILLS ==================== */}
          {activeTab === "skills" && (
            <>
              {skillsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SkillCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredSkills.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/20 bg-zinc-900/20 px-4 md:px-8 py-10 md:py-16">
                  <div className="max-w-lg text-center space-y-6">
                    {/* Icono */}
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-800/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[28px] text-zinc-400">
                        psychology
                      </span>
                    </div>

                    {/* Título */}
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        Enseña a tus agentes cómo trabajar.
                      </h3>
                      <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                        Guarda instrucciones de sistema y custom instructions en
                        Markdown para reutilizarlas en cualquier chat.
                      </p>
                    </div>

                    {/* Frase de marca */}
                    <p className="text-sm italic text-zinc-400 leading-relaxed">
                      Un buen agente empieza con un buen skill.
                    </p>

                    {/* Botón */}
                    <button
                      onClick={() => openSkillModal()}
                      className="inline-flex items-center gap-2 gemstone-gradient text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 transition-all duration-180 text-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        add
                      </span>
                      Guardar mi primer Skill
                    </button>

                    {/* Tarjeta de ejemplo no interactiva */}
                    <div className="mt-10 opacity-80 pointer-events-none select-none">
                      <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/60 p-6 text-left">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-400 border border-sky-500/20">
                              React
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-700/50">
                              #review
                            </span>
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">
                          Revisor de código React
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                          Eres un ingeniero senior especializado en React.
                          Revisa el código y propone mejoras de rendimiento...
                        </p>
                      </div>
                      <p className="text-[10px] text-zinc-600 mt-3 text-center">
                        Tus skills vivirán aquí.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                  {filteredSkills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onEdit={openSkillModal}
                      onDelete={handleDeleteSkill}
                      onCopy={handleCopySkill}
                      onToggleFavorite={(id, isFavorite) =>
                        toggleFavorite(id, "skills", isFavorite)
                      }
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ArenaCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredArenaComparisons.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/20 bg-zinc-900/20 px-4 md:px-8 py-10 md:py-16">
                  <div className="max-w-md text-center space-y-6">
                    {/* Icono */}
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-800/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[28px] text-zinc-400">
                        swords
                      </span>
                    </div>

                    {/* Título */}
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        Descubre qué modelo responde mejor
                      </h3>
                      <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                        Compara la misma pregunta entre distintos modelos y
                        guarda siempre la mejor respuesta.
                      </p>
                    </div>

                    {/* Botón */}
                    <button
                      onClick={() => setArenaModalOpen(true)}
                      className="inline-flex items-center gap-2 gemstone-gradient text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 transition-all duration-180 text-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        add
                      </span>
                      Crear mi primera Comparación
                    </button>

                    {/* Tarjeta de ejemplo no interactiva */}
                    <div className="mt-10 opacity-80 pointer-events-none select-none">
                      <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/60 p-5 text-left">
                        {/* Badge ✨ Ejemplo */}
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20 mb-4">
                          ✨ Ejemplo
                        </span>

                        {/* Prompt */}
                        <div className="mb-4">
                          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                            Prompt
                          </span>
                          <p className="text-sm text-zinc-300 mt-1 font-medium">
                            Explica recursión en Python
                          </p>
                        </div>

                        {/* Flecha hacia abajo */}
                        <div className="flex justify-center mb-4">
                          <span className="material-symbols-outlined text-zinc-700 text-[18px]">
                            arrow_downward
                          </span>
                        </div>

                        {/* Modelos enfrentados */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="rounded-xl bg-zinc-800/40 p-3">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                              Modelo A
                            </span>
                            <p className="text-xs text-zinc-400 mt-1 font-medium">
                              Claude 3.5 Sonnet
                            </p>
                          </div>
                          <div className="rounded-xl bg-zinc-800/40 p-3">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                              Modelo B
                            </span>
                            <p className="text-xs text-zinc-400 mt-1 font-medium">
                              ChatGPT-4o
                            </p>
                          </div>
                        </div>

                        {/* VS */}
                        <div className="flex justify-center mb-4">
                          <span className="text-[11px] font-semibold text-zinc-600">
                            VS
                          </span>
                        </div>

                        {/* Ganador */}
                        <div className="rounded-xl bg-emerald-950/10 border border-emerald-800/30 p-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-emerald-400">
                            emoji_events
                          </span>
                          <span className="text-xs font-medium text-emerald-400">
                            Ganador · Claude 3.5 Sonnet
                          </span>
                        </div>
                      </div>

                      {/* Microcopy */}
                      <p className="text-[10px] text-zinc-600 mt-3 text-center">
                        Nunca vuelvas a preguntarte qué modelo respondió mejor.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

      <SkillModal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        onSubmit={handleSkillSubmit}
        title={skillTitle}
        setTitle={setSkillTitle}
        description={skillDescription}
        setDescription={setSkillDescription}
        content={skillContent}
        setContent={setSkillContent}
        category={skillCategory}
        setCategory={setSkillCategory}
        tags={skillTags}
        tagsInput={skillTagsInput}
        setTagsInput={setSkillTagsInput}
        setTags={setSkillTags}
        saving={skillSaving}
        allTags={skillTagsFromSkills}
        suggestions={skillSuggestions}
        showSuggestions={skillShowSuggestions}
        selectedSuggestion={skillSelectedSuggestion}
        addSuggestion={addSkillSuggestion}
        setSuggestions={setSkillSuggestions}
        setShowSuggestions={setSkillShowSuggestions}
        setSelectedSuggestion={setSkillSelectedSuggestion}
        editingId={editingSkillId}
      />

      <ArenaModal
        isOpen={arenaModalOpen}
        onClose={() => setArenaModalOpen(false)}
        onSubmit={handleArenaSubmit}
        saving={arenaSaving}
        prompts={promptOptions}
        selectedPromptId={arenaSelectedPromptId}
        setSelectedPromptId={setArenaSelectedPromptId}
      />
      {/* ✅ MODAL DE COMPARACIÓN DETALLADA (NUEVO) */}
      <ArenaDetailModal
        isOpen={arenaDetailModalOpen}
        onClose={() => setArenaDetailModalOpen(false)}
        comparison={selectedComparison}
      />

      {/* ✅ MODAL DE DETALLE DE PROMPT */}
      <PromptDetailModal
        isOpen={promptDetailModalOpen}
        onClose={() => setPromptDetailModalOpen(false)}
        prompt={selectedPromptForDetail}
      />
    </div>
  );
}
