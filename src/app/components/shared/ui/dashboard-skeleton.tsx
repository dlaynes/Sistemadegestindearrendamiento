import { Skeleton } from '../../ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-xl border border-border-subtle bg-card p-5 shadow-elev-xs"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-24" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border-subtle bg-card shadow-elev-xs">
          <div className="border-b border-border-subtle px-6 py-4">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="divide-y divide-border-subtle">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-card shadow-elev-xs">
          <div className="border-b border-border-subtle px-6 py-4">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-surface p-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
