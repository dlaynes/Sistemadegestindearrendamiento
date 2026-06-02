import { Skeleton } from '../../ui/skeleton';

interface TableListSkeletonProps {
  rows?: number;
  showHeader?: boolean;
}

export function TableListSkeleton({ rows = 5, showHeader = true }: TableListSkeletonProps) {
  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      )}

      <div className="rounded-xl border border-border-subtle bg-card shadow-elev-xs">
        <div className="border-b border-border-subtle px-6 py-4">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
