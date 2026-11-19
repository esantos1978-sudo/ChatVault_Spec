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

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  react: "React",
  supabase: "Supabase",
  automatizacion: "Automatización",
  escritura: "Escritura",
  analisis: "Análisis",
  diseno: "Diseño",
  video: "Video",
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

  const categoryLabel =
    CATEGORY_LABELS[normalizedCategory] || skill.category || "General";

  return (
    <div
      className="kl-card kl-card--interactive group p-6 flex flex-col h-full relative cursor-pointer"
      onClick={() => onEdit(skill)}
    >
      {/* Badge de categoría */}
      <div className="mb-5">
        <span className="kl-chip kl-chip--cat kl-chip--accent">
          {categoryLabel}
        </span>
      </div>

      {/* Título */}
      <h3 className="kl-card-title text-[17px] leading-tight mb-5 line-clamp-1">
        {skill.title}
      </h3>

      {/* Preview del skill */}
      <p className="kl-card-text flex-grow mb-5 line-clamp-3 whitespace-pre-line">
        {skill.description || skill.content}
      </p>

      {/* Separador (1px + 16px = mismo hueco que el antiguo pt-4 border-t) */}
      <div className="kl-divider mt-4" />

      {/* Footer: Tags + Acciones */}
      <div className="flex items-center justify-between">
        {/* Tags a la izquierda */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {skill.tags && skill.tags.length > 0 ? (
            skill.tags.slice(0, 2).map((t) => (
              <span key={t} className="kl-chip kl-chip--tag truncate">
                #{t}
              </span>
            ))
          ) : (
            <span className="kl-meta">Sin etiquetas</span>
          )}
          {skill.tags && skill.tags.length > 2 && (
            <span className="kl-meta shrink-0">
              +{skill.tags.length - 2}
            </span>
          )}
        </div>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-0 shrink-0">
          {/* Usos */}
          <span className="kl-meta mr-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">bolt</span>
            {skill.times_used ?? 0}
          </span>

          {/* Fecha */}
          <span className="kl-meta mr-3">
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
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--success"
            data-active={copied}
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
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--favorite"
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
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--danger"
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
