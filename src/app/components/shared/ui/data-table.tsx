import type { ReactNode } from 'react';
import { cn } from '../../ui/utils';

export interface DataTableColumn<Row> {
  key: string;
  header: ReactNode;
  cellClassName?: string;
  headerClassName?: string;
  render: (row: Row, index: number) => ReactNode;
}

export interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row, index: number) => string | number;
  emptyMessage?: ReactNode;
  className?: string;
}

/**
 * DataTable — token-only table primitive.
 * Sticky header on --surface, row dividers on --border-subtle, body on --card.
 */
export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'Sin registros',
  className,
}: DataTableProps<Row>) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border-subtle bg-card shadow-elev-xs',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={rowKey(row, idx)}
                  className="transition-colors hover:bg-surface"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 align-middle text-sm text-foreground',
                        col.cellClassName,
                      )}
                    >
                      {col.render(row, idx)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
