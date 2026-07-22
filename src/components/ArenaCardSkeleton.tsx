export function ArenaCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 p-5 animate-pulse">
      {/* Prompt */}
      <div className="h-5 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3" />
      {/* Modelos enfrentados */}
      <div className="grid grid-cols-2 gap-2">
        <div className="h-16 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-16 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
      {/* Ganador */}
      <div className="h-8 w-1/3 rounded-lg bg-zinc-200 dark:bg-zinc-800 mt-3" />
    </div>
  );
}
