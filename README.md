# 🔒 ChatVault

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2.0-green?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)

**Tu baúl de conocimiento para conversaciones con IA.** ChatVault es una aplicación web moderna para guardar, organizar y reutilizar chats, prompts y recursos de tus modelos de lenguaje favoritos (ChatGPT, DeepSeek, Claude, Gemini y más). Ofrece autenticación segura, un CRUD completo de notas y prompts, scraping inteligente de URLs, un sistema de etiquetas independientes por sección, filtros avanzados, una **Arena de LLMs** para comparar respuestas, **sistema de favoritos** para notas y prompts, y una experiencia de usuario premium con modo oscuro y animaciones.

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

### 🏠 Landing Page Moderna

- **Hero atractivo** con gradientes, badge animado y llamada a la acción.
- **Sección de funcionalidades** con grid de 6 tarjetas interactivas (Notas inteligentes, Biblioteca de Prompts, Scraping de URLs, Etiquetas múltiples, Búsqueda avanzada, Seguridad).
- **"Cómo funciona"** en 3 pasos: Regístrate → Guarda → Organiza.
- **Placeholder de video** para futura demostración visual.
- **Footer** con enlaces a Términos, Privacidad y Contacto.
- **Modo oscuro** integrado que respeta la preferencia del sistema operativo.

### 🔐 Autenticación de usuarios

- **Registro e inicio de sesión** con correo electrónico y contraseña mediante Supabase Auth.
- **Protección de rutas:** el dashboard solo es accesible para usuarios autenticados.
- **Cierre de sesión** con un clic desde el sidebar.
- **Row Level Security (RLS):** cada usuario solo ve, crea, edita y elimina sus propios datos.

### 📝 CRUD completo de Notas

- **Crear** notas con título, contenido, resumen, etiquetas múltiples y modelo de IA asociado.
- **Leer** todas las notas en una rejilla de tarjetas con diseño responsive.
- **Editar** cualquier nota directamente desde la tarjeta con un clic en el icono de lápiz.
- **Eliminar** notas con confirmación previa y feedback visual mediante toast.

### 🌐 Scraping inteligente de URLs

- Pega una URL pública de un chat compartido (DeepSeek, ChatGPT, Claude, etc.) y la aplicación **extrae automáticamente el título y el contenido**.
- Si no se puede extraer contenido, se guarda un fallback con el enlace original.
- Corrección automática de URLs sin protocolo (se añade `https://` si falta).

### 📚 Biblioteca de Prompts

- **CRUD completo** de prompts reutilizables con título, contenido, categoría y etiquetas.
- **Categorías por tipo de contenido:**
  - 🖼️ Imagen
  - 📝 Texto
  - 💻 Código
  - 🎬 Video
  - 🔌 MCP
  - 📂 Otro
- **Contador de usos:** cada vez que copias un prompt, se incrementa automáticamente su contador `times_used`.
- **Feedback visual al copiar:** animación de 2 segundos que indica que el prompt se ha copiado al portapapeles.
- **Filtro por categorías** en el sidebar con conteo de prompts por categoría.

### 🥊 Arena de LLMs

- **Comparación manual de respuestas:** pega el mismo prompt y las respuestas de dos modelos de IA diferentes para compararlas lado a lado.
- **Sistema de votación:** selecciona qué respuesta te ha parecido mejor (Modelo 1 o Modelo 2).
- **Resaltado del ganador:** la respuesta ganadora se muestra con un badge 🏆 y un fondo verde destacado.
- **Modelos disponibles:** ChatGPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, DeepSeek-V3, Llama 3 y Otro.
- **Búsqueda en comparaciones:** filtra por el texto del prompt en la barra de búsqueda.
- **Eliminación** de comparaciones con confirmación previa.

### ⭐ Sistema de Favoritos

