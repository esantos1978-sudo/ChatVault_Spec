"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ============================================================
// ETIQUETAS DE CONVERSACIÓN DETECTABLES
// ============================================================
const CONVERSATION_LABELS = [
  "Usuario:",
  "User:",
  "Tú:",
  "Gemini:",
  "Assistant:",
  "Asistente:",
  "ChatGPT:",
  "Claude:",
  "DeepSeek:",
];

// ============================================================
// NORMALIZACIÓN DEL CONTENIDO
// ============================================================

/**
 * Normaliza saltos de línea: más de dos consecutivos → exactamente dos.
 */
function normalizeLineBreaks(text: string): string {
  return text.replace(/\n{3,}/g, "\n\n");
}

/**
 * Convierte líneas que parecen listas simples (1. texto, - texto, • texto)
 * a sintaxis Markdown si no lo están ya.
 */
function normalizeSimpleLists(text: string): string {
  return text.replace(/^(\s*)(\d+)[.)]\s+/gm, "$1$2. ");
}

/**
 * Separa el contenido en bloques de conversación cuando se detectan
 * etiquetas al inicio de una línea.
 */
function splitConversationBlocks(text: string): string[] {
  // Buscamos líneas que empiecen con una etiqueta de conversación
  const labelPattern = new RegExp(
    `^(${CONVERSATION_LABELS.map((l) =>
      l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    ).join("|")})`,
    "im",
  );

  const lines = text.split("\n");
  const blocks: string[] = [];
  let currentBlock: string[] = [];

  for (const line of lines) {
    if (labelPattern.test(line.trim()) && currentBlock.length > 0) {
      // Guardamos el bloque anterior
      blocks.push(currentBlock.join("\n"));
      currentBlock = [line];
    } else {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join("\n"));
  }

  return blocks;
}

/**
 * Determina si un texto parece tener estructura Markdown clara.
 */
function hasMarkdownStructure(text: string): boolean {
  const markdownPatterns = [
    /^#{1,6}\s+/m, // headings
    /\[([^\]]+)\]\(([^)]+)\)/, // links
    /```[\s\S]*?```/, // code blocks
    /^\|.*\|$/m, // tables
    /^>\s+/m, // blockquotes
    /^[-*+]\s+/m, // unordered lists
    /^\d+[.)]\s+/m, // ordered lists
    /^---$/m, // horizontal rules
    /[*_]{1,3}[^*_]+[*_]{1,3}/, // bold/italic
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
}

// ============================================================
// SANITIZADOR DE HTML
// ============================================================

/**
 * Elimina etiquetas HTML peligrosas del contenido.
 * No usamos dangerouslySetInnerHTML, pero si el contenido
 * contiene HTML, lo sanitizamos antes de pasarlo a ReactMarkdown.
 */
function sanitizeContent(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*\S+/gi, "")
    .replace(/javascript\s*:/gi, "");
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

interface ConversationContentProps {
  content: string;
  className?: string;
}

