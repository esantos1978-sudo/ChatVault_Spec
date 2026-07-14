# 💎 Kimberlite

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2.0-green?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)

**Your data, refined & resilient.** Kimberlite (anteriormente ChatVault) es una aplicación web moderna para organizar conversaciones con IA, gestionar prompts reutilizables y comparar modelos de lenguaje. Construida con Next.js 16, TypeScript, Tailwind CSS v4 y Supabase, ofrece una experiencia premium con autenticación segura, CRUD completo de notas y prompts, scraping inteligente de URLs, **carga de archivos (PDF, TXT, MD) con extracción automática de texto completamente funcional**, sistema de etiquetas independientes por sección, filtros avanzados, una **Arena de LLMs** para comparar respuestas, **sistema de favoritos** ⭐, enlace entre notas y prompts, **botón "Copiar MD" en todas las tarjetas**, **sidebar responsive** con menú hamburguesa en móviles, **selector de prompts en la Arena** para cargar prompts guardados automáticamente, **onboarding guiado** con empty states que enseñan el producto, y un diseño oscuro optimizado con paleta equilibrada de violetas, azules y terracota.

---

## 🚀 Tecnologías

| Tecnología           | Propósito                                                 |
| -------------------- | --------------------------------------------------------- |
| **Next.js 16**       | Framework React con App Router                            |
| **TypeScript**       | Tipado estricto (`strict: true`)                          |
| **Tailwind CSS v4**  | Última versión del framework de estilos                   |
| **Supabase**         | Backend como servicio (Auth + DB PostgreSQL)              |
| **react-hot-toast**  | Notificaciones toast elegantes y modernas                 |
| **pdfjs-dist**       | Lectura y extracción de texto de archivos PDF (v3.11.174) |
| **Material Symbols** | Iconografía premium de Google Fonts                       |
| **ESLint**           | Linting con configuración estándar de Next.js             |

---

## 🎨 Diseño Kimberlite

Kimberlite presenta una identidad visual premium con una paleta de violetas característica:

| Elemento                | Detalle                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| **Colores principales** | Violetas `#8b5cf6` a `#7c3aed`                                                                   |
| **Degradado V2**        | `kimberlite-gradient` en botones principales (`#8b5cf6` → `#d946ef`)                             |
| **Iconos**              | Material Symbols (Google Fonts) en lugar de emojis                                               |
| **Tarjetas**            | Diseño premium con borde lateral violeta (`border-l-4 border-primary`) y hover con fondo violeta |
| **Logo**                | Centrado y más grande en el sidebar, con fondo transparente                                      |
| **Modo oscuro**         | Optimizado y coherente en toda la aplicación                                                     |

### ✨ Novedades de diseño

- **Landing page mejorada:** Hero con logo grande, eslogan "The rock where diamonds are", subtítulo y botones CTA. Sección "Enterprise Grade" con features destacadas. Footer limpio y profesional.
- **Login minimalista:** Logo grande y centrado, sin títulos ni badges innecesarios. Botón con degradado Kimberlite V2.
- **Degradado Kimberlite V2:** Nuevo degradado violeta-rosa (`#8b5cf6` → `#d946ef`) en todos los botones principales.
- **Títulos en terracota:** Los títulos de las tarjetas ahora usan un tono terracota (`text-amber-700 dark:text-amber-400`) para mejorar la jerarquía visual y evitar la saturación de violeta.
- **Logo sin fondo:** Logo con fondo transparente en toda la app.
- **Sidebar** con Material Symbols (`neurology`, `sell`, `calendar_month`, `folder`, `analytics`, `star`, `logout`) y logo centrado de mayor tamaño con fondo transparente.
- **Sidebar responsive:** El sidebar se oculta en móviles con un menú hamburguesa. En pantallas grandes (`md:`) siempre está visible.
- **Header adaptativo:** El header se adapta a móviles con botón de menú y botón "Nueva nota" más compacto.
- **Filtros en azul:** Los filtros del sidebar (Modelos IA, Etiquetas, Por Fecha, Categorías) ahora usan azul en lugar de violeta, creando una paleta más equilibrada.
- **Tarjetas con borde lateral violeta:** Nuevo estilo con borde lateral en color primario (`border-l-4 border-primary`) en todas las tarjetas (Notas, Prompts y Arena). Más moderno y distintivo.
- **Selectores personalizados:** Los selectores de los modales tienen un estilo personalizado con flecha SVG y mejor contraste en modo oscuro.
- **Etiquetas con Enter:** Ahora se pueden añadir etiquetas presionando Enter en el campo de etiquetas, además de la coma. Funciona tanto en notas como en prompts.
- **Copiar en Markdown:** Nuevo botón "Copiar MD" en las tarjetas de notas, prompts y arena para copiar el contenido en formato Markdown.
- **Modo oscuro** optimizado y coherente en toda la aplicación.
- **Scrollbar personalizado** en toda la aplicación con diseño thin y colores adaptados al modo oscuro.

