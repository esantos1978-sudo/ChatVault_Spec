-- Migration: Crear tabla notes con RLS
-- Descripción: Tabla principal para almacenar notas de usuarios autenticados

-- 1. Crear la tabla notes
CREATE TABLE IF NOT EXISTS public.notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled',
    content TEXT NOT NULL DEFAULT '',
    tags TEXT[] DEFAULT '{}'
);

-- 2. Índice para búsquedas rápidas por usuario
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);

-- 3. Índice para búsqueda por fecha (ordenar por más recientes)
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);

-- 4. Habilitar Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 5. Política: SELECT - Usuarios solo ven sus propias notas
CREATE POLICY "Users can view their own notes"
    ON public.notes
    FOR SELECT
    USING (auth.uid() = user_id);

-- 6. Política: INSERT - Usuarios solo crean notas para sí mismos
CREATE POLICY "Users can create their own notes"
    ON public.notes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 7. Política: UPDATE - Usuarios solo actualizan sus propias notas
CREATE POLICY "Users can update their own notes"
    ON public.notes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8. Política: DELETE - Usuarios solo eliminan sus propias notas
CREATE POLICY "Users can delete their own notes"
    ON public.notes
    FOR DELETE
    USING (auth.uid() = user_id);
