export function NoteCardSkeleton() {
  return (
    <div className="kl-card p-5 animate-pulse">
      {/* Header: tags */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2">
          <div className="kl-skeleton h-6 w-16 rounded-full" />
          <div className="kl-skeleton h-6 w-12 rounded-full" />
        </div>
        <div className="flex gap-1">
          <div className="kl-skeleton h-8 w-8 rounded-lg" />
          <div className="kl-skeleton h-8 w-8 rounded-lg" />
        </div>
      </div>
      {/* Título */}
      <div className="kl-skeleton h-5 w-3/4 rounded-lg mb-3" />
      {/* Contenido */}
      <div className="kl-skeleton h-16 w-full rounded-xl mb-3" />
      {/* Footer */}
      <div className="kl-skeleton h-10 w-full rounded-xl" />
    </div>
  );
}