---

## ✨ Funcionalidades

### 🏠 Landing Page Premium

- **Hero atractivo** con logo Kimberlite grande, eslogan "The rock where diamonds are", subtítulo y botones CTA.
- **Sección "Enterprise Grade"** con features destacadas (E2E Encrypted, Zero-Knowledge, Your Knowledge Your Control).
- **Footer** limpio y profesional con enlaces a Privacy Policy, Terms y Security Audit.
- **Modo oscuro** integrado que respeta la preferencia del sistema operativo.

### 🔐 Autenticación de usuarios

- **Registro e inicio de sesión** con correo electrónico y contraseña mediante Supabase Auth.
- **OAuth** con proveedores externos (Google, GitHub, etc.) mediante callback en `/auth/callback`.
- **Login minimalista:** Logo grande y centrado, sin títulos ni badges innecesarios. Botón con degradado Kimberlite V2.
- **Recuperación de contraseña:** Flujo completo implementado con Supabase: "Forgot?" → email → reset-password.
- **Protección de rutas:** el dashboard solo es accesible para usuarios autenticados.
- **Cierre de sesión** con un clic desde el sidebar (icono Material Symbol `logout`).
- **Row Level Security (RLS):** cada usuario solo ve, crea, edita y elimina sus propios datos.

### 📝 CRUD completo de Notas

- **Crear** notas con título, contenido, resumen, etiquetas múltiples, modelo de IA asociado y prompt vinculado.
- **Leer** todas las notas en una rejilla de tarjetas con diseño responsive y animaciones fade-in-up.
- **Editar** cualquier nota directamente desde la tarjeta con un clic.
- **Eliminar** notas con confirmación previa y feedback visual mediante toast.
- **Tres métodos de entrada:** texto manual, scraping de URLs o carga de archivos (PDF, TXT, MD).
- **Títulos en terracota:** los títulos de las tarjetas usan un tono terracota (`text-amber-700 dark:text-amber-400`) para mejorar la jerarquía visual y evitar la saturación de violeta.
- **Etiquetas con Enter:** se pueden añadir etiquetas presionando Enter, además de la coma.
- **Borde lateral violeta:** las tarjetas tienen un borde lateral izquierdo en color primario (`border-l-4 border-primary`) que las hace más modernas y distintivas.

### 🌐 Scraping inteligente de URLs

- Pega una URL pública de un chat compartido (DeepSeek, ChatGPT, Claude, etc.) y la aplicación **extrae automáticamente el título y el contenido**.
- Si no se puede extraer contenido, se guarda un fallback con el enlace original.
- Corrección automática de URLs sin protocolo (se añade `https://` si falta).

### 📁 Carga de archivos (PDF, TXT, MD)