export default function ConversationContent({
  content,
  className = "",
}: ConversationContentProps) {
  // 1. Sanitizar
  const sanitized = sanitizeContent(content);

  // 2. Normalizar saltos de línea
  const normalized = normalizeLineBreaks(sanitized);

  // 3. Detectar si hay etiquetas de conversación
  const hasConversationLabels = CONVERSATION_LABELS.some((label) =>
    new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "im").test(
      normalized,
    ),
  );

  // 4. Detectar si hay estructura Markdown
  const hasMarkdown = hasMarkdownStructure(normalized);

  // 5. Normalizar listas simples
  const withLists = normalizeSimpleLists(normalized);

  // 6. Separar en bloques de conversación si aplica
  const blocks = hasConversationLabels
    ? splitConversationBlocks(withLists)
    : [withLists];

  // ============================================================
  // RENDERIZADOR: elige entre Markdown o texto plano
  // ============================================================

  /**
   * Renderiza texto plano (sin Markdown) con estilos de párrafo.
   * Respeta los saltos de línea como <br/>.
   */
  const renderPlainText = (text: string, key: number) => (
    <div key={key} className="plain-text">
      {text.split("\n").map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {line || <span className="block h-4" />}
        </React.Fragment>
      ))}
    </div>
  );

  /**
   * Renderiza contenido Markdown con estilos personalizados.
   */
  const renderMarkdown = (text: string, key: number) => (
    <div key={key} className="conversation-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              className="text-xl font-bold text-zinc-100 mt-6 mb-3 pb-1 border-b border-zinc-800/30"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-lg font-semibold text-zinc-100 mt-5 mb-2 pb-1 border-b border-zinc-800/20"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-base font-semibold text-zinc-100 mt-4 mb-2"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-sm font-semibold text-zinc-200 mt-3 mb-1"
              {...props}
            >
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5
              className="text-sm font-medium text-zinc-300 mt-3 mb-1"
              {...props}
            >
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6
              className="text-xs font-medium text-zinc-400 mt-2 mb-1 uppercase tracking-wider"
              {...props}
            >
              {children}
            </h6>
          ),
          p: ({ children, ...props }) => (
            <p
              className="text-sm text-zinc-300 leading-relaxed mb-3 last:mb-0"
              {...props}
            >
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul
              className="list-disc list-inside text-sm text-zinc-300 space-y-1 mb-3 ml-2"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="list-decimal list-inside text-sm text-zinc-300 space-y-1 mb-3 ml-2"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-sm text-zinc-300 leading-relaxed" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-2 border-violet-500/40 pl-4 py-1 my-3 text-sm text-zinc-400 italic bg-zinc-900/30 rounded-r-lg"
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-zinc-800/80 text-[13px] font-mono text-amber-300 break-all"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="block bg-zinc-900/80 border border-zinc-800/40 rounded-lg p-4 text-[13px] font-mono text-zinc-200 leading-relaxed overflow-x-auto whitespace-pre-wrap break-all my-3"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre className="mb-3 last:mb-0" {...props}>
              {children}
            </pre>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-3">
              <table
                className="min-w-full text-sm text-zinc-300 border-collapse border border-zinc-800/40 rounded-lg"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-zinc-900/60" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-zinc-800/30" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-zinc-800/20 transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-3 py-2 text-left text-xs font-semibold text-zinc-200 uppercase tracking-wider border-b border-zinc-800/40"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-3 py-2 text-sm text-zinc-300 border-b border-zinc-800/20"
              {...props}
            >
              {children}
            </td>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors break-all"
              {...props}
            >
              {children}
            </a>
          ),
          hr: (props) => <hr className="my-4 border-zinc-800/40" {...props} />,
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-zinc-100" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-zinc-200" {...props}>
              {children}
            </em>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );

  /**
   * Renderiza un bloque de texto (con o sin Markdown).
   */
  const renderBlock = (text: string, key: number) => {
    if (hasMarkdown) {
      return renderMarkdown(text, key);
    }
    return renderPlainText(text, key);
  };

  // ============================================================
  // RENDER: SIN ETIQUETAS DE CONVERSACIÓN
  // ============================================================
  if (!hasConversationLabels) {
    return (
      <div className={`prose-custom ${className}`}>
        {renderBlock(withLists, 0)}
      </div>
    );
  }

  // ============================================================
  // RENDER: CON ETIQUETAS DE CONVERSACIÓN → BLOQUES VISUALES
  // ============================================================
  return (
    <div className={`conversation-blocks space-y-3 ${className}`}>
      {blocks.map((block, index) => {
        const labelMatch = block.match(
          new RegExp(
            `^(${CONVERSATION_LABELS.map((l) =>
              l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            ).join("|")})`,
            "im",
          ),
        );
        const label = labelMatch ? labelMatch[1] : null;

        const isUser = label
          ? ["Usuario:", "User:", "Tú:"].includes(label)
          : false;
        const isAssistant = label
          ? [
              "Gemini:",
              "Assistant:",
              "Asistente:",
              "ChatGPT:",
              "Claude:",
              "DeepSeek:",
            ].includes(label)
          : false;

        const labelColor = isUser
          ? "text-emerald-400"
          : isAssistant
            ? "text-violet-400"
            : "text-zinc-400";

        const blockBg = isUser
          ? "bg-emerald-500/5"
          : isAssistant
            ? "bg-violet-500/5"
            : "bg-transparent";

        const blockBorder = isUser
          ? "border-emerald-500/10"
          : isAssistant
            ? "border-violet-500/10"
            : "border-transparent";

        return (
          <div
            key={index}
            className={`rounded-lg border ${blockBg} ${blockBorder} p-4`}
          >
            {label && (
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800/20">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${labelColor}`}
                >
                  {label}
                </span>
              </div>
            )}
            {renderBlock(
              label ? block.replace(label, "").trim() : block,
              index,
            )}
          </div>
        );
      })}
    </div>
  );
}
