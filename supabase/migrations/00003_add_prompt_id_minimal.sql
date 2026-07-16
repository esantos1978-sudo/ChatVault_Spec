-- ============================================================
-- Migration 00003: Añadir prompt_id a arena_comparisons (mínimo)
-- ============================================================
-- Descripción:
--   Script mínimo e idempotente para que el frontend funcione.
--   - Añade columna prompt_id a arena_comparisons si no existe
--   - Crea índice
--   - Crea FK hacia prompts(id) con ON DELETE SET NULL
--   - También asegura notes.prompt_id por si no se ejecutó 00002
--   - Sin triggers, funciones, RLS ni validaciones avanzadas
--   - Ejecutable múltiples veces sin errores
-- ============================================================

-- 1. Asegurar columna prompt_id en arena_comparisons
ALTER TABLE public.arena_comparisons
  ADD COLUMN IF NOT EXISTS prompt_id UUID;

-- 2. Índice para arena_comparisons.prompt_id
CREATE INDEX IF NOT EXISTS idx_arena_comparisons_prompt_id
  ON public.arena_comparisons(prompt_id);

-- 3. FK para arena_comparisons.prompt_id → prompts(id) (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_constraint con
    JOIN pg_catalog.pg_class rel ON con.conrelid = rel.oid
    JOIN pg_catalog.pg_namespace nsp ON rel.relnamespace = nsp.oid
    WHERE con.contype = 'f'
      AND nsp.nspname = 'public'
      AND rel.relname = 'arena_comparisons'
      AND con.confrelid = (SELECT oid FROM pg_catalog.pg_class WHERE relname = 'prompts' AND relnamespace = (SELECT oid FROM pg_catalog.pg_namespace WHERE nspname = 'public'))
  ) THEN
    ALTER TABLE public.arena_comparisons
      ADD CONSTRAINT fk_arena_comparisons_prompt_id
      FOREIGN KEY (prompt_id) REFERENCES public.prompts(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- 4. Asegurar columna prompt_id en notes (por si no se ejecutó 00002)
ALTER TABLE public.notes
  ADD COLUMN IF NOT EXISTS prompt_id UUID;

-- 5. Índice para notes.prompt_id
CREATE INDEX IF NOT EXISTS idx_notes_prompt_id
  ON public.notes(prompt_id);

-- 6. FK para notes.prompt_id → prompts(id) (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_constraint con
    JOIN pg_catalog.pg_class rel ON con.conrelid = rel.oid
    JOIN pg_catalog.pg_namespace nsp ON rel.relnamespace = nsp.oid
    WHERE con.contype = 'f'
      AND nsp.nspname = 'public'
      AND rel.relname = 'notes'
      AND con.confrelid = (SELECT oid FROM pg_catalog.pg_class WHERE relname = 'prompts' AND relnamespace = (SELECT oid FROM pg_catalog.pg_namespace WHERE nspname = 'public'))
  ) THEN
    ALTER TABLE public.notes
      ADD CONSTRAINT fk_notes_prompt_id
      FOREIGN KEY (prompt_id) REFERENCES public.prompts(id)
      ON DELETE SET NULL;
  END IF;
END $$;
