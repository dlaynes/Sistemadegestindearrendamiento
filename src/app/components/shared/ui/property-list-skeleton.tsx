import { Skeleton } from '../../ui/skeleton';

export function PropertyListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      {/* Property cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="bg-primary p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg bg-primary-foreground/20" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 bg-primary-foreground/20" />
                  <Skeleton className="h-3 w-48 bg-primary-foreground/20" />
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