- **Marcar como favorito:** cada nota y prompt tiene un icono de estrella (⭐) que permite marcarlo como favorito con un solo clic.
- **Filtro de favoritos en el sidebar:** un botón dedicado "Ver favoritos" que muestra exclusivamente los elementos marcados como favoritos, con indicador visual "Mostrando favoritos".
- **Estado persistente:** el estado de favorito se guarda en la base de datos (`is_favorite`) y se sincroniza en tiempo real.
- **Indicador visual:** las tarjetas favoritas muestran la estrella rellena (⭐) con un color dorado distintivo.

### 🏷️ Sistema de etiquetas independientes por sección

- Las etiquetas funcionan de forma **independiente** para notas y prompts, cada sección con su propio conjunto.
- **Autosugerencia inteligente:** mientras escribes, aparece un menú desplegable con sugerencias de etiquetas existentes en esa sección, filtradas en tiempo real.
- Navegación por teclado (flechas ↑/↓, Enter para seleccionar, Escape para cerrar).
- **Eliminación de etiquetas:** en el sidebar, cada etiqueta tiene un botón "✕" para eliminarla de todas las notas o prompts de esa sección.
- Vista rápida del conteo de notas o prompts por etiqueta en el sidebar.
- **Scroll premium de etiquetas** con efecto de desvanecimiento en los bordes (`mask-image`).

### 🔍 Sistema de filtros avanzado

- **Búsqueda en tiempo real:** filtra por título, contenido, resumen o etiquetas.
- **Filtro por modelo de IA:** en la sección de notas, el sidebar muestra todos los modelos de IA únicos con su respectivo conteo. Al seleccionar uno, se filtran solo las notas de ese modelo.
- **Filtro por etiquetas:** selecciona una etiqueta en el sidebar para ver solo notas/prompts de esa categoría.
- **Filtros temporales:** botones rápidos para ver notas de hoy, últimos 7 días o últimos 30 días.
- **Rango de fechas personalizado:** calendario con selector "Desde" y "Hasta" para filtrar por cualquier período.
- **Filtro por categorías** en la sección de prompts (imagen, texto, código, video, MCP, otro).
- **Combinación de filtros:** todos los filtros se pueden usar simultáneamente.
- **Sidebar reordenado:** Modelos de IA → Etiquetas → Fechas, para una navegación más intuitiva.

### 🔔 Notificaciones Toast

- Se han reemplazado todos los `alert()` por notificaciones elegantes con **react-hot-toast**.
- Toasts de éxito, error y carga con iconos personalizados y animaciones suaves.
- Posicionados en la esquina inferior derecha con duración configurable.

### 🎨 Diseño responsive con animaciones premium

- Interfaz adaptable a cualquier dispositivo (móvil, tablet, escritorio).
- **Modo oscuro** integrado que respeta la preferencia del sistema operativo, con colores y contrastes refinados.
- **Animaciones de entrada:** las tarjetas aparecen con un efecto `fade-in-up` escalonado (`animation-delay` progresivo) que crea una sensación de cascada visual.
- **Efectos hover:** las tarjetas se elevan (`hover:-translate-y-1.5`) con sombras premium y un brillo sutil en la esquina superior izquierda.
- **Transiciones suaves:** todas las interacciones usan `cubic-bezier(0.34,1.56,0.64,1)` para un rebote elástico natural.
- **Modal con zoom:** el modal de creación/edición aparece con un efecto `zoom-in` y fondo semitransparente con blur.
- **Efecto de borde brillante:** al hacer hover sobre una tarjeta, aparece un anillo brillante alrededor con transición de 500ms.
- **Sombras premium:** sombras personalizadas (`shadow-premium`, `shadow-premium-hover`) con variantes para modo oscuro que dan profundidad y sofisticación.
- **Skeleton loaders:** animaciones de carga placeholder mientras se obtienen los datos.
- **Scroll premium de etiquetas** con efecto de desvanecimiento en bordes y scrollbar estilizado.

### 🧩 Componentes modulares

