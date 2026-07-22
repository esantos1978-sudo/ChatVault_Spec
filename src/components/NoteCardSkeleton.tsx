export function NoteCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 p-5 animate-pulse">
      {/* Header: tags */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="flex gap-1">
          <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
      {/* Título */}
      <div className="h-5 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3" />
      {/* Contenido */}
      <div className="h-16 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-3" />
      {/* Footer */}
      <div className="h-10 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