- **Sube archivos** directamente desde tu ordenador: PDF, TXT y Markdown.
- **Extracción automática de texto:** el contenido se extrae y se guarda como contenido de la nota.
- **PDFs completamente funcionales:** utiliza `pdfjs-dist` v3.11.174 con worker configurado correctamente desde CDN para parsear y extraer texto de documentos PDF de forma fiable.
- **TXT y MD:** lectura directa del contenido del archivo sin dependencias adicionales.
- **Campo de título personalizado:** al subir un archivo, puedes escribir el título de la nota manualmente antes de guardarla.
- **Selector de tipo de fuente:** el modal de notas ofrece tres pestañas intuitivas: Texto, URL y Archivo.

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

### 🔗 Enlace entre Notas y Prompts

- **Selector de prompt asociado:** al crear o editar una nota, puedes seleccionar un prompt de tu biblioteca para asociarlo.
- **Badge en la tarjeta:** las notas vinculadas a un prompt muestran un badge indicando el prompt asociado.
- **Integración fluida:** los prompts aparecen en un selector desplegable dentro del modal de notas.

### 🥊 Arena de LLMs

- **Comparación manual de respuestas:** pega el mismo prompt y las respuestas de dos modelos de IA diferentes para compararlas lado a lado.
- **Sistema de votación:** selecciona qué respuesta te ha parecido mejor (Modelo 1 o Modelo 2).
- **Resaltado del ganador:** la respuesta ganadora se muestra con un badge 🏆 y un fondo verde destacado.
- **Modal expandido (ArenaDetailModal):** haz clic en cualquier comparación para ver las respuestas completas en un modal de pantalla completa con ambas columnas lado a lado.
- **Modelos disponibles:** ChatGPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, DeepSeek-V3, Llama 3, GPT-4 Turbo, Claude 3 Opus, Gemini 2.0 Flash, Mistral Large, y posibilidad de escribir manualmente cualquier otro modelo.
- **Búsqueda en comparaciones:** filtra por el texto del prompt en la barra de búsqueda.
- **Eliminación** de comparaciones con confirmación previa.

### ⭐ Sistema de Favoritos

- **Marcar como favorito:** cada nota y prompt tiene un icono de estrella (Material Symbol `star`) que permite marcarlo como favorito con un solo clic.
- **Filtro de favoritos en el sidebar:** un botón dedicado "Ver favoritos" que muestra exclusivamente los elementos marcados como favoritos, con indicador visual "Mostrando favoritos".
- **Estado persistente:** el estado de favorito se guarda en la base de datos (`is_favorite`) y se sincroniza en tiempo real.
- **Indicador visual:** las tarjetas favoritas muestran la estrella rellena con un color dorado distintivo.

### 🏷️ Sistema de etiquetas independientes por sección

- Las etiquetas funcionan de forma **independiente** entre notas y prompts, con autosugerencia dentro de cada sección.
- **Autosugerencia inteligente:** mientras escribes, aparece un menú desplegable con sugerencias de etiquetas existentes en la misma sección, filtradas en tiempo real.
- Navegación por teclado (flechas ↑/↓, Enter para seleccionar, Escape para cerrar).
- **Eliminación global de etiquetas:** en el sidebar, cada etiqueta tiene un botón "✕" para eliminarla de todas las notas o prompts que la contengan.
- Vista rápida del conteo de notas y prompts por etiqueta en el sidebar.
- **Scroll premium de etiquetas** con efecto de desvanecimiento en los bordes (`mask-image`).

### 📊 Estadísticas en el Sidebar

- **Resumen completo** con métricas clave del usuario:
  - 📝 Total de notas guardadas (icono `description`).
  - 📚 Total de prompts en la biblioteca (icono `bolt`).
  - 🥊 Total de comparaciones realizadas en la Arena (icono `swords`).
  - ⭐ Total de elementos marcados como favoritos (icono `star` relleno).
  - 🔥 Prompt más usado (con su contador de usos).

### 🔍 Sistema de filtros avanzado

