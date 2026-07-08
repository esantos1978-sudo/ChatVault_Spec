# 🔒 ChatVault

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2.0-green?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)

**Tus notas seguras en la nube.** ChatVault es una aplicación web moderna para organizar, almacenar y buscar conversaciones con modelos de lenguaje (LLMs) como ChatGPT, DeepSeek, Claude y Gemini. Ofrece autenticación segura, un CRUD completo de notas, importación automática desde URLs públicas, un sistema de etiquetas múltiples con autosugerencia y filtros inteligentes combinables.

---

## 🚀 Tecnologías

| Tecnología          | Propósito                                     |
| ------------------- | --------------------------------------------- |
| **Next.js 16**      | Framework React con App Router                |
| **TypeScript**      | Tipado estricto (`strict: true`)              |
| **Tailwind CSS v4** | Última versión del framework de estilos       |
| **Supabase**        | Backend como servicio (Auth + DB PostgreSQL)  |
| **react-hot-toast** | Notificaciones toast elegantes y modernas     |
| **ESLint**          | Linting con configuración estándar de Next.js |

---

## ✨ Funcionalidades

### 🔐 Autenticación de usuarios

- **Registro e inicio de sesión** con correo electrónico y contraseña mediante Supabase Auth.
- **Protección de rutas:** el panel de notas solo es accesible para usuarios autenticados.
- **Cierre de sesión** con un clic desde el sidebar.
- **Row Level Security (RLS):** cada usuario solo ve, crea, edita y elimina sus propias notas.

### 📝 CRUD completo de notas

- **Crear** notas con título, contenido, resumen, etiquetas múltiples y modelo de IA asociado.
- **Leer** todas las notas en una rejilla de tarjetas con diseño responsive.
- **Editar** cualquier nota directamente desde la tarjeta con un clic en el icono de lápiz.
- **Eliminar** notas con confirmación previa y un icono de papelera.

### 🌐 Scraping inteligente de URLs

- Pega una URL pública de un chat compartido (DeepSeek, ChatGPT, Claude, etc.) y la aplicación **extrae automáticamente el título y el contenido**.
- Si no se puede extraer contenido, se guarda un fallback con el enlace original.
- Corrección automática de URLs sin protocolo (se añade `https://` si falta).

### 🏷️ Sistema de etiquetas múltiples

- Asigna **múltiples etiquetas** a cada nota, separadas por comas.
- **Autosugerencia inteligente:** mientras escribes, aparece un menú desplegable con sugerencias de etiquetas existentes, filtradas en tiempo real.
- Navegación por teclado (flechas ↑/↓, Enter para seleccionar, Escape para cerrar).
- **Eliminación de etiquetas:** en el sidebar, cada etiqueta tiene un botón "✕" para eliminarla de todas las notas de forma global.
- Vista rápida del conteo de notas por etiqueta en el sidebar.

### 🔍 Sistema de filtros avanzado

- **Búsqueda en tiempo real:** filtra por título, resumen o contenido mientras escribes.
- **Filtro por etiquetas:** selecciona una etiqueta en el sidebar para ver solo notas de esa categoría.
- **Filtros temporales:** botones rápidos para ver notas de hoy, últimos 7 días o últimos 30 días.
- **Rango de fechas personalizado:** calendario con selector "Desde" y "Hasta" para filtrar por cualquier período.
- **Combinación de filtros:** todos los filtros se pueden usar simultáneamente.

### 🔔 Notificaciones Toast

- Se han reemplazado todos los `alert()` por notificaciones elegantes con **react-hot-toast**.
- Toasts de éxito, error y carga con iconos personalizados y animaciones suaves.
- Posicionados en la esquina inferior derecha con duración configurable.

### 🎨 Diseño responsive con animaciones premium

- Interfaz adaptable a cualquier dispositivo (móvil, tablet, escritorio).
- **Modo oscuro** integrado que respeta la preferencia del sistema operativo.
- **Animaciones de entrada:** las tarjetas aparecen con un efecto `fade-in-up` escalonado (`animation-delay` progresivo) que crea una sensación de cascada visual.
- **Efectos hover:** las tarjetas se elevan (`hover:-translate-y-1.5`) con sombras premium y un brillo sutil en la esquina superior izquierda.
- **Transiciones suaves:** todas las interacciones usan `cubic-bezier(0.34,1.56,0.64,1)` para un rebote elástico natural.
- **Modal con zoom:** el modal de creación/edición aparece con un efecto `zoom-in` y fondo semitransparente con blur.
- **Efecto de borde brillante:** al hacer hover sobre una tarjeta, aparece un anillo brillante alrededor con transición de 500ms.
- **Sombras premium:** sombras personalizadas (`shadow-premium`, `shadow-premium-hover`) que dan profundidad y sofisticación.

### 🧩 Refactorización en componentes

- El código se ha dividido en componentes más pequeños y reutilizables:
  - **`NoteCard`**: tarjeta individual de nota, completamente independiente y auto-contenida.
  - **`NoteModal`**: modal de creación/edición con lógica de autosugerencia y gestión de etiquetas.
  - **`AuthForm`**: formulario de autenticación (login/registro).

---

## 📦 Instalación

### Requisitos

