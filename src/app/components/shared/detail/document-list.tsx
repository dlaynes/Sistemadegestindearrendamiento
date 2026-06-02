import { FileText, Download, Eye, Trash2 } from 'lucide-react';
import { cn } from '../../ui/utils';

export interface Document {
  id?: string | number;
  name: string;
  size: string;
  icon?: React.ElementType;
  type?: string;
}

interface DocumentListProps {
  title: string;
  documents: Document[];
  className?: string;
  onView?: (doc: Document) => void;
  onDownload?: (doc: Document) => void | Promise<void>;
  onDelete?: (doc: Document) => void | Promise<void>;
  emptyMessage?: string;
}

export function DocumentList({
  title,
  documents,
  className,
  onView,
  onDownload,
  onDelete,
  emptyMessage = 'No hay documentos adjuntos',
}: DocumentListProps) {
  const DefaultIcon = FileText;

  return (
    <div
      className={cn(
        'rounded-xl border border-border-subtle bg-card shadow-elev-xs',
        className,
      )}
    >
      <div className="border-b border-border-subtle px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      <div className="divide-y divide-border-subtle">
        {documents.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">{emptyMessage}</div>
        ) : (
          documents.map((doc, index) => {
            const IconComponent = doc.icon || DefaultIcon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 transition-colors hover:bg-surface"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-muted-foreground ring-1 ring-inset ring-border-subtle">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{doc.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {onView && (
                    <button
                      type="button"
                      onClick={() => onView(doc)}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                      title="Ver"
                      aria-label="Ver documento"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  {onDownload && (
                    <button
                      type="button"
                      onClick={() => onDownload(doc)}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-primary"
                      title="Descargar"
                      aria-label="Descargar documento"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(doc)}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive-muted hover:text-destructive"
                      title="Eliminar"
                      aria-label="Eliminar documento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