- **Búsqueda en tiempo real:** filtra por título, contenido, resumen o etiquetas.
- **Filtro por modelo de IA:** en la sección de notas, el sidebar muestra todos los modelos de IA únicos con su respectivo conteo. Al seleccionar uno, se filtran solo las notas de ese modelo.
- **Filtro por etiquetas:** selecciona una etiqueta en el sidebar para ver solo notas/prompts de esa categoría.
- **Filtros temporales:** botones rápidos para ver notas de hoy, últimos 7 días o últimos 30 días.
- **Rango de fechas personalizado:** calendario con selector "Desde" y "Hasta" para filtrar por cualquier período.
- **Filtro por categorías** en la sección de prompts (imagen, texto, código, video, MCP, otro).
- **Combinación de filtros:** todos los filtros se pueden usar simultáneamente.
- **Filtros en azul:** Los filtros del sidebar (Modelos IA, Etiquetas, Por Fecha, Categorías) ahora usan azul en lugar de violeta, creando una paleta más equilibrada.
- **Sidebar reordenado:** Modelos de IA → Etiquetas → Fechas, para una navegación más intuitiva.

### ⌨️ Atajo de teclado (⌘K)

- **Búsqueda rápida** con el atajo de teclado `⌘K` (o `Ctrl+K` en Windows/Linux).
- Abre un modal de búsqueda instantánea para localizar notas y prompts sin navegar entre secciones.

### 🔔 Notificaciones Toast

- Se han reemplazado todos los `alert()` por notificaciones elegantes con **react-hot-toast**.
- Toasts de éxito, error y carga con iconos personalizados y animaciones suaves.
- Posicionados en la esquina inferior derecha con duración configurable.

### 🎨 Diseño responsive con animaciones premium

- Interfaz adaptable a cualquier dispositivo (móvil, tablet, escritorio).
- **Sidebar responsive:** el sidebar se oculta en móviles con un menú hamburguesa. En pantallas grandes (`md:`) siempre está visible.
- **Header adaptativo:** el header se adapta a móviles con botón de menú y botón "Nueva nota" más compacto.
- **Modales responsive:** todos los modales se adaptan a cualquier pantalla con scroll interno, mejor diseño en móviles y transiciones suaves.
- **Sidebar con scroll:** en pantallas pequeñas, el sidebar tiene scroll vertical para acceder a todos los filtros y estadísticas sin perder información.
- **Modo oscuro** integrado que respeta la preferencia del sistema operativo, con colores y contrastes refinados.
- **Animaciones de entrada:** las tarjetas aparecen con un efecto `fade-in-up` escalonado (`animation-delay` progresivo) que crea una sensación de cascada visual.
- **Efectos hover:** las tarjetas se elevan (`hover:-translate-y-1.5`) con sombras premium y un brillo sutil en la esquina superior izquierda.
- **Transiciones suaves:** todas las interacciones usan `cubic-bezier(0.34,1.56,0.64,1)` para un rebote elástico natural.
- **Modal con zoom:** el modal de creación/edición aparece con un efecto `zoom-in` y fondo semitransparente con blur.
- **Efecto de borde brillante:** al hacer hover sobre una tarjeta, aparece un anillo brillante alrededor con transición de 500ms.
- **Sombras premium:** sombras personalizadas (`shadow-premium`, `shadow-premium-hover`) con variantes para modo oscuro que dan profundidad y sofisticación.
- **Skeleton loaders:** animaciones de carga placeholder mientras se obtienen los datos.
- **Scroll premium de etiquetas** con efecto de desvanecimiento en bordes y scrollbar estilizado.
- **Scrollbar personalizado** en toda la aplicación con diseño thin y colores adaptados al modo oscuro.

### 🧩 Componentes modulares