- **Node.js** >= 18
- **npm** (incluido con Node.js)
- Una cuenta en [Supabase](https://supabase.com) (plan gratuito)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/esantos1978-sudo/ChatVault_Spec.git
cd ChatVault_Spec

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
```

### ⚠️ Configuración de `.env.local`

Edita el archivo `.env.local` con las credenciales de tu proyecto de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> **🚨 ADVERTENCIA CRÍTICA:** El archivo `.env.local` contiene credenciales sensibles de tu proyecto. **NUNCA** lo subas a Git. Este proyecto ya lo tiene incluido en `.gitignore`, pero asegúrate de **no forzar su inclusión** con `git add --force` o `git commit` con la bandera `--no-verify`. Si las credenciales se filtran, cualquier persona podría acceder a tu base de datos.

### Iniciar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗂️ Estructura del proyecto

```
ChatVault_Spec/
├── src/
│   ├── app/                        # Rutas y páginas (App Router de Next.js)
│   │   ├── api/
│   │   │   └── scrape/route.ts     # API route para scraping de URLs
│   │   ├── layout.tsx              # Layout raíz con fuentes Geist + Toaster
│   │   ├── page.tsx                # Página principal (~400 líneas)
│   │   └── globals.css             # Estilos globales
│   ├── components/                 # Componentes React reutilizables
│   │   ├── AuthForm.tsx            # Formulario de autenticación (login/registro)
│   │   ├── NoteCard.tsx            # Tarjeta individual de nota (independiente)
│   │   └── NoteModal.tsx           # Modal de creación/edición de notas
│   ├── lib/                        # Utilidades, helpers y lógica de negocio
│   │   └── supabaseClient.ts       # Cliente de Supabase inicializado
│   └── SupabaseClient.ts           # Cliente de Supabase (raíz, respaldo)
├── supabase/
│   └── migrations/                 # Migraciones SQL de la base de datos
│       └── 00001_create_notes_table.sql
├── scripts/                        # Scripts auxiliares
│   ├── run-migration.mjs           # Ejecuta migraciones contra Supabase
│   └── test-supabase.mjs           # Verifica la conexión con Supabase
├── docs/                           # Documentación técnica
│   ├── arquitectura.md             # ADRs y decisiones arquitectónicas
│   ├── components.md               # Documentación de componentes
│   └── database.md                 # Esquema y políticas de la base de datos
├── .specify/
│   └── constitution.md             # Constitución del proyecto (Spec Kit)
├── .env.local                      # ⚠️ Variables de entorno (NO SUBIR A GIT)
├── .gitignore                      # Ignora .env.local, node_modules, .next, etc.
├── next.config.ts                  # Configuración de Next.js
├── tailwind.config.ts              # Configuración de Tailwind CSS
└── tsconfig.json                   # Configuración de TypeScript (strict mode)
```

### Descripción de directorios clave

| Directorio             | Propósito                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `src/app/`             | Sistema de rutas basado en el App Router de Next.js. Cada subdirectorio representa una ruta. |
| `src/components/`      | Componentes React atómicos y reutilizables (autenticación, tarjetas, modales).               |
| `src/lib/`             | Lógica compartida: cliente de Supabase, helpers, utilidades.                                 |
| `supabase/migrations/` | Migraciones SQL versionadas para la base de datos PostgreSQL.                                |
| `scripts/`             | Scripts Node.js para tareas auxiliares (migraciones, tests de conexión).                     |
| `docs/`                | Documentación técnica detallada (arquitectura, componentes, base de datos).                  |

---

## 🧪 Scripts disponibles

| Comando                          | Descripción                         |
| -------------------------------- | ----------------------------------- |
| `npm run dev`                    | Inicia el servidor de desarrollo    |
| `npm run build`                  | Compila el proyecto para producción |
| `npm run start`                  | Inicia el servidor en producción    |
| `npm run lint`                   | Ejecuta ESLint en todo el proyecto  |
| `node scripts/test-supabase.mjs` | Verifica la conexión con Supabase   |
| `node scripts/run-migration.mjs` | Ejecuta migraciones SQL en Supabase |

---

## 🗄️ Base de datos

La tabla principal `notes` almacena:

| Columna      | Tipo          | Descripción                            |
| ------------ | ------------- | -------------------------------------- |
| `id`         | `BIGINT`      | Identificador único (auto-incremental) |
| `created_at` | `TIMESTAMPTZ` | Fecha de creación                      |
| `user_id`    | `UUID`        | Referencia al usuario autenticado      |
| `title`      | `TEXT`        | Título de la nota                      |
| `content`    | `TEXT`        | Contenido de la conversación           |
| `tags`       | `TEXT[]`      | Array de etiquetas múltiples           |

> **Nota:** Las columnas `summary`, `ai_model`, `source_type` y `source_url` se gestionan desde la aplicación y pueden añadirse al esquema según evolucione el proyecto.

> **Seguridad:** Row Level Security (RLS) activado con políticas que garantizan que cada usuario solo accede a sus propios datos.

---

## 🌐 Despliegue

### Flujo CI/CD con Vercel + GitHub

1. **Push a `main`** — Cada push a la rama principal dispara automáticamente un despliegue en Vercel.
2. **Vercel** — Detecta el framework Next.js, ejecuta `npm run build` y despliega en una URL de preview o producción.
3. **Variables de entorno** — Configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el panel de Vercel (Project Settings → Environment Variables). **Nunca las incluyas en el repositorio.**
4. **Base de datos** — Las migraciones de Supabase se ejecutan manualmente desde el SQL Editor del dashboard de Supabase o mediante scripts locales.

> 💡 **Consejo:** Habilita las **Preview Deployments** en Vercel para que cada Pull Request genere una URL de vista previa automática.

---

## 📚 Más información

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Arquitectura del proyecto](./docs/arquitectura.md)
- [Constitución del proyecto](./.specify/constitution.md)

---

<div align="center">
  <sub>Hecho con ❤️ usando Next.js, Supabase y Tailwind CSS</sub>
</div>