- El código está organizado en componentes React reutilizables y auto-contenidos:
  - **`NoteCard`**: tarjeta individual de nota con efectos hover y acciones.
  - **`NoteModal`**: modal de creación/edición de notas con pestañas (texto, URL, archivo), autosugerencia de etiquetas y selector de modelo de IA.
  - **`PromptCard`**: tarjeta de prompt con badge de categoría por colores, contador de usos y botón de copia con feedback visual.
  - **`PromptModal`**: modal de creación/edición de prompts con selector de categorías y autosugerencia de etiquetas.
  - **`ArenaCard`**: tarjeta de comparación con dos columnas, badge del ganador y resaltado visual.
  - **`ArenaModal`**: modal de la Arena con formulario de comparación, selectores de modelo y sistema de votación.
  - **`AuthForm`**: formulario de autenticación (login/registro) con validación y manejo de errores.

---

## 📸 Capturas de pantalla

> _Próximamente: capturas de la Landing Page, Dashboard con Notas, Biblioteca de Prompts y Arena de LLMs._

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
│   ├── app/                            # Rutas y páginas (App Router de Next.js)
│   │   ├── api/
│   │   │   └── scrape/route.ts         # API route para scraping de URLs
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Dashboard con Notas, Prompts y Arena (~1110 líneas)
│   │   ├── layout.tsx                  # Layout raíz con fuentes Geist + Toaster
│   │   ├── page.tsx                    # Landing page + lógica de autenticación (~320 líneas)
│   │   └── globals.css                 # Estilos globales, animaciones y scroll premium
│   ├── components/                     # Componentes React reutilizables
│   │   ├── ArenaCard.tsx               # Tarjeta de comparación de la Arena de LLMs
│   │   ├── ArenaModal.tsx              # Modal de la Arena con votación
│   │   ├── AuthForm.tsx                # Formulario de autenticación (login/registro)
│   │   ├── NoteCard.tsx                # Tarjeta individual de nota con efectos hover
│   │   ├── NoteModal.tsx               # Modal de creación/edición de notas (3 pestañas)
│   │   ├── PromptCard.tsx              # Tarjeta de prompt con badge de categoría y contador
│   │   └── PromptModal.tsx             # Modal de creación/edición de prompts con categorías
│   ├── lib/                            # Utilidades, helpers y lógica de negocio
│   │   └── supabaseClient.ts           # Cliente de Supabase inicializado
│   └── SupabaseClient.ts               # Cliente de Supabase (raíz, respaldo)
├── supabase/
│   └── migrations/                     # Migraciones SQL versionadas (8 migraciones)
│       ├── 001_initial_schema.sql
│       ├── 002_fix_rls_policies.sql
│       ├── 003_convert_tag_to_tags_array.sql
│       ├── 004_add_columns_to_notes.sql
│       ├── 005_set_default_ai_model.sql
│       ├── 006_update_prompt_categories.sql
│       ├── 007_create_arena_comparisons_table.sql
│       └── 008_add_is_favorite_column.sql
├── scripts/                            # Scripts auxiliares
│   ├── run-migration.mjs               # Ejecuta migraciones contra Supabase
│   └── test-supabase.mjs               # Verifica la conexión con Supabase
├── docs/                               # Documentación técnica
│   ├── arquitectura.md                 # ADRs y decisiones arquitectónicas
│   ├── components.md                   # Documentación de componentes
│   └── database.md                     # Esquema y políticas de la base de datos
├── .specify/
│   └── constitution.md                 # Constitución del proyecto (Spec Kit)
├── .env.local                          # ⚠️ Variables de entorno (NO SUBIR A GIT)
├── .gitignore                          # Ignora .env.local, node_modules, .next, etc.
├── next.config.ts                      # Configuración de Next.js
├── tailwind.config.ts                  # Configuración de Tailwind CSS
└── tsconfig.json                       # Configuración de TypeScript (strict mode)
```

### Descripción de directorios clave

| Directorio             | Propósito                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `src/app/`             | Sistema de rutas basado en el App Router de Next.js. Cada subdirectorio representa una ruta. |
| `src/app/dashboard/`   | Dashboard principal con tabs de Notas, Prompts y Arena, sidebar con filtros.                 |
| `src/components/`      | Componentes React atómicos y reutilizables (autenticación, tarjetas, modales, arena).        |
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

## 📋 Migraciones de base de datos

Las migraciones se ejecutan en orden secuencial para construir el esquema completo:

| Orden | Archivo                                  | Descripción                                    |
| ----- | ---------------------------------------- | ---------------------------------------------- |
| 1     | `001_initial_schema.sql`                 | Crear tabla `notes` + RLS                      |
| 2     | `002_fix_rls_policies.sql`               | Hard Reset de políticas RLS                    |
| 3     | `003_convert_tag_to_tags_array.sql`      | Convertir columna `tag` a `tags` (TEXT[])      |
| 4     | `004_add_columns_to_notes.sql`           | Añadir columnas a `notes`                      |
| 5     | `005_set_default_ai_model.sql`           | Establecer DeepSeek-R1 como modelo por defecto |
| 6     | `006_update_prompt_categories.sql`       | Actualizar categorías de prompts               |
| 7     | `007_create_arena_comparisons_table.sql` | Crear tabla `arena_comparisons`                |
| 8     | `008_add_is_favorite_column.sql`         | Añadir columna `is_favorite` a notes y prompts |

---

## 🗄️ Base de datos

### Tabla `notes`

Almacena las conversaciones y chats guardados por los usuarios.

| Columna       | Tipo          | Descripción                                  |
| ------------- | ------------- | -------------------------------------------- |
| `id`          | `BIGINT`      | Identificador único (auto-incremental)       |
| `created_at`  | `TIMESTAMPTZ` | Fecha de creación                            |
| `user_id`     | `UUID`        | Referencia al usuario autenticado            |
| `title`       | `TEXT`        | Título de la nota                            |
| `content`     | `TEXT`        | Contenido de la conversación                 |
| `summary`     | `TEXT`        | Resumen del hilo de la conversación          |
| `tags`        | `TEXT[]`      | Array de etiquetas múltiples                 |
| `ai_model`    | `TEXT`        | Modelo de IA asociado a la nota              |
| `source_type` | `TEXT`        | Tipo de fuente (text, url, file)             |
| `source_url`  | `TEXT`        | URL original del chat (si aplica)            |
| `is_favorite` | `BOOLEAN`     | Indica si la nota está marcada como favorita |

### Tabla `prompts`

Almacena los prompts reutilizables organizados por categorías.

| Columna       | Tipo          | Descripción                                         |
| ------------- | ------------- | --------------------------------------------------- |
| `id`          | `BIGINT`      | Identificador único (auto-incremental)              |
| `created_at`  | `TIMESTAMPTZ` | Fecha de creación                                   |
| `user_id`     | `UUID`        | Referencia al usuario autenticado                   |
| `title`       | `TEXT`        | Título del prompt                                   |
| `content`     | `TEXT`        | Contenido del prompt                                |
| `category`    | `TEXT`        | Categoría (imagen, texto, codigo, video, mcp, otro) |
| `tags`        | `TEXT[]`      | Array de etiquetas múltiples                        |
| `times_used`  | `INTEGER`     | Contador de usos (se incrementa al copiar)          |
| `is_favorite` | `BOOLEAN`     | Indica si el prompt está marcado como favorito      |

### Tabla `arena_comparisons`

Almacena las comparaciones de la Arena de LLMs.

| Columna      | Tipo          | Descripción                                               |
| ------------ | ------------- | --------------------------------------------------------- |
| `id`         | `BIGINT`      | Identificador único (auto-incremental)                    |
| `created_at` | `TIMESTAMPTZ` | Fecha de creación                                         |
| `user_id`    | `UUID`        | Referencia al usuario autenticado                         |
| `prompt`     | `TEXT`        | Prompt utilizado en la comparación                        |
| `responses`  | `JSONB`       | Objeto con model1, response1, model2, response2           |
| `winner`     | `TEXT`        | Ganador de la comparación ("model1" o "model2", nullable) |

> **Seguridad:** Row Level Security (RLS) activado en todas las tablas con políticas que garantizan que cada usuario solo accede a sus propios datos.

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
