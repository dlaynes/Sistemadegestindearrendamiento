import * as React from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { cn } from '../../ui/utils';

interface Document {
  /**
   * Document name
   */
  name: string;
  /**
   * Document size (e.g., "2.5 MB")
   */
  size: string;
  /**
   * Document type icon
   */
  icon?: React.ElementType;
  /**
   * Document type (pdf, doc, etc.)
   */
  type?: string;
}

interface DocumentListProps {
  /**
   * Section title
   */
  title: string;
  /**
   * Array of documents
   */
  documents: Document[];
  /**
   * Optional additional class names
   */
  className?: string;
  /**
   * Handler for viewing a document
   */
  onView?: (doc: Document) => void;
  /**
   * Handler for downloading a document
   */
  onDownload?: (doc: Document) => void;
  /**
   * Empty state message
   */
  emptyMessage?: string;
}

/**
 * DocumentList - A reusable document list component for detail views
 * 
 * Usage:
 * ```tsx
 * <DocumentList
 *   title="Documentos"
 *   documents={[
 *     { name: 'Contrato.pdf', size: '2.5 MB', type: 'pdf' },
 *     { name: 'Recibo.pdf', size: '1.2 MB', type: 'pdf' },
 *   ]}
 *   onView={handleView}
 *   onDownload={handleDownload}
 * />
 * ```
 */
export function DocumentList({
  title,
  documents,
  className,
  onView,
  onDownload,
  emptyMessage = 'No hay documentos adjuntos',
}: DocumentListProps) {
  const DefaultIcon = FileText;

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {documents.length === 0 ? (
          <div className="p-4 text-center text-gray-500">{emptyMessage}</div>
        ) : (
          documents.map((doc, index) => {
            const IconComponent = doc.icon || DefaultIcon;
            return (
              <div
                key={index}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.size}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {onView && (
                    <button
                      onClick={() => onView(doc)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ver"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {onDownload && (
                    <button
                      onClick={() => onDownload(doc)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Descargar"
                    >
                      <Download className="w-4 h-4" />
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
