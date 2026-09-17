export default function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface-container border-2 border-outline-variant/30 rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-square bg-surface-container-highest" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-1/3 bg-surface-container-highest rounded" />
            <div className="h-4 w-3/4 bg-surface-container-highest rounded" />
            <div className="pt-2 border-t border-outline-variant/20 h-3 w-1/2 bg-surface-container-highest rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
