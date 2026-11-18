"use client";

import { useState } from "react";

export interface Skill {
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

interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
  onCopy: (skill: Skill) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

const CATEGORY_STYLES: Record<string, { style: string; label: string }> = {
  general: {
    style:
      "bg-zinc-800/30 border-zinc-700/30 text-zinc-400 hover:bg-zinc-800/40",
    label: "General",
  },
  react: {
    style:
      "bg-sky-950/20 border-sky-800/20 text-sky-300 hover:bg-sky-950/30",
    label: "React",
  },
  supabase: {
    style:
      "bg-emerald-950/20 border-emerald-800/20 text-emerald-300 hover:bg-emerald-950/30",
    label: "Supabase",
  },
  automatizacion: {
    style:
      "bg-amber-950/20 border-amber-800/20 text-amber-300 hover:bg-amber-950/30",
    label: "Automatización",
  },
  escritura: {
    style:
      "bg-violet-950/20 border-violet-800/20 text-violet-300 hover:bg-violet-950/30",
    label: "Escritura",
  },
  analisis: {
    style:
      "bg-blue-950/20 border-blue-800/20 text-blue-300 hover:bg-blue-950/30",
    label: "Análisis",
  },
  diseno: {
    style:
      "bg-fuchsia-950/20 border-fuchsia-800/20 text-fuchsia-300 hover:bg-fuchsia-950/30",
    label: "Diseño",
  },
  video: {
    style:
      "bg-rose-950/20 border-rose-800/20 text-rose-300 hover:bg-rose-950/30",
    label: "Video",
  },
};

export function SkillCard({
  skill,
  onEdit,
  onDelete,
  onCopy,
  onToggleFavorite,
}: SkillCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(skill);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const normalizedCategory = (skill.category || "General")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const categoryConfig = CATEGORY_STYLES[normalizedCategory] || {
    style:
      "bg-zinc-800/30 border-zinc-700/30 text-zinc-400 hover:bg-zinc-800/40",
    label: skill.category || "General",
  };

  return (
    <div
      className="group bg-zinc-900/70 rounded-2xl border border-zinc-800/40 hover:bg-zinc-800/30 hover:border-zinc-700/40 transition-all duration-180 ease-out p-6 flex flex-col h-full relative cursor-pointer"
      onClick={() => onEdit(skill)}
    >
      {/* Badge de categoría */}
      <div className="mb-5">
        <span
          className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium border transition-all duration-180 ${categoryConfig.style}`}
        >
          {categoryConfig.label}
        </span>
      </div>

      {/* Título */}
      <h3 className="text-[17px] font-bold text-white leading-tight mb-5 line-clamp-1">
        {skill.title}
      </h3>

      {/* Preview del skill */}
      <p className="text-sm text-zinc-500/80 leading-[1.65] flex-grow mb-5 line-clamp-3 whitespace-pre-line">
        {skill.description || skill.content}
      </p>

      {/* Footer: Tags + Acciones */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/30">
        {/* Tags a la izquierda */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {skill.tags && skill.tags.length > 0 ? (
            skill.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="px-1 py-[1px] rounded bg-zinc-800/40 text-[9px] text-zinc-500 border border-zinc-700/30 truncate max-w-[70px]"
              >
                #{t}
              </span>
            ))
          ) : (
            <span className="text-[9px] text-zinc-700">Sin etiquetas</span>
          )}
          {skill.tags && skill.tags.length > 2 && (
            <span className="text-[9px] text-zinc-700 shrink-0">
              +{skill.tags.length - 2}
            </span>
          )}
        </div>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-0 shrink-0">
          {/* Usos */}
          <span className="text-[10px] text-zinc-700 mr-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">bolt</span>
            {skill.times_used ?? 0}
          </span>

          {/* Fecha */}
          <span className="text-[10px] text-zinc-700 mr-3">
            {new Date(skill.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>

          {/* Copiar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className={`p-[3px] rounded-lg transition-all duration-180 ${
              copied
                ? "text-emerald-400 bg-emerald-950/30"
                : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60"
            }`}
            title={copied ? "¡Copiado!" : "Copiar skill"}
            aria-label={copied ? "Skill copiado" : "Copiar skill"}
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? "check" : "content_copy"}
            </span>
          </button>

          {/* Favorito */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(skill.id, !skill.is_favorite);
            }}
            className="p-[3px] rounded-lg text-zinc-600 hover:text-amber-400 hover:bg-zinc-800/60 transition-all duration-180"
            title={
              skill.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
            aria-label={
              skill.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
            aria-pressed={skill.is_favorite === true}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{
                fontVariationSettings: skill.is_favorite
                  ? "'FILL' 1"
                  : "'FILL' 0",
              }}
            >
              star
            </span>
          </button>

          {/* Eliminar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(skill.id);
            }}
            className="p-[3px] rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800/60 transition-all duration-180"
            title="Eliminar skill"
            aria-label="Eliminar skill"
          >
            <span className="material-symbols-outlined text-[16px]">
              delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
