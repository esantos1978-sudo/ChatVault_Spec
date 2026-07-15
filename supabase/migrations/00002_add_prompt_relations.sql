-- ============================================================
-- Migration 00002: Relaciones prompt → notes y prompt → arena
-- ============================================================
-- Descripción:
--   - Añade FK de notes.prompt_id → prompts.id
--   - Añade columna prompt_id a arena_comparisons con FK
--   - Limpia registros huérfanos
--   - Añade trigger que verifica propiedad del prompt
--   - Todo en una sola transacción
-- ============================================================

BEGIN;

-- ============================================================
-- 1. Asegurar que notes.prompt_id existe (idempotente)
-- ============================================================
ALTER TABLE public.notes
  ADD COLUMN IF NOT EXISTS prompt_id UUID;

-- ============================================================
-- 2. Limpiar registros huérfanos en notes
-- ============================================================
UPDATE public.notes n
SET prompt_id = NULL
WHERE n.prompt_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.prompts p
    WHERE p.id = n.prompt_id
  );

-- ============================================================
-- 3. Añadir FK a notes.prompt_id (idempotente por estructura)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_constraint con
    JOIN pg_catalog.pg_class rel
      ON con.conrelid = rel.oid
    JOIN pg_catalog.pg_namespace nsp
      ON rel.relnamespace = nsp.oid
    JOIN pg_catalog.pg_attribute att
      ON att.attrelid = rel.oid
      AND att.attnum = ANY(con.conkey)
    JOIN pg_catalog.pg_class rel_ref
      ON con.confrelid = rel_ref.oid
    JOIN pg_catalog.pg_attribute att_ref
      ON att_ref.attrelid = rel_ref.oid
      AND att_ref.attnum = ANY(con.confkey)
    WHERE con.contype = 'f'
      AND nsp.nspname = 'public'
      AND rel.relname = 'notes'
      AND att.attname = 'prompt_id'
      AND rel_ref.relname = 'prompts'
      AND att_ref.attname = 'id'
  ) THEN
    ALTER TABLE public.notes
      ADD CONSTRAINT fk_notes_prompt_id
      FOREIGN KEY (prompt_id) REFERENCES public.prompts(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 4. Índice para notes.prompt_id
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_notes_prompt_id
  ON public.notes(prompt_id);

-- ============================================================
-- 5. Añadir prompt_id a arena_comparisons
-- ============================================================
ALTER TABLE public.arena_comparisons
  ADD COLUMN IF NOT EXISTS prompt_id UUID;

-- ============================================================
-- 6. Añadir FK a arena_comparisons.prompt_id (idempotente)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_constraint con
    JOIN pg_catalog.pg_class rel
      ON con.conrelid = rel.oid
    JOIN pg_catalog.pg_namespace nsp
      ON rel.relnamespace = nsp.oid
    JOIN pg_catalog.pg_attribute att
      ON att.attrelid = rel.oid
      AND att.attnum = ANY(con.conkey)
    JOIN pg_catalog.pg_class rel_ref
      ON con.confrelid = rel_ref.oid
    JOIN pg_catalog.pg_attribute att_ref
      ON att_ref.attrelid = rel_ref.oid
      AND att_ref.attnum = ANY(con.confkey)
    WHERE con.contype = 'f'
      AND nsp.nspname = 'public'
      AND rel.relname = 'arena_comparisons'
      AND att.attname = 'prompt_id'
      AND rel_ref.relname = 'prompts'
      AND att_ref.attname = 'id'
  ) THEN
    ALTER TABLE public.arena_comparisons
      ADD CONSTRAINT fk_arena_comparisons_prompt_id
      FOREIGN KEY (prompt_id) REFERENCES public.prompts(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 7. Índice para arena_comparisons.prompt_id
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_arena_comparisons_prompt_id
  ON public.arena_comparisons(prompt_id);

-- ============================================================
-- 8. Función y triggers de validación de propiedad
-- ============================================================

-- 8a. Crear función reutilizable
CREATE OR REPLACE FUNCTION public.check_prompt_ownership()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  IF NEW.prompt_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.prompts
      WHERE id = NEW.prompt_id
        AND user_id = NEW.user_id
    ) THEN
      RAISE EXCEPTION 'prompt_id % does not exist or does not belong to this user', NEW.prompt_id
        USING HINT = 'The referenced prompt must exist and belong to the same user';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8b. Trigger para notes
DROP TRIGGER IF EXISTS trg_check_prompt_ownership_notes ON public.notes;
CREATE TRIGGER trg_check_prompt_ownership_notes
  BEFORE INSERT OR UPDATE OF prompt_id, user_id
  ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_prompt_ownership();

-- 8c. Trigger para arena_comparisons
DROP TRIGGER IF EXISTS trg_check_prompt_ownership_arena ON public.arena_comparisons;
CREATE TRIGGER trg_check_prompt_ownership_arena
  BEFORE INSERT OR UPDATE OF prompt_id, user_id
  ON public.arena_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION public.check_prompt_ownership();

COMMIT;
