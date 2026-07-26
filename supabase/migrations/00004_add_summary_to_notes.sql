-- ============================================================
-- Migration 00004: Añadir columna summary a notes
-- ============================================================
-- Descripción:
--   Añade el campo "summary" (resumen) a la tabla notes
--   para que los usuarios puedan escribir un breve resumen
--   de la conversación importada.
-- ============================================================

-- 1. Añadir columna summary (TEXT, nullable)
ALTER TABLE public.notes
  ADD COLUMN IF NOT EXISTS summary TEXT;

-- 2. Índice para búsqueda por resumen (útil para el buscador)
CREATE INDEX IF NOT EXISTS idx_notes_summary
  ON public.notes USING gin(to_tsvector('spanish', coalesce(summary, '')));
