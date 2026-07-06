# ChatVault_Spec — Constitución del Proyecto

## Propósito
ChatVault_Spec es un proyecto de chat con arquitectura modular, tipado estricto y buenas prácticas de desarrollo. Sirve como especificación viva y base para un sistema de mensajería seguro y escalable.

## Stack Tecnológico
- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript (strict mode)
- **Estilos:** Tailwind CSS
- **Linting:** ESLint con configuración estándar de Next.js

## Estructura de Carpetas
```
src/
├── app/          # Rutas y páginas de Next.js App Router
├── components/   # Componentes React reutilizables
├── lib/          # Utilidades, helpers, lógica de negocio
└── types/        # Definiciones de tipos TypeScript globales
```

## Principios
1. **TypeScript estricto** — `strict: true` en tsconfig.json.
2. **Componentes atómicos** — Preferir componentes pequeños y enfocados.
3. **Rutas claras** — Uso de App Router con organización lógica.
4. **Configuración explícita** — Variables de entorno en `.env.local`.
5. **Git hygiene** — `.env.local` y `node_modules` ignorados por git.