- El código está organizado en componentes React reutilizables y auto-contenidos:
  - **`NoteCard`**: tarjeta individual de nota con efectos hover, badge de modelo de IA con colores por tipo, badge de prompt asociado, icono de favoritos ⭐ y acciones.
  - **`NoteModal`**: modal de creación/edición de notas con 3 pestañas (Texto, URL, Archivo), autosugerencia de etiquetas, selector de modelo de IA y selector de prompt asociado.
  - **`PromptCard`**: tarjeta de prompt con badge de categoría por colores, contador de usos, botón de copia con feedback visual e icono de favoritos ⭐.
  - **`PromptModal`**: modal de creación/edición de prompts con selector de categorías y autosugerencia de etiquetas.
  - **`ArenaCard`**: tarjeta de comparación con dos columnas, badge del ganador y resaltado visual.
  - **`ArenaModal`**: modal de la Arena con formulario de comparación, selectores de modelo y sistema de votación.
  - **`ArenaDetailModal`**: modal expandido para ver respuestas completas lado a lado en pantalla completa.
  - **`AuthForm`**: formulario de autenticación (login/registro) con diseño minimalista, logo grande y degradado Kimberlite V2.

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
Kimberlite/
├── src/
│   ├── app/                            # Rutas y páginas (App Router de Next.js)
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts            # Callback OAuth y recovery (manejo de sesión post-autenticación)
│   │   │   └── reset-password/
│   │   │       └── page.tsx            # Página de restablecimiento de contraseña
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Dashboard con Notas, Prompts y Arena
│   │   ├── layout.tsx                  # Layout raíz con fuentes Geist + Toaster + Material Symbols
│   │   ├── page.tsx                    # Landing page + lógica de autenticación
│   │   └── globals.css                 # Estilos globales, animaciones, scroll premium, kimberlite-gradient
│   ├── components/                     # Componentes React reutilizables
│   │   ├── ArenaCard.tsx               # Tarjeta de comparación de la Arena de LLMs
│   │   ├── ArenaDetailModal.tsx        # Modal expandido de comparación (respuestas completas)
│   │   ├── ArenaModal.tsx              # Modal de la Arena con votación
│   │   ├── AuthForm.tsx                # Formulario de autenticación minimalista (login/registro)
│   │   ├── NoteCard.tsx                # Tarjeta de nota con favoritos ⭐, badge de modelo y prompt
│   │   ├── NoteModal.tsx               # Modal de notas con 3 pestañas + selector de prompts
│   │   ├── PromptCard.tsx              # Tarjeta de prompt con favoritos ⭐ y contador
│   │   └── PromptModal.tsx             # Modal de creación/edición de prompts
│   ├── lib/                            # Utilidades, helpers y lógica de negocio
│   │   └── supabaseClient.ts           # Cliente de Supabase inicializado
│   └── SupabaseClient.ts               # Cliente de Supabase (raíz, respaldo)
├── supabase/
│   └── migrations/                     # Migraciones SQL versionadas (9 migraciones)
│       ├── 001_initial_notes_table.sql
│       ├── 002_fix_rls_policies.sql
│       ├── 003_convert_tag_to_tags_array.sql
│       ├── 004_add_columns_to_notes.sql
│       ├── 005_set_default_ai_model.sql
│       ├── 006_update_prompt_categories.sql
│       ├── 007_create_arena_comparisons.sql
│       ├── 008_add_is_favorite_column.sql
│       └── 009_add_prompt_id_to_notes.sql
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

| Directorio                     | Propósito                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `src/app/`                     | Sistema de rutas basado en el App Router de Next.js. Cada subdirectorio representa una ruta.           |
| `src/app/auth/callback/`       | Ruta de callback OAuth para manejo de sesión post-autenticación y recovery de contraseña.              |
| `src/app/auth/reset-password/` | Página de restablecimiento de contraseña con flujo completo de Supabase.                               |
| `src/app/dashboard/`           | Dashboard principal con tabs de Notas, Prompts y Arena, sidebar responsive con filtros y estadísticas. |
| `src/components/`              | Componentes React atómicos y reutilizables (autenticación, tarjetas, modales, arena).                  |
| `src/lib/`                     | Lógica compartida: cliente de Supabase, helpers, utilidades.                                           |
| `supabase/migrations/`         | Migraciones SQL versionadas para la base de datos PostgreSQL.                                          |
| `scripts/`                     | Scripts Node.js para tareas auxiliares (migraciones, tests de conexión).                               |
| `docs/`                        | Documentación técnica detallada (arquitectura, componentes, base de datos).                            |

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

