"use client";

import { useEffect, useId, useRef } from "react";

/* ==========================================================================
   Kimberlite — Confirmación de acciones destructivas
   --------------------------------------------------------------------------
   Sustituye a window.confirm() con la piel del dashboard:
   - role="alertdialog" + aria-modal, descripción y título asociados.
   - El foco inicial cae en "Cancelar" (la acción segura), no en "Eliminar".
   - Escape cancela y Tab/Shift+Tab quedan atrapados en el diálogo.
   - Al cerrarse devuelve el foco al elemento que lo abrió.
   El componente sólo decide "sí/no": la lógica de cada borrado sigue viviendo
   en su handler del dashboard.
   ========================================================================== */

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  /** Texto de la acción destructiva ("Eliminar" por defecto). */
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Ids únicos por instancia: el diálogo puede montarse junto a otros modales.
  const uid = useId();
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;

  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Foco inicial en Cancelar + restauración del foco al cerrar.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();

    return () => {
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);

  // Escape cancela, igual que el confirm() nativo.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="kl-portal kl-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="kl-modal w-[calc(100%-2rem)] sm:w-full max-w-md my-8 p-5 sm:p-6 animate-zoom-in"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          // Sólo hay dos controles: el Tab cicla entre ellos.
          if (event.key !== "Tab" || !panelRef.current) return;

          const focusables = panelRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled])",
          );
          if (focusables.length === 0) return;

          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <span className="kl-confirm-icon" aria-hidden="true">
          <span className="material-symbols-outlined text-[20px]">warning</span>
        </span>

        <h2 id={titleId} className="kl-modal-title text-lg">
          {title}
        </h2>
        <p
          id={descriptionId}
          className="kl-text-muted mt-2 text-sm leading-relaxed"
        >
          {message}
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="kl-btn kl-btn--ghost"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="kl-btn kl-btn--danger"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
