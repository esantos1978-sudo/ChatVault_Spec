# ChatVault_Spec: Documentación Técnica

## 1. Visión General

App para organizar conversaciones con LLMs, permitiendo curaduría manual y comparación.

## 2. Stack Tecnológico

- Frontend: Next.js + Tailwind CSS.
- Backend/DB: Supabase (PostgreSQL).
- Gobernanza: Spec Kit.

## 3. Decisiones Arquitectónicas (ADRs)

- 2026-07-08: Se decidió usar Supabase Auth por seguridad RLS nativa.
- 2026-07-08: Se optó por una interfaz de "Modal Flotante" para no recargar el tablón central.

## 4. Estructura de Datos

- Tabla `notes`: id, created_at, user_id, title, content, tag, ia_model, source_type, summary.
