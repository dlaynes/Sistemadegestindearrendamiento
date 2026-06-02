import { Skeleton } from '../../ui/skeleton';

export function PropertyListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-10 w-full max-w-md rounded-md" />
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border-subtle bg-card shadow-elev-xs"
          >
            <div className="bg-primary-muted/70 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </div>
            <div className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
