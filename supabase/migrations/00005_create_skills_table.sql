-- ============================================================
-- Migration 00005: Crear tabla skills con RLS
-- ============================================================
-- Descripción:
--   Biblioteca de Skills: instrucciones de agentes de IA
--   (Custom Instructions / System Prompts) en formato Markdown.
--   Sigue el mismo patrón que `notes` y `prompts`:
--     - user_id → auth.users(id) ON DELETE CASCADE
--     - RLS habilitado con políticas por usuario
--     - tags TEXT[] + índices para filtros y búsquedas
--   `is_favorite` y `times_used` se incluyen para mantener la
--   paridad de UI con Prompts (favoritos y contador de copias).
--   Script idempotente: puede ejecutarse varias veces.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. Tabla skills
-- ============================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  times_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1b. Asegurar columnas si la tabla ya existía con un esquema parcial
ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS times_used INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();


-- ============================================================
-- 2. Índices (mismos criterios que notes/prompts)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_skills_user_id
  ON public.skills(user_id);

CREATE INDEX IF NOT EXISTS idx_skills_created_at
  ON public.skills(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_skills_category
  ON public.skills(category);

CREATE INDEX IF NOT EXISTS idx_skills_tags
  ON public.skills USING GIN(tags);

-- ============================================================
-- 3. Trigger updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_skills_set_updated_at ON public.skills;
CREATE TRIGGER trg_skills_set_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 4. Row Level Security
-- ============================================================
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own skills" ON public.skills;
CREATE POLICY "Users can view their own skills"
  ON public.skills
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own skills" ON public.skills;
CREATE POLICY "Users can create their own skills"
  ON public.skills
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own skills" ON public.skills;
CREATE POLICY "Users can update their own skills"
  ON public.skills
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own skills" ON public.skills;
CREATE POLICY "Users can delete their own skills"
  ON public.skills
  FOR DELETE
  USING (auth.uid() = user_id);

COMMIT;
