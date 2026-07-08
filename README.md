# 🔒 ChatVault

**Tus notas seguras en la nube.** ChatVault es una aplicación web moderna para organizar, almacenar y buscar conversaciones con modelos de lenguaje (LLMs) como ChatGPT, DeepSeek, Claude y Gemini. Permite la curaduría manual de chats mediante texto copiado, importación automática desde URLs públicas, y etiquetado inteligente para una búsqueda rápida y eficiente.

---

## 🚀 Tecnologías

| Tecnología       | Propósito                                     |
| ---------------- | --------------------------------------------- |
| **Next.js 16**   | Framework React con App Router                |
| **TypeScript**   | Tipado estricto (`strict: true`)              |
| **Tailwind CSS** | Estilos utilitarios y diseño responsive       |
| **Supabase**     | Backend como servicio (Auth + DB PostgreSQL)  |
| **ESLint**       | Linting con configuración estándar de Next.js |

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
│   ├── app/                    # Rutas y páginas (App Router de Next.js)
│   │   ├── api/
│   │   │   └── scrape/         # API route para scraping de URLs
│   │   ├── layout.tsx          # Layout raíz con fuentes Geist
│   │   ├── page.tsx            # Página principal (gestor de notas)
│   │   └── globals.css         # Estilos globales
│   ├── components/             # Componentes React reutilizables
│   │   └── AuthForm.tsx        # Formulario de autenticación (login/registro)
│   └── lib/                    # Utilidades, helpers y lógica de negocio
│       └── supabaseClient.ts   # Cliente de Supabase inicializado
├── supabase/
│   └── migrations/             # Migraciones SQL de la base de datos
│       └── 00001_create_notes_table.sql
├── scripts/                    # Scripts auxiliares
│   ├── run-migration.mjs       # Ejecuta migraciones contra Supabase
│   └── test-supabase.mjs       # Verifica la conexión con Supabase
├── docs/                       # Documentación técnica
│   ├── arquitectura.md         # ADRs y decisiones arquitectónicas
│   ├── components.md           # Documentación de componentes
│   └── database.md             # Esquema y políticas de la base de datos
├── .specify/
│   └── constitution.md         # Constitución del proyecto (Spec Kit)
├── .env.local                  # ⚠️ Variables de entorno (NO SUBIR A GIT)
├── .gitignore                  # Ignora .env.local, node_modules, .next, etc.
├── next.config.ts              # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind CSS
└── tsconfig.json               # Configuración de TypeScript (strict mode)
```

### Descripción de directorios clave

| Directorio             | Propósito                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `src/app/`             | Sistema de rutas basado en el App Router de Next.js. Cada subdirectorio representa una ruta. |
| `src/components/`      | Componentes React atómicos y reutilizables (ej: formulario de autenticación).                |
| `src/lib/`             | Lógica compartida: cliente de Supabase, helpers, utilidades.                                 |
| `supabase/migrations/` | Migraciones SQL versionadas para la base de datos PostgreSQL.                                |
| `scripts/`             | Scripts Node.js para tareas auxiliares (migraciones, tests de conexión).                     |
| `docs/`                | Documentación técnica detallada (arquitectura, componentes, base de datos).                  |

---

## 🧪 Scripts disponibles

| Comando         | Descripción                         |
| --------------- | ----------------------------------- |
| `npm run dev`   | Inicia el servidor de desarrollo    |
| `npm run build` | Compila el proyecto para producción |
| `npm run start` | Inicia el servidor en producción    |
| `npm run lint`  | Ejecuta ESLint en todo el proyecto  |

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