| Orden | Archivo                             | Descripción                                    |
| ----- | ----------------------------------- | ---------------------------------------------- |
| 1     | `001_initial_notes_table.sql`       | Crear tabla `notes` + RLS                      |
| 2     | `002_fix_rls_policies.sql`          | Hard Reset de políticas RLS                    |
| 3     | `003_convert_tag_to_tags_array.sql` | Convertir columna `tag` a `tags` (TEXT[])      |
| 4     | `004_add_columns_to_notes.sql`      | Añadir columnas a `notes`                      |
| 5     | `005_set_default_ai_model.sql`      | Establecer DeepSeek-R1 como modelo por defecto |
| 6     | `006_update_prompt_categories.sql`  | Actualizar categorías de prompts               |
| 7     | `007_create_arena_comparisons.sql`  | Crear tabla `arena_comparisons`                |
| 8     | `008_add_is_favorite_column.sql`    | Añadir columna `is_favorite` a notes y prompts |
| 9     | `009_add_prompt_id_to_notes.sql`    | Añadir columna `prompt_id` a notes             |

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
| `prompt_id`   | `BIGINT`      | Referencia al prompt asociado (FK)           |

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

## 🎨 Colores Kimberlite

| Elemento                | Color                                                     |
| ----------------------- | --------------------------------------------------------- |
| **Primario**            | Violeta `#8b5cf6` → Rosa `#d946ef` (degradado en botones) |
| **Títulos de tarjetas** | Terracota `#b45309` (dark: `#d97706`)                     |
| **Filtros sidebar**     | Azul `#3b82f6`                                            |
| **Borde lateral**       | Violeta `#8b5cf6` (`border-l-4 border-primary`)           |

---

## ✅ Estado del proyecto

Todas las funcionalidades principales están **operativas y probadas**. La aplicación es **completamente responsive** y funciona correctamente en dispositivos móviles, tablets y escritorio.

### Novedades de esta sesión

