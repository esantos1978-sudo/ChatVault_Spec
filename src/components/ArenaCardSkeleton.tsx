export function ArenaCardSkeleton() {
  return (
    <div className="kl-card p-5 animate-pulse">
      {/* Prompt */}
      <div className="kl-skeleton h-5 w-3/4 rounded-lg mb-3" />
      {/* Modelos enfrentados */}
      <div className="grid grid-cols-2 gap-2">
        <div className="kl-skeleton h-16 rounded-xl" />
        <div className="kl-skeleton h-16 rounded-xl" />
      </div>
      {/* Ganador */}
      <div className="kl-skeleton h-8 w-1/3 rounded-lg mt-3" />
    </div>
  );
}
