"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    content: string;
    category: string;
    tags?: string[];
    times_used: number;
    created_at: string;
    is_favorite?: boolean;
  };
  onEdit: (prompt: any) => void;
  onDelete: (id: string) => void;
  onCopy: (prompt: any) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onViewDetails?: (prompt: any) => void;
  index?: number;
}

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onCopy,
  onToggleFavorite,
  onViewDetails,
  index = 0,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="kl-card kl-card--interactive group p-6 flex flex-col h-full relative cursor-pointer"
      onClick={() => onEdit(prompt)}
    >
      {/* Badge de categoría */}
      <div className="mb-5">
        {(() => {
          const categoryConfig: Record<string, string> = {
            texto: "Texto",
            imagen: "Imagen",
            video: "Video",
            codigo: "Código",
          };
          const key = prompt.category.toLowerCase();
          const label = categoryConfig[key] || prompt.category;
          return (
            <span className="kl-chip kl-chip--cat kl-chip--accent">
              {label}
            </span>
          );
        })()}
      </div>

      {/* Título */}
      <h3 className="kl-card-title text-[17px] leading-tight mb-5 line-clamp-1">
        {prompt.title}
      </h3>

      {/* Preview del prompt */}
      <p className="kl-card-text flex-grow mb-5 line-clamp-3">
        {prompt.content}
      </p>

      {/* Separador (1px + 16px = mismo hueco que el antiguo pt-4 border-t) */}
      <div className="kl-divider mt-4" />

      {/* Footer: Tags + Acciones */}
      <div className="flex items-center justify-between">
        {/* Tags a la izquierda */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {prompt.tags && prompt.tags.length > 0 ? (
            prompt.tags.slice(0, 2).map((t) => (
              <span key={t} className="kl-chip kl-chip--tag truncate">
                #{t}
              </span>
            ))
          ) : (
            <span className="kl-meta">Sin etiquetas</span>
          )}
          {prompt.tags && prompt.tags.length > 2 && (
            <span className="kl-meta shrink-0">
              +{prompt.tags.length - 2}
            </span>
          )}
        </div>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-0 shrink-0">
          {/* Usos */}
          <span className="kl-meta mr-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">bolt</span>
            {prompt.times_used}
          </span>

          {/* Fecha */}
          <span className="kl-meta mr-3">
            {new Date(prompt.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>

          {/* Ver detalles */}
          {onViewDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(prompt);
              }}
              className="kl-icon-btn kl-icon-btn--sm"
              title="Ver detalles y relaciones"
              aria-label="Ver detalles y relaciones"
            >
              <span className="material-symbols-outlined text-[16px]">
                visibility
              </span>
            </button>
          )}

          {/* Copiar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--success"
            data-active={copied}
            title={copied ? "¡Copiado!" : "Copiar prompt"}
            aria-label={copied ? "Prompt copiado" : "Copiar prompt"}
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? "check" : "content_copy"}
            </span>
          </button>

          {/* Favorito */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt.id, !prompt.is_favorite);
            }}
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--favorite"
            title={
              prompt.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
            aria-label={
              prompt.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
            aria-pressed={prompt.is_favorite === true}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{
                fontVariationSettings: prompt.is_favorite
                  ? "'FILL' 1"
                  : "'FILL' 0",
              }}
            >
              star
            </span>
          </button>

          {/* Eliminar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prompt.id);
            }}
            className="kl-icon-btn kl-icon-btn--sm kl-icon-btn--danger"
            title="Eliminar prompt"
            aria-label="Eliminar prompt"
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