- ✅ **Inputs unificados:** Todos los inputs del proyecto (AuthForm, header search, date pickers, sidebar) comparten el mismo estándar: `h-[44px] rounded-lg bg-zinc-950 border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-180`.
- ✅ **Empty states rediseñados:** Reemplazados emojis (📭📚🥊) por Material Symbols profesionales (`inbox`, `library_books`, `swords`) en `text-[32px] text-zinc-700`. Eliminados bordes `dashed` por `border border-zinc-800/20`.
- ✅ **Error/Success banners:** Reemplazados emojis ❌✅ por Material Symbols (`error`, `check_circle`) con diseño consistente.
- ✅ **ArenaDetailModal rediseñado:** Ahora usa el mismo sistema visual que NoteModal/PromptModal: `bg-zinc-900 shadow-premium border-zinc-800/40 rounded-xl`, sin colores distintos por modelo, badge de ganador con icono `emoji_events`.
- ✅ **globals.css limpiado:** Eliminadas clases duplicadas (`.card-dark`, `.input-dark`, `.auth-card`, `.scrollbar-thin` duplicado, `.scroll-tags`).
- ✅ **Subida de archivos completamente funcional:** PDF, TXT y MD con extracción automática de texto. El contenido extraído se guarda correctamente en la nota.
- ✅ **Sidebar responsive:** El sidebar se oculta en móviles con un menú hamburguesa. En pantallas grandes (`md:`) siempre está visible.
- ✅ **Header adaptativo:** El header se adapta a móviles con botón de menú y botón "Nueva nota" más compacto.
- ✅ **Colores de títulos:** Los títulos de las tarjetas ahora usan un tono terracota (`text-amber-700 dark:text-amber-400`) para mejorar la jerarquía visual y evitar la saturación de violeta.
- ✅ **Etiquetas con Enter:** Se pueden añadir etiquetas presionando Enter en el campo de etiquetas (además de la coma).
- ✅ **Copiar en Markdown:** Nuevo botón "Copiar MD" en las tarjetas de notas, prompts y arena.
- ✅ **Diseño de tarjetas:** Nuevo estilo con borde lateral en color primario (violeta) en todas las tarjetas (Notas, Prompts y Arena). Más moderno y distintivo.
- ✅ **Colores en el sidebar:** Los filtros (Modelos IA, Etiquetas, Por Fecha, Categorías) ahora usan azul en lugar de violeta, creando una paleta más equilibrada.
- ✅ **Selectores mejorados:** Los selectores de los modales ahora tienen un estilo personalizado con flecha SVG y mejor contraste en modo oscuro.
- ✅ **Landing page mejorada:** Hero con logo grande, eslogan "The rock where diamonds are", subtítulo y botones CTA. Sección "Enterprise Grade" con features destacadas. Footer limpio y profesional.
- ✅ **Login minimalista:** Logo grande y centrado, sin títulos ni badges innecesarios. Botón con degradado Kimberlite V2.
- ✅ **Recuperación de contraseña:** Implementada con Supabase. Flujo completo: "Forgot?" → email → reset-password.
- ✅ **Degradado Kimberlite V2:** Nuevo degradado violeta-rosa (`#8b5cf6` → `#d946ef`) en todos los botones principales.
- ✅ **Logo sin fondo:** Logo con fondo transparente en toda la app.
- ✅ **Sidebar con Material Symbols** y logo centrado de mayor tamaño con fondo transparente.
- ✅ **Modo oscuro optimizado** y coherente en toda la aplicación.
- ✅ **Scrollbar personalizado** en toda la aplicación con diseño thin y colores adaptados al modo oscuro.
- ✅ **Atajo de teclado ⌘K** para búsqueda rápida de notas y prompts.
- ✅ **Callback OAuth** implementado en `/auth/callback/route.ts` para autenticación con proveedores externos.
- ✅ **Google OAuth configurado** (pendiente de URL definitiva).
- ✅ **Navegación reordenada:** El menú lateral ahora sigue el flujo natural del usuario: **Prompts → Notas → Arena**. Los contadores también respetan este orden.
- ✅ **Pestaña por defecto:** El dashboard abre directamente en **Prompts** (antes abría en Notas), reflejando que el prompt es el origen del conocimiento.
- ✅ **Selector de prompts en la Arena:** Nuevo selector en `ArenaModal.tsx` que permite cargar un prompt guardado directamente en el campo "Prompt a comparar", usando el mismo `PopoverSelect` que en `NoteModal.tsx`. Al seleccionar un prompt, su contenido se carga automáticamente.
- ✅ **Prompt asociado en ArenaDetailModal:** Renombrado el campo "Prompt" a "Prompt asociado" en el modal de detalle de la Arena para mantener consistencia con el modal de notas.
- ✅ **Onboarding guiado con empty states:** Los estados vacíos ahora son experiencias de onboarding que enseñan el producto. Cada sección (Prompts, Notas, Arena) incluye: icono Material Symbol, título descriptivo, texto de beneficio, botón CTA con degradado Kimberlite y una tarjeta de ejemplo no interactiva al 80% de opacidad que muestra cómo se verá el contenido real. Inspirado en Notion, Linear y Raycast.

---

<div align="center">
  <sub>Hecho con ❤️ usando Next.js, Supabase y Tailwind CSS</sub>
</div>
