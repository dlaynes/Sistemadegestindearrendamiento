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
    <div className={cn('bg-card rounded-lg shadow-sm border border-border', className)}>
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {documents.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">{emptyMessage}</div>
        ) : (
          documents.map((doc, index) => {
            const IconComponent = doc.icon || DefaultIcon;
            return (
              <div
                key={index}
                className="p-4 flex items-center justify-between hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <IconComponent className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{doc.size}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {onView && (
                    <button
                      onClick={() => onView(doc)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="Ver"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {onDownload && (
                    <button
                      onClick={() => onDownload(doc)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="Descargar"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(doc)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
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
