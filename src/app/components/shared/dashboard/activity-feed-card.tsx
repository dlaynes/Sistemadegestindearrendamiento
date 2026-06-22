import { useRecentActivity } from '../../../hooks/queries/use-dashboard-query';
import type { ActivityItem } from '../../../services/dashboard.service';
import { ActivityItem as ActivityItemView } from './activity-item';

export interface ActivityFeedCardProps {
  /**
   * Title shown in the card header. Defaults to "Actividad Reciente" so
   * the three dashboards share the same component without each having to
   * pass it explicitly.
   */
  title?: string;
  /**
   * Maximum number of items to render. The backend returns the 50 most
   * recent events for the current user; we trim here so the card stays
   * compact in the dashboard layout.
   */
  limit?: number;
  /**
   * Render inside an empty-state paragraph instead of returning null so the
   * caller doesn't have to handle the "no events" case separately.
   */
  emptyMessage?: string;
}

/**
 * Reads the activity feed for the current user via the useRecentActivity hook
 * and renders it as a list of ActivityItem rows inside a card. The empty
 * state is shown when the API returns no events.
 */
export function ActivityFeedCard({
  title = 'Actividad Reciente',
  limit = 8,
  emptyMessage = 'Sin actividad reciente.',
}: ActivityFeedCardProps) {
  const { data: items, isLoading } = useRecentActivity();
  const visible = (items ?? []).slice(0, limit);

  return (
    <section className="rounded-xl border border-border-subtle bg-card shadow-elev-xs">
      <header className="border-b border-border-subtle px-6 py-4">
        <h2 className="text-h2 font-semibold text-foreground">{title}</h2>
      </header>
      <div className="divide-y divide-border-subtle">
        {isLoading ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            Cargando actividad…
          </p>
        ) : visible.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          visible.map((activity: ActivityItem, index: number) => (
            <ActivityItemView
              key={index}
              type={activity.type}
              description={activity.description}
              time={activity.time}
              status={activity.status}
            />
          ))
        )}
      </div>
    </section>
  );
}
